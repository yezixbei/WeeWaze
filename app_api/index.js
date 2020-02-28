const express = require('express');
const router = express.Router();

const Point = require('./point');

router
    .route('/v1/resources/maps') 
    .get(Point.getMap);

router
    .route('/ping')
    .get((req, res) => {
        res.status(200).json("The server is alive! Thanks for checking!");
    });

module.exports = router;