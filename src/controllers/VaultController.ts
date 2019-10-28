import { Request, Response } from "express";
import config from "../config/config";

class VaultController {
  public createVault(req: Request, res: Response) {}
  public checkForVault(req: Request, res: Response) {}
  public openVault(req: Request, res: Response) {}
  public addField(req: Request, res: Response) {}
}

export default new VaultController();
