import inputValidator from "../utils/InputValidator";
import { Request, Response, NextFunction } from "express";
import { InputValidator } from "../interfaces";

export default (req: Request, res: Response, next: NextFunction) => {
  const path = req.path.split("/")[1];
  let inputErrors: InputValidator;
  switch (path) {
    case "register":
      inputErrors = inputValidator.register(req.body);
      break;
    case "login":
      inputErrors = inputValidator.login(req.body);
      break;
  }
  if (inputErrors) return res.status(500).json(inputErrors);
  next();
};
