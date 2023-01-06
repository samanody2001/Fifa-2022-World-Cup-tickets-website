const path = require("path");
const express = require("express");
const app = express();
const { startKafkaProducer } = require("./connectors/kafka");
const connectDB = require("./db/connectDB");
const morgan = require("morgan");
require("express-async-errors");

//setting up security packages
const xss = require("xss-clean");
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

//setting up routes
const userRoute = require("./routes/userRoute");
const shopRoute = require("./routes/shopRoute");
const orderRoute = require("./routes/orderRoute");
const reservationRoute = require("./routes/reservationRoute");

//setting up middleware
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

const PORT = process.env.PORT || 5000;

// Config setup to parse JSON payloads from HTTP POST request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("tiny"));

//invoking security packages
app.set("trust proxy", 1);
//set limit to be 100 requests for 15 mins
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
//helps to secure headers
app.use(helmet());
//sanitizes input and prevent cross site scripting attack
app.use(xss());
//prevents mongoDB operator injection
app.use(mongoSanitize());
//for cross origin 
app.use(cors());

// Register the api routes
app.get("/api/v1", (req, res) => {
  res.status(200).json({ msg: "Connnection successful" });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/shop", shopRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/reservation", reservationRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Create HTTP Server and Listen for Requests
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await startKafkaProducer();
    app.listen(PORT, async () => {
      console.log("app is listening on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
