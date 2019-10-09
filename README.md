# WeeWaze

WeeWaze is a project I built while I was a data engineering fellow at Insight Data Science.

The traffic maps on WeeWaze are generated using a subset of approximately 90 GB of GPS logs from the SFMTA. It covers the routes of 330 buses in San Francisco over the span of four years from 2013 to 2016. The logs were transformed into batch views through an ETL pipeline built with S3, Spark, and PostgreSQL and served to the end user using this web portal and a separate HTTP endpoint. This web portal is a full-stack single page application built with D3, Angular, Node, Express, and Sequelize.

See the website here: http://bit.ly/WeeWaze.
