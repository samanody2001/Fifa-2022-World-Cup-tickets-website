const CustomAPIError = require("./customAPIError");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomAPIError {
  statusCode;
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
