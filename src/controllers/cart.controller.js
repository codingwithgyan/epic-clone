const { Router } = require("express");
const route = Router();
const Games = require("../models/games.model");
const Users = require("../models/users.model");
const protect = require("../middleware/protect");

route.get("/remove/:id", protect, async (req, res) => {
  try {
    let user = await Users.findById(req.body.user_id).lean().exec();
    let orders = user.orders;
    let new_orders = orders.filter((item) => item != req.params.id);
    user = await Users.findByIdAndUpdate(req.body.user_id, {
      orders: new_orders,
    });
    const games = await Games.find({ _id: { $in: new_orders } });
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
    const games = await Games.find({ _id: { $in: user.orders } });
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
    const games = await Games.findById({ _id: req.body.game_id });
    if (!games) {
      return res
        .status(404)
        .send({ status: false, message: "Invalid game id", error: true });
    }

    const updated_user = await Users.findByIdAndUpdate(req.body.user_id, {
      $push: { orders: req.body.game_id },
    });
    if (!updated_user) {
      return res.status(500).send({
        status: false,
        message: "Product could not be added to cart",
        error: true,
      });
    }

    return res
      .status(200)
      .send({ status: true, message: "Product added to cart", error: false });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: false,
      message: "Data could not be fetched",
      error: true,
    });
  }
});

module.exports = route;
