const Joi = require("joi");

module.exports.schemaValidate = Joi.object({
  listing: Joi.object({

    title: Joi.string().required(),

    description: Joi.string().required(),

    image: Joi.string().allow("", null),

    price: Joi.number().required().min(0),

    location: Joi.string().required(),

    country: Joi.string().required(),
  }).required(),
});

module.exports.reviewValidate = Joi.object({
  reviews : Joi.object({
    ratings : Joi.number().required().min(1).max(5) ,
    comments : Joi.string().required()
  }).required()
})
