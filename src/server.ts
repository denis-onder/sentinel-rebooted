import express from "express";
import config from "./config/config";
import connectDB from "./db";
import applyMiddleware from "./middleware";

class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
  }
  private config() {
    applyMiddleware(this.app);
    connectDB();
  }
  public start() {
    this.app.listen(config.port, () =>
      console.log(`Server running on http://localhost:${config.port}`)
    );
  }
}

export default new Server();
