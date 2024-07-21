const Joi = require("joi");
const mongoose = require("mongoose");
const { customerSchema } = require("./customer");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: { type: customerSchema, required: true },
    movie: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 255,
        required: true,
      },

      dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
    }),
    dateOut: { type: Date, required: true, default: Date.now },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 },
  })
);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
