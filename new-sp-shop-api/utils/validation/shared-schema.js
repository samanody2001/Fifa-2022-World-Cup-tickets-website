const Joi = require("@hapi/joi");

exports.tickets = Joi.object()
  .keys({
    category: Joi.string()
      .strict()
      .valid("category1", "category2", "category3")
      .required(),
    quantity: Joi.number().strict().min(1).max(2).required(),
    price: Joi.number().strict().valid(75, 125, 195).required(),
  })
  .required();
