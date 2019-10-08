const express = require('express');
const router = express.Router();

const PointsCtrl = require('./points');

router
  .route('/points')
  .get(PointsCtrl.executeQuery) 

module.exports = router;