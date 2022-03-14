const { Router } = require("express");
const route = Router();
const Games = require("../models/games.model");
const Users = require("../models/users.model");
const protect = require("../middleware/protect");

module.exports = route;

route.get("/", protect, async (req, res) => {
  try {
    const user = await Users.findById(req.body.user_id).lean().exec();
    const games = await Games.find({ _id: { $in: user.purchased } });
    return res.status(200).send({
      status: true,
      data: games,
      message: "Cart fetched successfully",
      error: false,
    });
  } catch (err) {
    console.log("error", err);
    return res.status(500).send({
      status: false,
      message: "Data could not be fetched",
      error: true,
    });
  }
});

route.post("/", protect, async (req, res) => {
  try {
    const user = await Users.findByIdAndUpdate(req.body.user_id, {
      $push: { purchased: req.body.game_id },
      orders: [],
    })
      .lean()
      .exec();
    if (!user) {
      return res.status(500).send({
        status: false,
        message: "Purchase failed",
        error: true,
      });
    }
    // console.log(user);
    return res.status(200).send({
      status: true,
      data: user,
      message: "Item purchased sucessfully",
      error: false,
    });
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Purchase failed",
      error: true,
    });
  }
});
