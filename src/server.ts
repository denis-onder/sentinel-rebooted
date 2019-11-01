import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import PassportJSConfig from "./config/passport";
import config from "./config/config";
import Router from "./router";
import path from "path";

export default class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
  }
  private config() {
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.set("view engine", "ejs");
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use("/api", Router);
    PassportJSConfig.init(this.app);
  }
  public start() {
    this.app.listen(config.port, () =>
      console.log(`Server running on http://localhost:${config.port}`)
    );
  }
}
