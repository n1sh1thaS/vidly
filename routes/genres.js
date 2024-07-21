const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validateGenre } = require("../models/genre");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  res.send(await Genre.find().sort("name"));
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  try {
    res.send(await genre.save());
  } catch (ex) {
    console.log(ex.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) return res.status(404).send("genre not found");
  res.send(genre);
});

router.delete("/:id", auth, async (req, res) => {
  let genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("genre not found");
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  let genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("genre not found");
  res.send(genre);
});

module.exports = router;
