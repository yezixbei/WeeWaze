const express = require('express');
const router = express.Router();

const PointCtrl = require('./point');

router
    .route('/partmap') 
    .get(PointCtrl.partMap); // don't put req res in paren here

router
    .route('/fullmap')
    .get(PointCtrl.fullMap);

router
    .route('/fullmap/area')
    .get(PointCtrl.mapByArea);

router
    .route('/fullmap/day')
    .get(PointCtrl.mapByDay);

router
    .route('/fullmap/hour')
    .get(PointCtrl.mapByHour);

router
    .route('/fullmap/all')
    .get(PointCtrl.mapByAll);

router
    .route('/ping')
    .get((req, res) => {
        res.status(200).json("The server is healthy.");
    });

module.exports = router;