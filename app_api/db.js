const Sequelize = require('sequelize');
const config = require('./config')


const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:5432/${config.database}`);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


module.exports = {
  Sequelize,
  sequelize
}
