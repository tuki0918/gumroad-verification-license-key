import { AppError } from "./AppError";

export class InvalidLicenseKeyError extends AppError {
  readonly code: string = "INVALID_LICENSE_KEY";
  constructor(message: string) {
    super(message);
  }
}
