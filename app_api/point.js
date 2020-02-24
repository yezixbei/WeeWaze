const Sequelize = require('sequelize');
const db = require('./db');

/*
Model represents a point that will be displayed in the UI. 
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

// Below are methods that are called via the public facing API to help generate scatter plots for data visualization.

// helper functions
const executeQuery = (res, filterString) => {
    // These raw SQL commands creates the visualization shown in the web UI, and also any custom visualization
    // They filters the dataset, performs a group by on each square to find the average speed, creates three new columns 
    // for visualization: a speed bucket for the display color, x-projection, and y-projection. 
    const qry =
        `
        drop view v1 cascade;
        create view v1 as
        ${filterString}
        
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

// The default map is a map of San Francisco given a day of the week and an hour range in the day
const defaultMap = (req, res, table_name) => {
    const dir = '0';
    const input_table = table_name;
    const day = parseInt(req.query.day);
    const hourmin = parseInt(req.query.hourmin);
    const hourmax = parseInt(req.query.hourmax);
    if ((!day && day !== 0) || (day < 0 || day > 6) || // expect 0 for sunday, 6 for saturday
        (hourmin > hourmax) || (hourmin < 0 || hourmin > 23) || (hourmax < 0 || hourmax > 23)) {
        return res
            .status(404)
            .json({ "message": "Please check your parameters." });
    }

    var adjustedDay = day+1; // database stores 1 for sunday, 7 for saturday 
    var filterString =
        `
        select * from ${input_table}
        where(direction = ${dir}) and dayofweek=${adjustedDay} and (hour between ${hourmin} and ${hourmax});
        `
    executeQuery(res, filterString);
}


// Creates the scatter plot shown in the web interface
const partMap = (req, res) => {
    defaultMap(req, res, 'part_table');
}

// Create the same default scatter plot but using the entire dataset
const fullMap = (req, res) => {
    defaultMap(req, res, 'full_table');
}

// Rest of the functions create scatter plots from the entire dataset 
// given a range of longitude and latitude, day, hour, or all four parameters
const mapByArea = (req, res) => {
    const dir = '0';
    const input_table = 'full_table';
    const lonmin = parseFloat(req.query.lonmin);
    const lonmax = parseFloat(req.query.lonmax);
    const latmin = parseFloat(req.query.latmin);
    const latmax = parseFloat(req.query.latmin);
    if ((!lonmin && lonmin !== float) || (!lonmax && lonmax !== float) || (!latmin && latmin !== float) || (!latmax && latmax !== float) ||
        (lonmin < -122.513 || -122.358 < lonmin) || (latmin < 37.709 || 37.807 < latmax)) {
        return res
            .status(404)
            .json({ "message": "Please check your longitude and latitude parameters." });
    }

    var filterString = 
        `
        select * from ${input_table}
        where(direction = ${dir}) and (longitude between ${lonmin} and ${lonmax}) and (latitude between ${latmin} and ${latmax});
        `
    executeQuery(res, filterString);
}

// change the range of days
const mapByDay = (req, res) => {
    const dir = '0';
    const input_table = 'full_table';
    const min = parseInt(req.query.min);
    const max = parseInt(req.query.max);
    if ((!min && min !== 0) || (!max && max !== 0) || (min > max) || (min < 1 || 7 < min) || (max < 1 || 7 < max)) {
        return res
            .status(404)
            .json({ "message": "Please check your day parameters" });
    }

    var filterString =
        `
        select * from ${input_table}
        where(direction = ${dir}) and (dayofweek between ${min} and ${max});
        `
    executeQuery(res, filterString);
}

// change the range of hours
const mapByHour = (req, res) => {
    const dir = '0';
    const input_table = 'full_table';
    const min = parseInt(req.query.min);
    const max = parseInt(req.query.max);
    if ((!min && min !== 0) || (!max && max !== 0) || (min > max) || (min < 0 || 23 < min) || (max < 0 || 23 < max)) {
        return res
            .status(404)
            .json({ "message": "Please check your hour parameters"});
    }

    var filterString =
        `
        select * from ${input_table}
        where(direction = ${dir}) and (hour between ${min} and ${max});
        `
    executeQuery(res, filterString);
}

// change the range of all three parameters
const mapByAll = (req, res) => {
    const dir = '0';
    const input_table = 'full_table';
    const lonmin = parseFloat(req.query.lonmin);
    const lonmax = parseFloat(req.query.lonmax);
    const latmin = parseFloat(req.query.latmin);
    const latmax = parseFloat(req.query.latmin);
    const daymin = parseInt(req.query.daymin);
    const daymax = parseInt(req.query.daymax);
    const hourmin = parseInt(req.query.hourmin);
    const hourmax = parseInt(req.query.hourmax);

    if ((!lonmin && lonmin !== float) || (!lonmax && lonmax !== float) || (!latmin && latmin !== float) || (!latmax && latmax !== float) ||
        (lonmin < -122.513 || -122.358 < lonmin) || (latmin < 37.709 || 37.807 < latmax) ||
        (!daymin && daymin !== 0) || (!daymax && daymax !== 0) || (daymin > daymax) || (daymin < 1 || 7 < daymin) || (daymax < 1 || 7 < daymax) ||
        (!hourmin && hourmin !== 0) || (!hourmax && hourmax !== 0) || (hourmin > hourmax) || (hourmin < 0 || 23 < hourmin) || (hourmax < 0 || 23 < hourmax)) {
        return res
            .status(404)
            .json({ "message": "Please check your query parameters" });
    }

    var filterString =
        `
        select * from ${input_table}
        where(direction = ${dir}) and 
            (longitude between ${lonmin} and ${lonmax}) and (latitude between ${latmin} and ${latmax}) and 
            (dayofweek between ${daymin} and ${daymax}) and
            (hour between ${hourmin} and ${hourmax});
        `
    executeQuery(res, filterString);
}

module.exports = {
    Point,
    partMap,
    fullMap,
    mapByArea,
    mapByDay,
    mapByHour,
    mapByAll
};
