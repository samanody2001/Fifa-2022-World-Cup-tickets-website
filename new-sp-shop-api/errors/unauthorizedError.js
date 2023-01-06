const CustomAPIError = require("./customAPIError");
const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends CustomAPIError {
  statusCode;
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizedError
