import Validator from "validator";
import { UserRegister, UserLogin } from "../interfaces";

class InputValidator {
  public register(data: UserRegister) {
    let errors: any = {};
    if (Validator.isEmpty(data.firstName)) {
      errors.firstNameEmpty = "First name is required.";
    }
    if (Validator.isEmpty(data.lastName)) {
      errors.lastNameEmpty = "Last name is required.";
    }
    if (Validator.isEmpty(data.email)) {
      errors.emailEmpty = "Email address is required.";
    }
    if (!Validator.isEmail(data.email)) {
      errors.emailInvalid = "Please provide a valid email address.";
    }
    if (Validator.isEmpty(data.password)) {
      errors.passwordEmpty = "A password is required.";
    }
    if (!Validator.isLength(data.password, { min: 8, max: 32 })) {
      errors.passwordLength =
        "Your password should be between 8 and 32 characters long.";
    }
    if (data.password !== data.confirmPassword) {
      errors.passwordsNotMatching = "Your passwords are not matching.";
    }
    if (Object.keys(errors).length > 0) {
      return errors;
    }
    return false;
  }
  public login(data: UserLogin) {
    let errors: any = {};
    if (Validator.isEmpty(data.email)) {
      errors.emailEmpty = "Email address is required.";
    }
    if (!Validator.isEmail(data.email)) {
      errors.emailInvalid = "Please provide a valid email address.";
    }
    if (Validator.isEmpty(data.password)) {
      errors.passwordEmpty = "A password is required.";
    }
    if (Object.keys(errors).length > 0) {
      return errors;
    }
    return false;
  }
}

export default new InputValidator();
