const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Customer, validateCustomer } = require("../models/customer");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  res.send(await Customer.find().sort("name"));
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  try {
    res.send(await customer.save());
  } catch (ex) {
    console.log(ex.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true }
  );

  if (!customer) return res.status(404).send("customer not found");
  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  let customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("customer not found");
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("customer not found");
  res.send(customer);
});

module.exports = router;
