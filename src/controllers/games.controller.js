const { Router } = require("express");
const Games = require("../models/games.model");

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const games = await Games.find({
      title: new RegExp(".*" + req.query.text + ".*", "i"),
    })
      .lean()
      .exec();
    res.status(200).send({
      status: true,
      data: games,
      message: "Data inserted successfully",
      error: false,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: false,
      message: "Data could not be fetched",
      error: e.message,
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const games = await Games.create(req.body);
    res.status(201).send({
      status: true,
      data: games,
      message: "Data inserted successfully",
      error: false,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: false,
      message: "Data could not be inserted",
      error: e.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const games = await Games.find().lean().exec();
    res.status(200).send({
      status: true,
      data: games,
      message: "Data fetched successfully",
      error: false,
    });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Data could not be fetched",
      error: e.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const games = await Games.findById({ _id: req.params.id }).lean().exec();
    if (!games) {
      res.status(404).send({
        status: true,
        data: [],
        message: "No data available",
        error: false,
      });
    }
    res.status(200).send({
      status: true,
      data: games,
      message: "Data fetched successfully",
      error: false,
    });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Data could not be fetched",
      error: e.message,
    });
  }
});

module.exports = router;
