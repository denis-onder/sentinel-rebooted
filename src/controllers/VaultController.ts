import { Request, Response } from "express";
import Vault from "../db/models/vault.model";
import { SuperRequest, VaultField } from "../interfaces";
import { hashSync, compareSync } from "bcryptjs";
import cryptojs from "crypto-js";

class VaultController {
  public checkForVault(req: SuperRequest, res: Response) {
    Vault.findOne({ user: req.user.id })
      .then(vault => {
        if (vault) return res.status(200).json({ exists: true });
        return res.status(404).json({ exists: false });
      })
      .catch(err => console.error(err));
  }
  public async createVault(req: SuperRequest, res: Response) {
    const vault = await Vault.findOne({ user: req.user.id });
    if (vault)
      return res.status(403).json({ error: "You already have a vault." });
    const data = {
      user: req.user.id,
      masterPassword: hashSync(req.body.password, 14)
    };
    const sendVault = (vault: any) => res.status(200).json(vault);
    new Vault(data).save().then(sendVault);
  }
  public async openVault(req: SuperRequest, res: Response) {
    const vault: any = await Vault.findOne({ user: req.user.id });
    if (!compareSync(req.body.password, vault.masterPassword))
      return res.status(403).json({ error: "Invalid master password." });
    return res.status(200).json(vault);
  }
  public async addField(req: SuperRequest, res: Response) {
    const vault: any = await Vault.findOne({ user: req.user.id });
    const bytes = cryptojs.AES.encrypt(req.body.password, vault.masterPassword);
    const newField: VaultField = {
      service: req.body.service,
      emailOrUsername: req.body.emailOrUsername,
      password: bytes.toString()
    };
    vault.fields = [...vault.fields, newField];
    vault.save().then(() => res.status(200).json(vault));
  }
  public async deleteField(req: SuperRequest, res: Response) {
    const vault: any = await Vault.findOne({ user: req.user.id });
    vault.fields.map((field: any, i: number) => {
      if (field.id === req.body.fieldID) vault.fields.splice(i, 1);
    });
    vault
      .save()
      .then(() => res.status(200).json(vault))
      .catch(err => res.status(500).json(err));
  }
  public deleteVault(req: SuperRequest, res: Response) {
    Vault.findOneAndDelete({ user: req.user.id })
      .then(() => res.status(200).json({ deleted: true }))
      .catch(e => console.error(e));
  }
}

export default new VaultController();
