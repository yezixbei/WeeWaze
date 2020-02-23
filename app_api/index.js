const express = require('express');
const router = express.Router();

const Point = require('./point');

router
    .route('/partmap') 
    .get(Point.partMap); // don't put req res in paren here

router
    .route('/fullmap')
    .get(Point.fullMap);

router
    .route('/fullmap/area')
    .get(Point.mapByArea);

router
    .route('/fullmap/day')
    .get(Point.mapByDay);

router
    .route('/fullmap/hour')
    .get(Point.mapByHour);

router
    .route('/fullmap/all')
    .get(Point.mapByAll);

router
    .route('/ping')
    .get((req, res) => {
        res.status(200).json("The server is alive! Thanks for checking!");
    });

module.exports = router;