import { AppError } from "./AppError";

export class SubscriptionIsNotAliveError extends AppError {
  readonly code: string = "SUBSCRIPTION_IS_NOT_ALIVE";
  constructor(message: string) {
    super(message);
  }
}
