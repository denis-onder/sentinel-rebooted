import { Response, NextFunction } from "express";
import Vault from "../db/models/vault.model";
import { SuperRequest } from "../interfaces";

export default (req: SuperRequest, res: Response, next: NextFunction) => {
  const validate = (vault: any) =>
    vault
      ? next()
      : res.status(404).json({ error: "You do not have a vault." });
  Vault.findOne({ user: req.user.id })
    .then(validate)
    .catch(e => console.error(e));
};
