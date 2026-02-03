require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  // Add more configuration as needed
  // database: {
  //   host: process.env.DB_HOST,
  //   port: process.env.DB_PORT,
  //   name: process.env.DB_NAME
  // }
};
