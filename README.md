# WeeWaze: Traffic Estimation at Scale

## Introduction

The economic cost of congestion exceeds $500 billion a year and is projected to get worse over time as more people move into cities. Having access to fine-grained historical traffic patterns is useful for data analysts who wants to visualize the data and data scientists running traffic prediction algorithms. 

The purpose of WeeWaze is to translate approximately 87GB of GPS logs from SFMTA into a format that can be used to dynamically generate historical traffic patterns in San Francisco given a time range. The deliverables are a scalable pipeline that supports ad hoc queries, a friendly and responsive single page application that interacts with the user, and a REST API interfaces with the entire dataset post transformation. See a demo of the SPA here:  http://bit.ly/WeeWaze.

![weewaze_front_page](https://raw.githubusercontent.com/yezixbei/WeeWaze/tree/master/app_public/src/assets/pics/weewaze_front_page.png)



## Dataset

The batch data consists of 87GB of GPS logs spread over approximately 1200 CSV files.  It covers the routes of 330 buses in San Francisco over the span of four years from 2013 to 2016. It has the following schema: [REV, REPORT_TIME, VEHICLE_TAG, LONGITUDE, LATITUDE, SPEED, HEADING, TRAIN_ASSIGNMENT, PREDICTABLE], but the columns we are interested in are [REPORT_TIME, LONGITUDE, LATITUDE, SPEED, HEADING]. The size of the original dataset is about a billion rows. 



## Tools & Design

My design decisions were based on the fact that the final pipeline should be scalable, fault tolerant, extensible, and supports fast, ad hoc queries. I chose S3 for batch storage because it allows bulk reads and writes. I chose Spark for batch processing because of its high throughput and scalability.[?] In order to support fast ad hoc queries, I picked PostgreSQL because it allows indexing and fast random reads.  Although  we did not need fast random writes for the serving layer, the batch view is small enough (2 million rows) that we can sacrifice scalability for extensibilty; the kinds of data transformation we can do with a SQL database is much greater than a NoSQL database like Cassandra. I built the RESTful API with Express.js and Sequelize and the single page application with D3 and Angular. Angular was chosen for the front end for its reusable components because of the short time constraints of the project. 

![tools_design](https://raw.githubusercontent.com/yezixbei/WeeWaze/tree/master/app_public/src/assets/pics/tools_design.png)





## Pipe Diagrams

We want the end product to be a speed map over San Francisco for an arbitary time range. In the first transformation, for each row in the form of [timestamp, gps, speed], translate the timestamp into a time slot and divide San Francisco into squares of n meters and translate the gps coordinates into the location of its square. Next do a groupby over these two parameters to get the sums and counts of speed. This transformation is performed in Spark and will shrink the original dataset from 1 billion to about 2 milion rows, resulting in the following schema [time slot, square location, speed sum, speed count]. The results are then stored in Postgres. In the second transformation, we let the user choose a time range, we then filter out rows outside the correct range, and for each square, we find the average speed using the speed sum and counts. 



![pipe_diagrams](https://raw.githubusercontent.com/yezixbei/WeeWaze/tree/master/app_public/src/assets/pics/pipe_diagrams.png)





## Engineering Challenge

One challenge for this project is making the pipeline scalable. Aside from picking the right tools, another main strategy is to use heuristics to keep transformations simple.  For example to translate GPS coordinates into squares of size n over San Francisco, we follow two steps. First we can use the simple rule that the bounding box of a set of coordinates to the mth decimal place is n meters long. This means if we round the longitude and latitude of each row to the mth decimal place, every point within the same bounding square can be accounted for by using a group by. We can also let the user set the size of the square. In our case we are using 100 meters and rounding to the 3rd decimal place. The second part of the translation projects the edges of each square onto a flat map. We can use equirectangular projection, which is only a simple multiplication. Another heruistic we can use is that to infer that all vehicles traveling above a certain speed is not idling or picking up passengers, and therefore, we filter out all the rows that have speeds below that limit. Vehicle state can also be infered from GPS coordinates using sophiticated statiscal methods, but they would not be scalable. 





## License

The MIT License (MIT)

Copyright (c) 2015 Yezi Bei

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.