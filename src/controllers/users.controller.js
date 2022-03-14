const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const token = jwt.sign({ foo: "bar" }, "shhhhh");
const User = require("../models/users.model");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_TOKEN);
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id).lean().exec();
    if (!user) {
      res.status(404).send({
        status: false,
        message: "User could not be signed up, no user available",
        error: err.message,
      });
    }
    res.status(200).send({
      status: true,
      data: user,
      message: "User details fetched succesfully",
      error: false,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "User could not be fetched",
      error: err.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(403).send({
        status: false,
        message: "Invalid email or password",
        error: true,
      });
    }

    try {
      const match = await user.checkPassword(req.body.password);
      if (!match) {
        res.status(403).send({
          status: false,
          message: "Invalid email or password",
          error: true,
        });
      }
      const token = generateToken(user._id);
      res.status(200).send({
        status: true,
        token: token,
        message: "user login successfull",
        error: false,
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: "User could not be signed up, some error occurred",
        error: err.message,
      });
    }
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "User could not be signed up, some error occurred",
      error: e.message,
    });
  }
};

const signup = async (req, res) => {
  try {
    let user;
    user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).send({
        status: false,
        message: "User with same email already exist",
        error: true,
      });
    }
    user = await User.create(req.body);
    const token = generateToken(user);
    console.log("token 26 ", token, user);
    res.status(201).send({
      status: true,
      token: token,
      message: "User signed in successfully",
      error: false,
    });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "User could not be signed up, some error occurred",
      error: e.message,
    });
  }
};

module.exports = { login, signup, getUser };
