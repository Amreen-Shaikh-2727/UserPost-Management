const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");

const router = express.Router();

// POST /posts - Create a post linked to a user
router.post("/", async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
      return res.status(400).json({
        message: "Title, content, and userId are required.",
      });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const post = await Post.create({
      title,
      content,
      user: userId,
    });

    res.status(201).json({
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET /posts - Get all posts with user information
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;