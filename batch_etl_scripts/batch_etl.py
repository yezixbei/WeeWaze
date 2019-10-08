from pyspark import SparkContext, SparkConf
from pyspark.sql import SQLContext
from pyspark.sql.types import *
from pyspark.sql.functions import *
from pyspark.sql.window import Window
from math import log10
import psycopg2
import os
import sys

sys.path.append(os.path.abspath('./config.py'))
import config


if __name__ == '__main__':

    TIMEFMT = "MM/dd/yyyy HH:mm:ss"
    COLSFMT = ["dayofweek", "hour", "direction", "latitude", "longitude", "speed"]

    GRIDLEN = 100
    NUM_DEC_PLACES = int(log10(GRIDLEN*10))

    MIN_SPEED = 9.0
    MAX_SPEED = 70.0
    
    MIN_LON = -122.513 # SF city limits
    MAX_LON = -122.358
    MIN_LAT = 37.709
    MAX_LAT = 37.807

    conf = (SparkConf()
            .setAppName(config["app_name"])
            .setMaster("spark://%s:7077" % (config["master_ip"]))
            .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer"))
    sc = SparkContext(conf=conf)
    sqlContext = SQLContext(sc)
    sc._jsc.hadoopConfiguration().set("fs.s3n.awsAccessKeyId", "AWS_ACCESS_KEY")
    sc._jsc.hadoopConfiguration().set("fs.s3n.awsSecretAccessKey", "AWS_SECRET_KEY")
    sc.setLogLevel("ERROR")




    # Ingest from the batch layer, which is an S3 bucket holding 87GB of GPS log files from SFMTA
    rdd = sc.textFile(config["files"]) 
    rdd = (rdd
            .map(lambda x: x.encode("ascii", "ignore"))
            .map(lambda x: x.split(","))
            .filter(lambda x: len(x) == 9))

    df = sqlContext.createDataFrame(rdd) 



    # Start computing the batch view
    lon = df._4.cast("double")
    lat = df._5.cast("double")
    vel = df._6.cast("double")
    dirr = df._7.cast("double")
    time = unix_timestamp(df._2, TIMEFMT).cast("timestamp")

    # Filter
    speedFilter = (MIN_SPEED < vel) & (vel < MAX_SPEED) 
    lonFilter = (MIN_LON < lon) & (lon < MAX_LON)
    latFilter = (MIN_LAT < lat) & (lat < MAX_LAT)
    df = df.filter(speedFilter).filter(lonFilter).filter(latFilter)

    # Format the columns
    df = (df
            .withColumn("dayofweek", dayofweek(time))
            .withColumn("hour", hour(time))
            .withColumn("direction", floor(dirr/180.0))
            .withColumn("latitude", round(lat, NUM_DEC_PLACES))
            .withColumn("longitude", round(lon, NUM_DEC_PLACES))
            .withColumn("speed", vel))

    df = df.select(COLSFMT)

    # The main batch computation is a costly group by here
    df = df.repartition("latitude")

    df = df.groupBy("dayofweek", "hour", "direction", "latitude", "longitude").agg(sum("speed").alias("speed_sum"), count("speed").alias("speed_count"))




    # Save the batch views into a postgres database for quick queries 
    # Generate traffic maps using tuples of (dayofweek, min_hour, max_hour, direction)
    conn_string = ("host=%s dbname=%s user=%s password=%s" % (config["host"],
                                                            config["dbname"],
                                                            config["user"],
                                                            config["password"]))
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()

    droptable = "DROP TABLE IF EXISTS %s" % (config["table"])
    cursor.execute(droptable)
    createtable = "CREATE TABLE %s (dayofweek smallint NOT NULL, hour smallint NOT NULL, direction smallint NOT NULL, speed_sum numeric(13) NOT NULL, speed_count numeric(13) NOT NULL, latitude numeric(5, 2), longitude numeric(5, 2), primary key (direction, dayofweek, hour, speed_sum, speed_count));" % (
    config["table"])
    cursor.execute(createtable)

    conn.commit()

    (df.write.format("jdbc")
    .mode("overwrite")
    .option("driver", config["driver"])
    .option("url", config["url"])
    .option("dbtable", "%s" % (config["table"]))
    .option("user", config["user"])
    .option("password", config["password"])
    .save())

    cursor.close()
    conn.close()