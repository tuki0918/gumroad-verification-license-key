import { AppError } from "./AppError";

export class LicenseKeyDisabledError extends AppError {
  readonly code: string = "LICENSE_KEY_DISABLED";
  constructor(message: string) {
    super(message);
  }
}
