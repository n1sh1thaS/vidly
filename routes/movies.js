const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  res.send(await Movie.find().sort("title"));
});

router.post("/", auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    res.send(await movie.save());
  } catch (ex) {
    console.log(ex.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  let movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) return res.status(404).send("movie not found");
  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  let movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("movie not found");
  res.send(movie);
});

router.get("/:id", async (req, res) => {
  let movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("movie not found");
  res.send(movie);
});

module.exports = router;
