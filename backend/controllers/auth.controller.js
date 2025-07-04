import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const username = await User.findOne({ username: req.body.username });
    if (username) return res.status(403).json("The username already exists");

    const email = await User.findOne({ email: req.body.email });
    if (email) return res.status(403).json("The email already exists");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { password, ...info } = user._doc;
    res.status(201).json(info);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("Invalid username or password");

    const isPassCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPassCorrect)
      return res.status(403).json("Invalid username or password");

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");

    res.status(200).json("Logout successful");
  } catch (error) {
    next(error);
  }
};
