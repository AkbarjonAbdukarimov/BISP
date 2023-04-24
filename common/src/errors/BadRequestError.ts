import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
  public statusCode: number = 400;
  constructor(message: string = "Something went wrong") {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
