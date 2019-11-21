import express, { Request, Response } from "express";
import { AuthController, VaultController } from "./controllers";
import cookieMiddleware from "./middleware/cookieMiddleware";
import { SuperRequest } from "./interfaces";
import checkForVault from "./middleware/checkForVault";
import validateInput from "./middleware/validateInput";
// tslint:disable-next-line:no-var-requires
const passport = require("passport");

class Router {
  public router: express.Router = express.Router();
  constructor() {
    this.setAuthRoutes();
    this.setVaultRoutes();
    this.setViewEndpoints();
  }
  private setViewEndpoints(): void {
    this.router.get("/", (req: Request, res: Response) =>
      res.render("pages/landing", {
        title: "Landing",
        cssAndJSfilename: "landing"
      })
    );
    this.router.get("/register", (req: Request, res: Response) =>
      res.render("pages/register", {
        title: "Register",
        cssAndJSfilename: "authentication"
      })
    );
    this.router.get("/login", (req: Request, res: Response) =>
      res.render("pages/login", {
        title: "Login",
        cssAndJSfilename: "authentication"
      })
    );
    this.router.get(
      "/dashboard",
      cookieMiddleware,
      passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/login"
      }),
      (req: SuperRequest, res: Response) =>
        res.render("pages/dashboard", {
          title: "Dashboard",
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          cssAndJSfilename: "dashboard"
        })
    );
  }
  private setAuthRoutes(): void {
    this.router.post(
      "/register",
      validateInput,
      (req: Request, res: Response) => AuthController.register(req, res)
    );
    this.router.post("/login", validateInput, (req: Request, res: Response) =>
      AuthController.login(req, res)
    );
    this.router.get(
      "/current",
      passport.authenticate("jwt", { session: false }),
      (req: SuperRequest, res: Response) => AuthController.current(req, res)
    );
    this.router.delete(
      "/delete",
      passport.authenticate("jwt", { session: false }),
      (req: SuperRequest, res: Response) => AuthController.delete(req, res)
    );
  }
  private setVaultRoutes(): void {
    this.router.get(
      "/vault/check",
      passport.authenticate("jwt", { session: false }),
      (req: SuperRequest, res: Response) =>
        VaultController.checkForVault(req, res)
    );
    this.router.post(
      "/vault/create",
      passport.authenticate("jwt", { session: false }),
      (req: SuperRequest, res: Response) =>
        VaultController.createVault(req, res)
    );
    this.router.post(
      "/vault/open",
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
    this.router.delete(
      "/vault/delete",
      passport.authenticate("jwt", { session: false }),
      checkForVault,
      (req: SuperRequest, res: Response) =>
        VaultController.deleteVault(req, res)
    );
  }
}

export default new Router().router;
