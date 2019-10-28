// tslint:disable:no-console
// tslint:disable:quotemark
// tslint:disable:arrow-parens
// tslint:disable:no-shadowed-variable
import { Application } from "express";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import config from "../config/config";

export default class PassportJSConfig {
  public static init(app: Application) {
    app.use(passport.initialize());
    passport.use(
      new Strategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.secret
        },
        (payload: any, done: any) => {}
      )
    );
  }
}
