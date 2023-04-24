import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  public statusCode: number = 404;
  constructor(message: string = "Not Found") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
