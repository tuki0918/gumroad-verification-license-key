export abstract class CustomError extends Error {
  /** HTTP status code */
  readonly status: number = 500;
  /** Error code */
  readonly code: string = "CUSTOM_ERROR";
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidLicenseKeyError extends CustomError {
  readonly code: string = "INVALID_LICENSE_KEY";
  constructor(message: string) {
    super(message);
  }
}

export class LicenseKeyAlreadyExistsError extends CustomError {
  readonly code: string = "LICENSE_KEY_ALREADY_EXISTS";
  constructor(message: string) {
    super(message);
  }
}

export class LicenseKeyDisabledError extends CustomError {
  readonly code: string = "LICENSE_KEY_DISABLED";
  constructor(message: string) {
    super(message);
  }
}

export class FailedToVerifyLicenseKeyError extends CustomError {
  readonly code: string = "FAILED_TO_VERIFY_LICENSE_KEY";
  constructor(message: string) {
    super(message);
  }
}

export class SubscriptionIsNotAliveError extends CustomError {
  readonly code: string = "SUBSCRIPTION_IS_NOT_ALIVE";
  constructor(message: string) {
    super(message);
  }
}

export class SubscriptionNotFoundError extends CustomError {
  readonly code: string = "SUBSCRIPTION_NOT_FOUND";
  constructor(message: string) {
    super(message);
  }
}
