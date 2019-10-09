const express = require('express');
const router = express.Router();

const PointsCtrl = require('./point');

router
  .route('/points')
  .get(PointsCtrl.executeQuery)

module.exports = router;