import { AppError } from "./AppError";

export class LicenseKeyAlreadyExistsError extends AppError {
  readonly code: string = "LICENSE_KEY_ALREADY_EXISTS";
  constructor(message: string) {
    super(message);
  }
}
