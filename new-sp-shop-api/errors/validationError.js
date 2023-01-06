const CustomAPIError = require("./customAPIError");
const { StatusCodes } = require("http-status-codes");

class ValidationError extends CustomAPIError {
  statusCode;
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ValidationError;
