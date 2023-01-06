require('dotenv').config();
const { Kafka } = require('kafkajs')
const validate = require('../validation/kafka');
const messages = require('../constants/messages');
const { BadRequestError } = require('../errors');

const kafka = new Kafka({
  clientId: `${process.env.CLIENT_ID}-dev`,
  brokers: [process.env.KAFKA_BROKERS],
  ssl: true,
  logLevel: 2,  
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD
  },
});

const topic = `${process.env.TOPIC_FIFA_TICKET_SALES}-dev`;
const producer = kafka.producer();

const startKafkaProducer = async () => {
  await producer.connect()
  console.log("kafka conneccted")
};

const sendKafkaMessage = async (messageType, message) => {
  // validate kafka message against schema prior to sending
  const validationError = validate.kafkaMessage(message);
  if (validationError) {
    console.log(validationError)
    throw new BadRequestError("Kafka message validation failed")
  }

  // send message to kafka broker
  await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });

  // successfully exit
  return Promise.resolve();
};

module.exports = {
  startKafkaProducer,
  sendKafkaMessage,
};