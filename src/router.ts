import express, { Request, Response } from "express";
import { AuthController, VaultController } from "./controllers";
import { SuperRequest } from "./interfaces";
import checkForVault from "./middleware/checkForVault";
// tslint:disable-next-line:no-var-requires
const passport = require("passport");

class Router {
  public router: express.Router = express.Router();
  constructor() {
    this.config();
  }
  private config(): void {
    this.router.get("/", (req: Request, res: Response) =>
      res.render("pages/landing", { title: "Sentinel - Landing" })
    );
    this.router.post("/register", (req: Request, res: Response) =>
      AuthController.register(req, res)
    );
    this.router.post("/login", (req: Request, res: Response) =>
      AuthController.login(req, res)
    );
    this.router.get(
      "/current",
      passport.authenticate("jwt", { session: false }),
      (req: SuperRequest, res: Response) => AuthController.current(req, res)
    );
    this.router.post(
      "/vault/create",
      passport.authenticate("jwt", { session: false }),
      (req: SuperRequest, res: Response) =>
        VaultController.createVault(req, res)
    );
    this.router.get(
      "/vault/get",
      passport.authenticate("jwt", { session: false }),
      checkForVault,
      (req: SuperRequest, res: Response) => VaultController.openVault(req, res)
    );
    this.router.put(
      "/vault/add",
      passport.authenticate("jwt", { session: false }),
      checkForVault,
      (req: SuperRequest, res: Response) => VaultController.addField(req, res)
    );
  }
}

export default new Router().router;
