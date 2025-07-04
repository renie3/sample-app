import express from "express";
import {
  createPost,
  deletePost,
  getFeaturedPosts,
  getPost,
  getPosts,
  getRelatedPosts,
  incrementVisit,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/featured", getFeaturedPosts);
router.get("/related", getRelatedPosts);

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.patch("/visit/:id", incrementVisit);

export default router;
