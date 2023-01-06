const { startKafkaConsumer } = require("./connectors/kafka");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Kafka consumer running..." });
});

startKafkaConsumer();

//Create HTTP Server and Listen for Requests
const start = async () => {
  try {
    app.listen(PORT, async () => {
      console.log("app is listening on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
