import mongoose from "mongoose";
import config from "../config/config";

export default () => {
  mongoose.connect(config.dbURL, (err: any) =>
    err ? console.error(err) : console.log("Database connected.")
  );
};
