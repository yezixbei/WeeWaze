const Sequelize = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(`postgres://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:5432/${process.env.DATABASE}`);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to your database.');
  })
  .catch(err => {
    console.error('Unable to connect to your database:', err);
  });


module.exports = {
  Sequelize,
  sequelize
}
