require("dotenv").config();
const { v4 } = require("uuid");
const db = require("../connectors/postgres");
const { sendKafkaMessage } = require("../connectors/kafka");
const {
  validateTicketReservationDto,
} = require("../utils/validation/reservation");
const messagesType = require("../utils/constants/messages");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const masterList = require("../fixtures/master-list.json");
const { writeFile } = require("fs");
const path = require("path");
const { ValidationError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkout } = require("./orderController");

const reservationController = async (req, res) => {
  console.log("reservation begins");
  // TODO: Update master list to reflect ticket sale
  // let result = [];

  // for (let item in list) {
  //   if (item.matchNumber === req.body.matchNumber) {
  //     const category = tickets.category;
  //     const currentItem = item.availability[`${category}`];
  //     item.availability[`${category}`] = {
  //       count: currentItem.count - tickets.quantity,
  //       price: currentItem.price,
  //     };
  //     result.push(item);
  //   } else {
  //     result.push(item);
  //   }
  // }

  // const path = path.join(__dirname, "../fixtures", "master-list.json");
  // writeFile(path, JSON.stringify(result), (error) => {
  //   if (error) {
  //     console.log("An error has occurred ", error);
  //     return;
  //   }
  //   console.log("Data written successfully to disk");
  // });
  const { tickets, matchNumber, userId } = req.body;

  if (!tickets || !matchNumber || !userId) {
    throw new BadRequestError("Kindly include all necessities to proceed");
  }

  //generate client secret and save order details to DB
  const { clientSecret, totalOrderAmount, customBody } = await checkout(
    req,
    res
  );

  // validate payload before proceeding with reservations
  const validationError = validateTicketReservationDto(customBody);
  if (validationError) {
    console.log(validationError);
    throw new BadRequestError("data validation error");
  }
  console.log("validation successful");

  // Return success response to client
  return res.status(StatusCodes.CREATED).json({
    message: "Ticket Purchase Reserved",
    clientSecret,
    totalOrderAmount,
  });
};

module.exports = { reservationController };
