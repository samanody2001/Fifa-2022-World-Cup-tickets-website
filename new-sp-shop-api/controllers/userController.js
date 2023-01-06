const { BadRequestError, NotFoundError } = require("../errors");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");

const createUser = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new BadRequestError("name and email fields cannot be empty");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(StatusCodes.CREATED).json({ user: userExists });
    return;
  }

  const user = await User.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({ user });
};

const getSingleUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Email field cannot be empty");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User cannot be found");
  }

  res.status(StatusCodes.CREATED).json({ user });
};

module.exports = { createUser, getSingleUser };
