export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors(): Array<{ message: string; field?: string }> {
    return [{ message: this.message }];
  }
}
