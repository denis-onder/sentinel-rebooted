// tslint:disable-next-line
require("dotenv").config();

export default {
  secret: process.env.SECRET,
  port: process.env.PORT,
  dbURL: process.env.DB_URL
};
