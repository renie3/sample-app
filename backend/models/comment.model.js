import { Schema } from "mongoose";
import mongoose from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
