const Sequelize = require('sequelize');
const db = require('./db');

/*
Model represents a map point.
Each point is located in San Francisco and is 100 square meters in size. 
*/
const Point = db.sequelize.define('point', {
    x: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    y: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    longitude: {
        type: Sequelize.STRING,
        allowNull: false
    },
    latitude: {
        type: Sequelize.STRING,
        allowNull: false
    },
    speed: {
        type: Sequelize.STRING,
        allowNull: false
    },
    bucket: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

/*
Exposes a single get function for generating maps on WeeWaze.
*/

// Helper Functions
const error = (res, queryParams) => {
    return res.status(404).json({
        "message": `Please check query parameters ${queryParams}.`
    });
}

const executeQuery = (res, filter) => {
    // Performs a group by on each square to find the average speed, creates three new columns for visualization: 
    // a speed bucket for the display color, x-projection, and y-projection. 
    const qry =
        `
        drop view v1 cascade;
        create view v1 as
        ${filter}
        
        create view v2 as 
        select longitude, latitude, sum(speed_sum)/sum(speed_count) as speed from v1
        group by(longitude, latitude);
        
        create view v3 as 
        select *,
        (case 
        when (speed < 10) then 1
        when (speed between 10 and 14) then 2
        when (speed between 15 and 29) then 3
        when (speed between 30 and 44) then 4
        else 5
        end) as bucket
        from v2; 

        create view v4 as 
        select *, 6028.0*longitude+738496.3 as x, 6371.0*latitude-240244 as y
        from v3;

        select round(cast(x as numeric), 3) as x, round(cast(y as numeric), 3) as y, bucket, longitude, latitude, round(cast(speed as numeric), 3) as speed
        from v4;
        `

    try {
        db.sequelize.query(qry)
            .then(data => {
                res
                    .status(200)
                    .json(data);
            })

    } catch (err) {
        res
            .status(404)
            .json(err);
    };
};


// Main Function
const getMap = (req, res) => {
    const dir = '0';
    const table = req.query.display ? 'part_table' : 'full_table';
    var filter =
        `
        select * from ${table}
        where(direction = ${dir})`

    if (typeof req.query.day != "undefined"){
        const day = parseInt(req.query.day);

        if (typeof req.query.daymin != "undefined" || 
            typeof req.query.daymax != "undefined" || 
            isNaN(day) || 
            day < 0 || 6 < day) {
            return error(res, 'day');
        }
        filter += ` and (dayofweek = ${day + 1})`; // 1 for Sunday in database
    }

    if (typeof req.query.daymin != "undefined" || typeof req.query.daymax != "undefined") {
        const daymin = parseInt(req.query.daymin);
        const daymax = parseInt(req.query.daymax);

        if (typeof req.query.daymin == "undefined" || 
            typeof req.query.daymax == "undefined" ||
            isNaN(daymin) || 
            isNaN(daymax) || 
            daymin > daymax || 
            daymin < 0 || 6 < daymin || 
            daymax < 0 || 6 < daymax) {
            return error(res, 'daymin and daymax');
        }

        filter += ` and (dayofweek between ${daymin+1} and ${daymax+1})`;
    }

    if (typeof req.query.hourmin != "undefined" || typeof req.query.hourmax != "undefined") {
        const hourmin = parseInt(req.query.hourmin);
        const hourmax = parseInt(req.query.hourmax);

        if (typeof req.query.hourmin == "undefined" || 
            typeof req.query.hourmin == "undefined" ||
            isNaN(hourmin) || 
            isNaN(hourmax) || 
            hourmin > hourmax || 
            hourmin < 0 || 23 < hourmin || 
            hourmax < 0 || 23 < hourmax) {
            return error(res, 'hourmin and hourmax');
        }
        filter += ` and (hour between ${hourmin} and ${hourmax})`;
    }

    if (typeof req.query.lonmin != "undefined" || typeof req.query.lonmax != "undefined" ||
        typeof req.query.latmin != "undefined" || typeof req.query.latmax != "undefined") {
        const lonmin = parseFloat(req.query.lonmin);
        const lonmax = parseFloat(req.query.lonmax);
        const latmin = parseFloat(req.query.latmin);
        const latmax = parseFloat(req.query.latmax);

        if (typeof req.query.lonmin == "undefined" || 
            typeof req.query.lonmax == "undefined" ||
            typeof req.query.latmin == "undefined" || 
            typeof req.query.latmax == "undefined" ||
            isNaN(lonmin) || 
            isNaN(lonmax) || 
            isNaN(latmin) || 
            isNaN(latmax) ||
            lonmax < lonmin || 
            latmax < latmin ||
            lonmin < -122.513 || -122.358 < lonmax || 
            latmin < 37.709 || 37.807 < latmax) {
            return error(res, 'lat and lon');
        }

        filter += ` and (longitude between ${lonmin} and ${lonmax}) and (latitude between ${latmin} and ${latmax})`;
    }

    filter += `;`;
    executeQuery(res, filter);
 }


module.exports = {
    Point,
    getMap
};
