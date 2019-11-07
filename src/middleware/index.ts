import bodyParser from "body-parser";
import express from "express";
import hbs from "express-handlebars";
import PassportJSConfig from "../config/passport";
import path from "path";
import Router from "../router";

export default (app: express.Application): void => {
  // Body Parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  // Serve static files
  app.use(express.static(path.join(__dirname, "../../public")));
  // Set views folder
  app.set("views", path.join(__dirname, "../../views"));
  // Handlebars config and engine
  app.engine(
    "hbs",
    hbs({
      extname: "hbs",
      defaultLayout: "default",
      layoutsDir: path.join(__dirname, "../../views/layouts")
    })
  );
  app.set("view engine", "hbs");
  // Router
  app.use(Router);
  // Passport
  PassportJSConfig.init(app);
  // Other middleware can be added here
};