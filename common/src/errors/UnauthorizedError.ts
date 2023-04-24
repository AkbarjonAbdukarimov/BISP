import { CustomError } from "./CustomError";

export class UnauthorizedError extends CustomError {
  statusCode: number = 401;
  constructor(message: string = "Not Authorized") {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
