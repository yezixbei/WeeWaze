from pyspark import SparkContext, SparkConf
from pyspark.sql import SQLContext
from pyspark.sql.types import *
from pyspark.sql.functions import *
from pyspark.sql.window import Window
from math import log10
import psycopg2


if __name__ == '__main__':

    # Init
    config = {
        "masterIP" : "ip-10-0-0-12",
        "files" : "s3a://yezi-bei-bucket-insight/sfmtaAVLRawData*.csv",
        "driver" : "org.postgresql.Driver", 
        "host" : "ip-10-0-0-12",
        "port" : "5432", 
        "dbname" : "mydb", 
        "table" : "mytable", 
        "url" : "jdbc:postgresql://ip-10-0-0-12:5432/mydb", 
        "user" : "yezi",
        "password" : "yeziyezi" 
    }

    TIMEFMT = "MM/dd/yyyy HH:mm:ss"
    KEEP = ["isWeekend", "daySegment", "latitude", "longitude", "direction", "speed"]

    NUM_DIRECTIONS = 8
    NUM_DAY_SEGMENTS = 6
    GRIDLEN = 100
    NUM_DEC_PLACES = int(log10(GRIDLEN*10))
    MIN_SPEED = 2.0
    R = 6371
    ASPECT_RATIO = 0.79042343742
    MIN_X = -650000
    MIN_Y = 220000

    conf = (SparkConf()
                .setAppName("yezi-insight-app")
                .setMaster("spark://%s:7077" % (config["masterIP"]))
                .set( "spark.serializer", "org.apache.spark.serializer.KryoSerializer" ))
    sc = SparkContext(conf=conf)
    sqlContext = SQLContext(sc)

    sc._jsc.hadoopConfiguration().set("fs.s3n.awsAccessKeyId", "AWS_ACCESS_KEY")
    sc._jsc.hadoopConfiguration().set("fs.s3n.awsSecretAccessKey", "AWS_SECRET_KEY")
    sc.setLogLevel("ERROR")



    # Extract
    rdd = sc.textFile(config["files"]) 
    rdd = (rdd
            .map(lambda x: x.encode("ascii", "ignore"))
            .map(lambda x: x.split(","))
            .filter(lambda x: len(x) == 9))

    df = sqlContext.createDataFrame(rdd)



    # Transform
    time = unix_timestamp(df._2, TIMEFMT).cast("timestamp")
    lon = df._4.cast("double")
    lat = df._5.cast("double")
    vel = df._6.cast("double")
    dirr = df._7.cast("double")

    df = df.filter(vel> MIN_SPEED) # Filter first


    # Format data
    df = (df 
                .withColumn('isWeekend', floor(dayofweek(time)/6) )
                .withColumn("daySegment", floor(hour(time) / (NUM_DAY_SEGMENTS-1)) )
                .withColumn("direction", floor(dirr / (360/NUM_DIRECTIONS)))
                .withColumn("latitude", round(lat, NUM_DEC_PLACES))
                .withColumn("longitude", round(lon, NUM_DEC_PLACES))
                .withColumn("speed", vel))

    df = df.select(KEEP) 


    # Do Costly GroupBy
    df = df.repartition("daySegment")

    df = (df
            .groupBy("isWeekend", "daySegment", "latitude", "longitude", "direction").agg(avg("speed").alias("avgSpeed"))
            .orderBy("isWeekend", "daySegment", "latitude", "longitude", "direction"))

    df = (df
            .withColumn("flat_x", R*ASPECT_RATIO*df["longitude"]-MIN_X) 
            .withColumn("flat_y", R*ASPECT_RATIO*df["latitude"]-MIN_Y)) 



    # Load
    conn_string = ("host=%s dbname=%s user=%s password=%s" % (  config["host"], 
                                                                config["dbname"], 
                                                                config["user"], 
                                                                config["password"]))
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()

    droptable = "DROP TABLE IF EXISTS %s" %(config["table"])
    createtable = "CREATE TABLE %s (isWeekend smallint NOT NULL, daySegment smallint NOT NULL, latitude numeric(5, 2) NOT NULL, longitude numeric(5, 2) NOT NULL, direction smallint NOT NULL, avgSpeed numeric(5, 2), flat_x numeric(5, 2), flat_y numeric(5, 2), primary key (isWeekend, daySegment, latitude, longitude, direction));" % (config["table"])   
    cursor.execute(droptable)
    cursor.execute(createtable)

    conn.commit()
    cursor.close()
    conn.close()

    (df.write.format("jdbc")
    .mode("overwrite")
    .option("driver", config["driver"])
    .option("url", config["url"])
    .option("dbtable", "%s" %(config["table"]))
    .option("user", config["user"])
    .option("password", config["password"])
    .save())
