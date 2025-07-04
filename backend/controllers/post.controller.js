import Post from "../models/post.model.js";

export const getPosts = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const searchQuery = req.query.search || req.query.q;
  const category = req.query.category;
  const sort = req.query.sort;

  const ITEM_PER_PAGE = 12;

  try {
    const query = {};

    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const sortOption = sort === "popular" ? { visit: -1 } : { createdAt: -1 };

    const posts = await Post.find(query)
      // .sort(sort === "popular" ? { visit: -1 } : { createdAt: -1 })
      .sort(sortOption)
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));

    const totalPosts = await Post.countDocuments(query);

    return res.status(200).json({ posts, totalPosts });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username img"
    );
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    if (!req.isAdmin) return res.status(403).json("Admin only");

    const title = await Post.findOne({ title: req.body.title });
    if (title) return res.status(403).json("The title already exists");

    await Post.create({ ...req.body, user: req.userId });

    res.status(201).json("Post has been created");
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    if (!req.isAdmin) return res.status(403).json("Admin only");

    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json("Post has been updated");
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    if (!req.isAdmin) return res.status(403).json("Admin only");

    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    res.status(200).json("Post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getFeaturedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getRelatedPosts = async (req, res, next) => {
  const category = req.query.category;
  const postId = req.query.postId;

  try {
    const posts = await Post.find({ category, _id: { $ne: postId } })
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const incrementVisit = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { visit: 1 },
    });
    return res.status(200).json({ message: "View incremented" });
  } catch (error) {
    next(error);
  }
};
