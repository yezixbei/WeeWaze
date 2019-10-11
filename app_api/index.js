const express = require('express');
const router = express.Router();

const PointsCtrl = require('./point');

router
  .route('/ping')
  .get((req, res)=>{
    res.status(200).json("The server is healthy.");
  });

router
  .route('/points')
  .get(PointsCtrl.executeQuery);

module.exports = router;