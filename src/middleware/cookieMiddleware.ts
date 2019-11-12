import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export default (req: Request, res: Response, next: NextFunction) => {
  const setCookieAsAuthHeader = () => {
    req.headers.authorization = `Bearer ${cookie}`;
    next();
  };
  const redirect = () => {
    res.redirect("/login");
  };
  const cookie = req.cookies.auth;
  console.log(cookie);
  if (!cookie) return redirect();
  jwt.verify(cookie, config.secret, (err: any, _: any) =>
    err ? redirect() : setCookieAsAuthHeader()
  );
};
