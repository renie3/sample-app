import Post from "../models/post.model.js";

const increaseVisit = async (req, res, next) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { visit: 1 } });

  next();
};

export default increaseVisit;
