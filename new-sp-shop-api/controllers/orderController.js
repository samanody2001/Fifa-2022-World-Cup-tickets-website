const Order = require("../models/orderModel");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const masterList = require("../fixtures/master-list.json");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { sendKafkaMessage } = require("../connectors/kafka");
const messagesType = require("../utils/constants/messages");
const moment = require("moment");
require("dotenv").config();

const getSingleClientOrders = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new BadRequestError("Kindly include all necessities to proceed");
  }

  const orders = await Order.find({ userId });

  res.status(StatusCodes.OK).json({ orders });
};

const checkout = async (req, res) => {
  const { tickets, matchNumber, userId } = req.body;
  const list = masterList;

  if (!tickets || !matchNumber || !userId) {
    console.log(req.body);
    throw new BadRequestError("Kindly include all necessities to proceed");
  }

  //verify item price on server
  let itemToBuy;
  let price;

  for (const item of list) {
    if (item.matchNumber === matchNumber) {
      const category = tickets.category;
      const currentItem = item.availability[category];
      itemToBuy = item;
      price = currentItem.price;
    }
  }

  //check if item quantity required is available
  const qtyAvailable = itemToBuy.availability[tickets.category].available;
  if (qtyAvailable < tickets.quantity) {
    console.log("here");
    throw new BadRequestError("Quantity needed exceeds quantity available");
  }

  const totalOrderAmount = price * tickets.quantity * 100;

  //generate payment intent to client for payment completion
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalOrderAmount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  //keep track of order in database
  const data = {
    userId: userId,
    orderItems: [
      {
        matchNumber,
        tickets: {
          category: tickets.category,
          quantity: tickets.quantity,
          price,
        },
      },
    ],
    totalOrderAmount: totalOrderAmount / 100,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
  const order = await Order.create(data);
  const orderItem = order.orderItems[0];
  const customBody = {
    matchNumber: orderItem.matchNumber,
    tickets: {
      category: orderItem.tickets.category,
      price: orderItem.tickets.price,
      quantity: orderItem.tickets.quantity,
    },
    userId: order.userId.toString(),
  };

  return {
    clientSecret: paymentIntent.client_secret,
    totalOrderAmount,
    customBody,
  };
};

const confirmPayment = async (req, res) => {
  const event = req.body;
  const endpointSecret = process.env.STRIPE_END_POINT_SECRET;

  //signature verification for payment
  // if (endpointSecret) {
  //   // Get the signature sent by Stripe
  //   const signature = request.headers["stripe-signature"];
  //   try {
  //     event = stripe.webhooks.constructEvent(
  //       request.body,
  //       signature,
  //       endpointSecret
  //     );
  //     console.log(event.type)
  //   } catch (err) {
  //     console.log(`⚠️  Webhook signature verification failed.`, err.message);
  //     return response.sendStatus(400);
  //   }
  // }

  // Send message indicating ticket is pending checkout
  // so shop consumers can process message and call
  // sp-shop-api to decrement available ticket count
  const eventId = event.data.object.payment_intent;
  const order = await Order.findOne({ paymentIntentId: eventId });
  const item = order.orderItems[0];

  const messageTicket = {
    category: +item.tickets.category.split("y")[1],
    price: item.tickets.price,
    quantity: item.tickets.quantity,
  };
  console.log(event.type);
  try {
    await sendKafkaMessage(messagesType.TICKET_PENDING, {
      meta: { action: messagesType.TICKET_PENDING },
      body: {
        matchNumber: item.matchNumber,
        tickets: messageTicket,
      },
    });
    console.log("sending message successful");
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Sending message failed");
  }

  if (event.type === "charge.succeeded") {
    if (order) {
      // Send reserved message indicating ticket sale was succesful
      try {
        await sendKafkaMessage(messagesType.TICKET_RESERVED, {
          meta: { action: messagesType.TICKET_RESERVED },
          body: {
            matchNumber: item.matchNumber,
            tickets: messageTicket,
          },
        });
        console.log("Sending success message completed");
        order.status = "paid";
        await order.save();
        console.log("final success");
      } catch (error) {
        throw new BadRequestError("Sending message failed");
      }
    }
  }

  if (event.type === "charge.failed") {
    if (order) {
      console.log("order failed started");
      try {
        // Send cancellation message indicating ticket sale failed
        await sendKafkaMessage(messagesType.TICKET_CANCELLED, {
          meta: { action: messagesType.TICKET_CANCELLED },
          body: {
            matchNumber: item.matchNumber,
            tickets: messageTicket,
          },
        });
        orderFailed.status = "cancelled";
        await orderFailed.save();
        console.log("sending cancellation message suceeded");
      } catch (error) {
        throw new BadRequestError("Sending message failed");
      }
    }
  }

  // Unexpected event type
  console.log(`Unhandled event type ${event.type}.`);

  // Return a 200 response to acknowledge receipt of the event
  res.status(StatusCodes.OK).json({
    msg: "Payment Succesful",
  });
};

const showStats = async (req, res) => {
  const { adminSecret } = req.body;

  let totalAmount = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: { _id: "$status", count: { $sum: "$orderItems.tickets.price" } },
    },
  ]);

  let stats = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, item) => {
    const { _id: title, count } = item;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    paid: stats.paid || 0,
    cancelled: stats.cancelled || 0,
  };

  let categoryStats = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          category: "$orderItems.tickets.category",
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 9 },
  ]);

  categoryStats = categoryStats
    .map((item) => {
      const {
        _id: { year, month, category },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count, category: category[0] };
    })
    .reverse();

  categoryStats = categoryStats.reduce((acc, item) => {
    let result = acc.find((arrItem) => arrItem.date === item.date);
    if (result) {
      result.tickets = [
        ...result.tickets,
        { count: item.count, category: item.category },
      ];
      const index = acc.indexOf(item.date);
      acc[index] = result;
    } else {
      result = {
        date: item.date,
        tickets: [{ count: item.count, category: item.category }],
      };
      acc.push(result);
    }
    return acc;
  }, []);

  res.json({ totalAmount, defaultStats, categoryStats });
};

module.exports = { getSingleClientOrders, checkout, confirmPayment, showStats };
