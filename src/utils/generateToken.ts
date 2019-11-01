import jwt from "jsonwebtoken";
import config from "../config/config";

export default (payload: any) =>
  jwt.sign(payload, config.secret, { expiresIn: 3600 });
