import { Request } from "express";

interface UserLogin {
  email: string;
  password: string;
}

interface UserRegister extends UserLogin {
  firstName: string;
  lastName: string;
}

interface UserInterface {
  id: string;
  __v?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

interface Vault {
  user: string;
  masterPassword: string;
}

interface VaultField {
  service: string;
  emailOrUsername: string;
  password: string;
}

interface SuperRequest extends Request {
  user: UserInterface;
}

export {
  UserLogin,
  UserRegister,
  Vault,
  VaultField,
  UserInterface,
  SuperRequest
};
