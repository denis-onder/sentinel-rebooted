import { Application } from "express";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import config from "../config/config";
import User from "../db/models/user.model";

export default class PassportJSConfig {
  public static init(app: Application) {
    app.use(passport.initialize());
    passport.use(
      new Strategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.secret
        },
        async (payload: any, done: any) => {
          const user = await User.findById(payload.id);
          if (!user) return done("User not found.", false);
          return done(null, user);
        }
      )
    );
  }
}
