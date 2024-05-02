import { AppError } from "./AppError";

export class FailedToVerifyLicenseKeyError extends AppError {
  readonly code: string = "FAILED_TO_VERIFY_LICENSE_KEY";
  constructor(message: string) {
    super(message);
  }
}
