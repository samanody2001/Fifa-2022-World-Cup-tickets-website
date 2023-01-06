const mongoose = require("mongoose");

const SingleTicket = new mongoose.Schema({
  category: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
});

const SingleOrderItem = new mongoose.Schema({
  matchNumber: {
    type: Number,
    required: true,
  },
  tickets: SingleTicket,
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [SingleOrderItem],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
    totalOrderAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
