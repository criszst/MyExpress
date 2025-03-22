import IDetails from "../interfaces/IDetails";

class ErrorsDetails extends Error {
  details: IDetails

  constructor(errorName: string, message: string, details: IDetails) {
    super(message);

    // just WOP: Workaround-Oriented Programming :)
    this.name = errorName;

    this.details = details;
  }

  public static create(errorName: string, message: string, details: IDetails): ErrorsDetails {
    const expectedError = `${message}\n
------> ${details.expected} expected, but " ${details.received} " does not match\n`;

    return new ErrorsDetails(errorName, expectedError, details);
  }
}

export default ErrorsDetails