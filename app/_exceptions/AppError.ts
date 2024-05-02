export abstract class AppError extends Error {
  /** HTTP status code */
  readonly status: number = 500;
  /** Error code */
  readonly code: string = "APP_ERROR";
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
