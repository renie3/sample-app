import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const search = req.query.search;

  const ITEM_PER_PAGE = 12;

  try {
    if (!req.isAdmin) return res.status(403).json("Admin only");

    const query = { _id: { $ne: req.userId } };

    if (search) {
      query.username = { $regex: search, $options: "i" };
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));

    const totalUsers = await User.countDocuments(query);

    return res.status(200).json({ users, totalUsers });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    if (!req.isAdmin) return res.status(403).json("Admin only");

    const username = await User.findOne({ username: req.body.username });
    if (username) return res.status(403).json("The username already exists");

    const email = await User.findOne({ email: req.body.email });
    if (email) return res.status(403).json("The email already exists");

    const hash = await bcrypt.hash(req.body.password, 10);
    await User.create({
      ...req.body,
      password: hash,
    });

    res.status(201).json("User has been created");
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.userId && !req.isAdmin) {
      return res.status(403).json("You can update only your account");
    }

    // remove empty or undefined values
    Object.keys(req.body).forEach(
      (key) =>
        (req.body[key] === "" || req.body[key] === undefined) &&
        delete req.body[key]
    );

    // hash password if it exist
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    const { password, ...info } = updatedUser._doc;
    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (!req.isAdmin) return res.status(403).json("Admin only");

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json("User not found");

    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};
