import { Request, Response } from "express";
import { UserLogin, UserRegister, User, SuperRequest } from "../interfaces";

class AuthController {
  public register(req: Request, res: Response) {
    const newUser: UserRegister = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    };
  }
  public login(req: Request, res: Response) {
    const user: UserLogin = {
      email: req.body.email,
      password: req.body.password
    };
  }
  public current(req: SuperRequest, res: Response) {
    const user: User = {
      id: req.user.id,
      email: req.user.email
    };
    res.json(user);
  }
}

export default new AuthController();
