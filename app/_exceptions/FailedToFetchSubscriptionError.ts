import { AppError } from "./AppError";

export class FailedToFetchSubscriptionError extends AppError {
  readonly code: string = "FAILED_TO_FETCH_SUBSCRIPTION";
  constructor(message: string) {
    super(message);
  }
}
