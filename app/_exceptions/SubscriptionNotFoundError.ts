import { AppError } from "./AppError";

export class SubscriptionNotFoundError extends AppError {
  readonly code: string = "SUBSCRIPTION_NOT_FOUND";
  constructor(message: string) {
    super(message);
  }
}
