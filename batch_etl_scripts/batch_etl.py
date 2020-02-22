from pyspark import SparkContext, SparkConf
from pyspark.sql import SQLContext
from pyspark.sql.types import *
from pyspark.sql.functions import *
from pyspark.sql.window import Window
from math import log10
import psycopg2
import os

"""
Scripts running the batch layer of the application. 
The purpose here is to generate a batch view of reasonable size for ad hoc queries via the REST API 
(code under "app_api") or the web interface (under "app_public").
 """
if __name__ == '__main__':

        """
        You may adjust constants GRIDLEN however you want and MIN_SPEED from 6-12MPH. GRIDLEN is the 
        size of the grid you want to overlay on top of San Francisco.
        See below for more details.
        """
        MIN_SPEED = 9.0 # MPH
        MAX_SPEED = 70.0
        
        MIN_LON = -122.513 # SF city limits
        MAX_LON = -122.358
        MIN_LAT = 37.709
        MAX_LAT = 37.807

        GRIDLEN = 100 # meters
        NUM_DEC_PLACES = int(log10(GRIDLEN*10))

        TIMEFMT = "MM/dd/yyyy HH:mm:ss"
        COLSFMT = ["dayofweek", "hour", "direction", "latitude", "longitude", "speed"]

        conf = (SparkConf()
                .setAppName(config["app_name"])
                .setMaster("spark://%s:7077" % (config["master_ip"]))
                .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer"))
        sc = SparkContext(conf=conf)
        sqlContext = SQLContext(sc)
        sc._jsc.hadoopConfiguration().set("fs.s3n.awsAccessKeyId", "AWS_ACCESS_KEY")
        sc._jsc.hadoopConfiguration().set("fs.s3n.awsSecretAccessKey", "AWS_SECRET_KEY")
        sc.setLogLevel("ERROR")


        
        """
        Ingest the data from the batch layer, which is an S3 bucket, then transform the raw files into a 
        dataframe so we can use Spark's built in API (for faster executions).
        
        The batch data consists of 87GB of occasionally malformed GPS log files from SFMTA with the following schema: 
        [REV,REPORT_TIME,VEHICLE_TAG,LONGITUDE,LATITUDE,SPEED,HEADING,TRAIN_ASSIGNMENT,PREDICTABLE]. 
        The columns we are interested in are [REPORT_TIME, LONGITUDE, LATITUDE, SPEED, HEADING], which are refered to as 
        [df_2, df_4, df_5, df_6, df_7] in the dataframe . 
        
        """
        rdd = sc.textFile(config["files"]) 
        rdd = (rdd
                .map(lambda x: x.encode("ascii", "ignore"))
                .map(lambda x: x.split(","))
                .filter(lambda x: len(x) == 9))

        df = sqlContext.createDataFrame(rdd) 

        

        """
        This is where we start computing the batch views by taking the data through a series of simple transformations:

        First we filter the data to within the limits of San Francisco and within speeds where we can reasonably expect 
        the bus to be moving (as opposed to idling or picking up passengers). The upper and lower speed limits are 
        determined by simple heuristics rather than using complex statistics to keep the processing time within limits. 
        The lower speed limit can be adjusted via the parameter MIN_SPEED, but should be kept within a range of 6 to 12MPH. 

        Next we format the columns and round the longitude and latitude values to the decimal place corresponding 
        to the size of the grid we want. The transformation here is that a bounding box of length n (in meters) is 
        determined by the mth decimal place in its GPS coordinates. The values of n and m that we are going to demo 
        are 100 meters and the 3rd decimal place. We can adjust the size of the grid using the parameter GRIDLEN.

        After rounding, we do a groupby to determine the average speed within each bounding square. This is computationally
        the most expensive step and runs at about 2 hrs over 87GB.
        """
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




        """
        Save the batch view into a SQL database for quick queries. 

        An example of a serving layer query can be to compute traffic maps based on a day of the week, an hour 
        range from 0 to 23, and a direction ie for each tuple of (dayofweek, min_hour, max_hour, direction), 
        the serving layer should compute the average speeds of San Francisco divided into grids of 100 square meters. 

        The logic of the serving layer is stored in the back end of my SPA under the directry "app_api".
        """
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