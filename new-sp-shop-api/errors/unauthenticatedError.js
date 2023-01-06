const CustomAPIError = require("./customAPIError");
const { StatusCodes } = require("http-status-codes");

class UnauthenticatedError extends CustomAPIError {
  statusCode;
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
