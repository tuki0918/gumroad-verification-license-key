export class CustomError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export const ERROR_CODE__INVALID_LICENSE_KEY = "INVALID_LICENSE_KEY";
export const ERROR_CODE__LICENSE_KEY_ALREADY_EXISTS =
  "LICENSE_KEY_ALREADY_EXISTS";
export const ERROR_CODE__FAILED_TO_VERIFY_LICENSE_KEY =
  "FAILED_TO_VERIFY_LICENSE_KEY";
export const ERROR_CODE__SUBSCRIPTION_IS_NOT_ALIVE =
  "SUBSCRIPTION_IS_NOT_ALIVE";
export const ERROR_CODE__SUBSCRIPTION_NOT_FOUND = "SUBSCRIPTION_NOT_FOUND";

export class InvalidLicenseKeyError extends CustomError {
  constructor(message: string) {
    super(message, ERROR_CODE__INVALID_LICENSE_KEY);
  }
}

export class LicenseKeyAlreadyExistsError extends CustomError {
  constructor(message: string) {
    super(message, ERROR_CODE__LICENSE_KEY_ALREADY_EXISTS);
  }
}

export class FailedToVerifyLicenseKeyError extends CustomError {
  constructor(message: string) {
    super(message, ERROR_CODE__FAILED_TO_VERIFY_LICENSE_KEY);
  }
}

export class SubscriptionIsNotAliveError extends CustomError {
  constructor(message: string) {
    super(message, ERROR_CODE__SUBSCRIPTION_IS_NOT_ALIVE);
  }
}

export class SubscriptionNotFoundError extends CustomError {
  constructor(message: string) {
    super(message, ERROR_CODE__SUBSCRIPTION_NOT_FOUND);
  }
}
