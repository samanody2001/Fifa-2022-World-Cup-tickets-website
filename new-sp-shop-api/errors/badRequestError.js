const CustomAPIError = require("./customAPIError");
const { StatusCodes } = require("http-status-codes");

class BadRequestError extends CustomAPIError {
  statusCode;
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
