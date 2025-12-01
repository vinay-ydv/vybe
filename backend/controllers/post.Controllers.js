import Post from "../models/post.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  console.log("=== [POST /post/create] Incoming request ===");
  console.log("Body:", req.body);
  console.log("UserID from auth middleware:", req.userId);
  console.log("File info:", req.file);

  try {
    const { description } = req.body;

    // Validate: Must have EITHER description OR image
    if (!description?.trim() && !req.file) {
      console.warn("[createPost] Validation failed: No description or image");
      return res.status(400).json({ 
        message: "Post must have either a description or an image" 
      });
    }

    let newPost;

    if (req.file) {
      const filePath = req.file.path;
      console.log("[createPost] File received at path:", filePath);

      try {
        const imageUrl = await uploadOnCloudinary(filePath);
        console.log("[createPost] Image uploaded to Cloudinary:", imageUrl);

        newPost = await Post.create({
          author: req.userId,
          description: description || "", // Empty string if no description
          image: imageUrl,
        });
        console.log("[createPost] Post created with image:", newPost._id);
      } catch (cloudError) {
        console.error("[createPost] Cloudinary upload failed:", cloudError);
        return res.status(500).json({ 
          message: "Image upload failed",
          error: cloudError.message 
        });
      }
    } else {
      console.log("[createPost] No file found, creating text-only post");
      newPost = await Post.create({
        author: req.userId,
        description: description.trim(),
      });
      console.log("[createPost] Post created without image:", newPost._id);
    }

    // Optionally emit socket event
    // io.emit("newPost", newPost);

    return res.status(201).json({ message: "Post created", post: newPost });
  } catch (error) {
    console.error("[createPost] Unhandled error:", error);
    console.error("[createPost] Error stack:", error.stack);
    return res.status(500).json({ 
      message: "Failed to create post",
      error: error.message 
    });
  }
};

export const getPost = async (req, res) => {
  console.log("=== [GET /post] Fetching posts ===");
  try {
    const post = await Post.find()
      .populate("author", "firstName lastName profileImage headline userName")
      .populate("comment.user", "firstName lastName profileImage headline")
      .sort({ createdAt: -1 });

    console.log("[getPost] Posts found:", post.length);
    return res.status(200).json(post);
  } catch (error) {
    console.error("[getPost] Error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch posts",
      error: error.message 
    });
  }
};

export const like = async (req, res) => {
  console.log("=== [POST /post/:id/like] ===");
  console.log("Params:", req.params, "UserID:", req.userId);

  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      console.warn("[like] Post not found:", postId);
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.like.includes(userId)) {
      console.log("[like] User already liked, removing like");
      post.like = post.like.filter((id) => id.toString() !== userId.toString());
    } else {
      console.log("[like] Adding like from user:", userId);
      post.like.push(userId);
      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          receiver: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });
        console.log("[like] Notification created for like");
      }
    }

    await post.save();
    console.log("[like] Post likes updated, total likes:", post.like.length);

    io.emit("likeUpdated", { postId, likes: post.like });

    return res.status(200).json(post);
  } catch (error) {
    console.error("[like] Error:", error);
    return res.status(500).json({ 
      message: "Failed to update like",
      error: error.message 
    });
  }
};

export const comment = async (req, res) => {
  console.log("=== DEBUG INFO ===");
  console.log("req.body:", req.body);
  console.log("content:", req.body.content);
  console.log("Type of content:", typeof req.body.content);
  console.log("=== [POST /post/:id/comment] ===");
  console.log("Params:", req.params, "UserID:", req.userId, "Body:", req.body);

  try {
    const postId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comment: { content, user: userId } },
      },
      { new: true }
    ).populate("comment.user", "firstName lastName profileImage headline");

    if (!post) {
      console.warn("[comment] Post not found:", postId);
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        receiver: post.author,
        type: "comment",
        relatedUser: userId,
        relatedPost: postId,
      });
      console.log("[comment] Notification created for comment");
    }

    io.emit("commentAdded", { postId, comment: post.comment });
    console.log("[comment] Comment added, total comments:", post.comment.length);

    return res.status(200).json(post);
  } catch (error) {
    console.error("[comment] Error:", error);
    return res.status(500).json({ 
      message: "Failed to add comment",
      error: error.message 
    });
  }
};