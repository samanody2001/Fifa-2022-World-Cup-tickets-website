const masterList = require("../fixtures/master-list.json");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const path = require("path");
const { writeFile } = require("fs");

const getAllProducts = (req, res) => {
  let result = [];

  for (const item of masterList) {
    const newObj = {
      matchNumber: item.matchNumber,
      dateUtc: item.dateUtc,
      location: item.location,
      homeTeam: item.homeTeam,
      awayTeam: item.awayTeam,
    };

    result.push(newObj);
  }

  res.status(StatusCodes.OK).json({ tickets: result });
};

const getSingleProduct = (req, res) => {
  const { matchNumber } = req.body;

  if (!matchNumber) {
    throw new BadRequestError("Please provide match number");
  }

  let result;

  for (const item of masterList) {
    if (item.matchNumber === matchNumber) {
      result = item;
    }
  }

  res.status(StatusCodes.OK).json({ ticket: result });
};

const updateProducts = (req, res) => {
  // {
  //   meta: { action: 'TICKET_RESERVED' },
  //   body: { matchNumber: 1, tickets: { category: 1, price:
  // 75, quantity: 1 } }
  // }
  const { action, matchNumber, tickets } = req.body;
  const list = masterList;
  let result = [];

  if (!action || !matchNumber || !tickets) {
    throw new BadRequestError("Kindly provide all necessary values");
  }

  console.log(req.body);
  for (let item of list) {
    if (item.matchNumber === matchNumber) {
      const category = "category" + tickets.category;
      const currentItem = item.availability[`${category}`];

      if (
        action === "TICKET_PENDING" &&
        currentItem.available >= tickets.quantity
      ) {
        console.log("pending");
        currentItem.pending += tickets.quantity;
        currentItem.available -= tickets.quantity;
      } else if (
        action === "TICKET_RESERVED" &&
        currentItem.pending >= tickets.quantity
      ) {
        console.log("reserved");
        currentItem.pending = currentItem.pending - tickets.quantity;
      } else if (
        action === "TICKET_CANCELLED" &&
        currentItem.pending >= tickets.quantity
      ) {
        currentItem.pending = currentItem.pending - tickets.quantity;
        currentItem.available = currentItem.available + tickets.quantity;
      }
      result.push(item);
    } else {
      result.push(item);
    }
  }

  const pathLink = path.join(__dirname, "../fixtures", "master-list.json");
  writeFile(pathLink, JSON.stringify(result), (error) => {
    if (error) {
      throw new BadRequestError("");
      return;
    }
    console.log("Data written successfully to disk");
  });

  res.status(StatusCodes.OK).json({ msg: "master list updated" });
};

module.exports = { getAllProducts, getSingleProduct, updateProducts };
