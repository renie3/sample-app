import express from "express";
import {
  addComment,
  deleteComment,
  dislikeComment,
  getComments,
  likeComment,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:postId", getComments);
router.post("/:postId", verifyToken, addComment);
router.put("/:id", verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);
router.patch("/like/:id", verifyToken, likeComment);
router.patch("/dislike/:id", verifyToken, dislikeComment);

export default router;
