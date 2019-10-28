import express, { Request, Response } from "express";
import { AuthController, VaultController, TestController } from "./controllers";
import { SuperRequest } from "./interfaces";
// tslint:disable-next-line:no-var-requires
const passport = require("passport");

class Router {
  public router: express.Router = express.Router();
  constructor() {
    this.config();
  }
  private config(): void {
    this.router.get("/test", (req: Request, res: Response) =>
      TestController.test(req, res)
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
    this.router.get(
      "/vault/check",
      passport.authenticate("jwt", { session: false }),
      (req: Request, res: Response) => VaultController.checkForVault(req, res)
    );
    this.router.post(
      "/vault/create",
      passport.authenticate("jwt", { session: false }),
      (req: Request, res: Response) => VaultController.createVault(req, res)
    );
    this.router.get(
      "/vault/get",
      passport.authenticate("jwt", { session: false }),
      (req: Request, res: Response) => VaultController.openVault(req, res)
    );
    this.router.put(
      "/vault/add",
      passport.authenticate("jwt", { session: false }),
      (req: Request, res: Response) => VaultController.addField(req, res)
    );
  }
}

export default new Router().router;
