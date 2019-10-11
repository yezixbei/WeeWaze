const Sequelize = require('sequelize');
const db = require('./db');

/*
This model represents a point that will be displayed in the UI. Each point is located in San Francisco and is 100 square meters in size. 
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
This pipeline generates the output that the user sees.  
*/
const executeQuery = (req, res) => {
    const day = parseInt(req.query.day);
    const min = parseInt(req.query.min);
    const max = parseInt(req.query.max);
    const dir = parseInt(req.query.dir);
    const tb = parseInt(req.query.tb);
    const input_table = tb == 0 ? 'part_table' : 'full_table';
    if ((!day && day !== 0) || (!min && min !== 0) || (!max && max !== 0) || (!dir && dir !== 0) || (!tb && tb !== 0)) {
        return res
            .status(404)
            .json({ "message": "all query parameters are required" });
    }

    const que =
        `
        drop view v1 cascade;
        create view v1 as
        select * from ${input_table}
        where(direction = ${ dir}) and(dayofweek = ${day}) and(hour between ${min} and ${max});
        
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
        db.sequelize.query(que)
            .then(points => {
                res
                    .status(200)
                    .json(points);
            })

    } catch (err) {
        res
            .status(404)
            .json(err);
    };

};

module.exports = {
    Point,
    executeQuery
};
