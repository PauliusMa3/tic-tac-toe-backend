require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const development = {
  db: {
    host: process.env.DEV_MONGO_HOST
  },
  app: {
    port: process.env.DEV_APP_PORT,
    frontendUrl: process.env.DEV_FRONTEND_URL
  }
};

const test = {
  db: {
    host: process.env.TEST_MONGO_HOST
  },
  app: {
    port: process.env.TEST_APP_PORT
  }
};

const config = {
  development,
  test
};

module.exports = config[env];
