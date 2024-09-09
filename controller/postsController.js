const postModel = require("./../model/postsModel");
const AppError = require("./../utils/AppError");
const logger = require("../utils/logger");

const createPost = async (req, res, next) => {
  let image;
  if (req.body.image) image = req.body.image[0];
  const post = await postModel.create({
    ...req.body,
    user: req.user._id,
    image,
  });
  if (!post) {
    throw new AppError("Failed to create post", 500);
  }
  logger.info(`Post created: ${post._id}`);
  res.status(201).json(post);
};

const getPosts = async (req, res, next) => {
  const posts = await postModel.find().populate("user");

  res.status(200).send({ posts });
  logger.info(`Fetched ${posts.length} posts`);
};

const getPost = async (req, res, next) => {
  const post = await postModel.findById(req.params.id).populate("user");
  if (!post) {
    throw new AppError("Post with ID: ${req.params.id} not found!", 404);
  }
  logger.info(`Fetched post: ${post._id}`);
  res.status(200).json(post);
};

const updatePost = async (req, res, next) => {
  let image;
  if (req.body.image) image = req.body.image[0];
  const post = await postModel.findByIdAndUpdate(
    req.params.id,
    { ...req.body, image },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!post) {
    throw new AppError("Post with ID: ${req.params.id} not found!", 404);
  }
  res.status(200).json(post);
  logger.info(`Post updated: ${post._id}`);
};

const deletePost = async (req, res, next) => {
  const post = await postModel.findByIdAndDelete(req.params.id);
  if (!post) {
    throw new AppError("Post with ID: ${req.params.id} not found!", 404);
  }
  logger.info(`Post deleted: ${req.params.id}`);
  res.status(204).send();
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
