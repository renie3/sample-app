import Comment from "../models/comment.model.js";

export const getComments = async (req, res, next) => {
  const cursor = Number(req.query.cursor) || 0;

  const LIMIT = 2;

  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username img")
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .skip(cursor * LIMIT);

    const hasNextPage = comments.length === LIMIT;

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    return res
      .status(200)
      .json({ comments, nextCursor: hasNextPage ? cursor + 1 : null });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    await Comment.create({
      ...req.body,
      user: req.userId,
      post: req.params.postId,
    });

    return res.status(201).json("Comment has been created");
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (req.userId !== comment.user.toString()) {
      return res.status(403).json("You can update only your comment");
    }

    await Comment.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    return res.status(200).json("Comment has been updated");
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json("Comment not found");

    if (req.userId !== comment.user.toString()) {
      return res.status(403).json("You can delete only your comment");
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json("Comment has been deleted");
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const userId = req.userId;

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json("Comment not found");

    const hasLiked = comment.likes.some((id) => id.toString() === userId);
    const hasDisliked = comment.dislikes.some((id) => id.toString() === userId);

    if (!hasLiked) {
      await Comment.findByIdAndUpdate(req.params.id, {
        $addToSet: { likes: userId },
        $inc: { likesCount: 1 },
      });

      // Remove dislike if present
      if (hasDisliked) {
        await Comment.findByIdAndUpdate(req.params.id, {
          $pull: { dislikes: userId },
          $inc: { dislikesCount: -1 },
        });
      }
    } else {
      await Comment.findByIdAndUpdate(req.params.id, {
        $pull: { likes: userId },
        $inc: { likesCount: -1 },
      });
    }

    res
      .status(200)
      .json(
        !hasLiked ? "Comment has been liked" : "Comment like has been removed"
      );
  } catch (error) {
    next(error);
  }
};

export const dislikeComment = async (req, res, next) => {
  try {
    const userId = req.userId;

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json("Comment not found");

    const hasLiked = comment.likes.some((id) => id.toString() === userId);
    const hasDisliked = comment.dislikes.some((id) => id.toString() === userId);

    if (!hasDisliked) {
      await Comment.findByIdAndUpdate(req.params.id, {
        $addToSet: { dislikes: userId },
        $inc: { dislikesCount: 1 },
      });

      // Remove like if present
      if (hasLiked) {
        await Comment.findByIdAndUpdate(req.params.id, {
          $pull: { likes: userId },
          $inc: { likesCount: -1 },
        });
      }
    } else {
      await Comment.findByIdAndUpdate(req.params.id, {
        $pull: { dislikes: userId },
        $inc: { dislikesCount: -1 },
      });
    }

    res
      .status(200)
      .json(
        !hasDisliked
          ? "Comment has been disliked"
          : "Comment dislike has been removed"
      );
  } catch (error) {
    next(error);
  }
};
