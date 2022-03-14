const { Router } = require("express");
const protect = require("../middleware/protect");
const route = Router();
const Games = require("../models/games.model");
const Users = require("../models/users.model");

route.get("/remove/:id", protect, async (req, res) => {
  try {
    let user = await Users.findById(req.body.user_id).lean().exec();
    let wishlist = user.wishlist;
    let new_wishlist = wishlist.filter((item) => item != req.params.id);
    user = await Users.findByIdAndUpdate(req.body.user_id, {
      wishlist: new_wishlist,
    });
    const games = await Games.find({ _id: { $in: new_wishlist } });
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

route.get("/", protect, async (req, res) => {
  try {
    const user = await Users.findById(req.body.user_id).lean().exec();
    const wishlist = await Games.find({ _id: { $in: user.wishlist } });
    return res.status(200).send({
      status: true,
      data: wishlist,
      message: "wishlist fetched successfully",
      error: false,
    });
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Data could not be fetched",
      error: true,
    });
  }
});

route.post("/", protect, async (req, res) => {
  try {
    const games = await Games.findById({ _id: req.body.game_id });
    if (!games) {
      return res
        .status(404)
        .send({ status: false, message: "Invalid game id", error: true });
    }

    const updated_user = await Users.findByIdAndUpdate(req.body.user_id, {
      $push: { wishlist: req.body.game_id },
    });
    if (!updated_user) {
      return res.status(500).send({
        status: false,
        message: "Product could not be added to wishlist",
        error: true,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Product added to wishlist",
      error: false,
    });
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Data could not be fetched",
      error: true,
    });
  }
});

module.exports = route;
