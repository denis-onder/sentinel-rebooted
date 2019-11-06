import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import PassportJSConfig from "./config/passport";
import config from "./config/config";
import Router from "./router";
import path from "path";
import connectDB from "./db";
import hbs from "express-handlebars";

class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
  }
  private config() {
    this.app.use(express.static(path.join(__dirname, "../public")));
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.engine(
      "hbs",
      hbs({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: path.join(__dirname, "../views/layouts")
      })
    );
    this.app.set("view engine", "hbs");
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(Router);
    PassportJSConfig.init(this.app);
    connectDB();
  }
  public start() {
    this.app.listen(config.port, () =>
      console.log(`Server running on http://localhost:${config.port}`)
    );
  }
}

export default new Server();
