import { Request, Response } from "express";
import {
  UserLogin,
  UserRegister,
  UserInterface,
  SuperRequest
} from "../interfaces";
import User from "../db/models/user.model";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken";

class AuthController {
  public async register(req: Request, res: Response) {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user)
      return res.status(403).json({ error: "This email address is in use." });
    const data: UserRegister = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email,
      password: bcryptjs.hashSync(req.body.password, 14)
    };
    const sendUser = (user: any) => res.status(200).json(user);
    new User(data).save().then(sendUser);
  }
  public async login(req: Request, res: Response) {
    const { email } = req.body;
    const user: any = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ error: "This email address is not in use." });
    const credentials: UserLogin = {
      email,
      password: req.body.password
    };
    if (!bcryptjs.compareSync(credentials.password, user.password))
      return res.status(403).json({ error: "Invalid password." });
    const token = generateToken({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    res.cookie("auth", token);
    return res.status(200).json({ token });
  }
  public current(req: SuperRequest, res: Response) {
    const user: UserInterface = {
      id: req.user.id
    };
    return res.status(200).json(user);
  }
  public delete(req: SuperRequest, res: Response) {
    User.findByIdAndDelete(req.user.id)
      .then(() => {
        res.cookie("auth", "Max-Age=0");
        res.status(200).json({ deleted: true });
      })
      .catch(err => res.status(500).json(err));
  }
}

export default new AuthController();
