const { Router } = require("express");
const postsController = require("./../controller/postsController");
const auth = require("./../middlewares/auth");
const images = require("./../middlewares/images");

const router = Router();

router.get("/", postsController.getPosts);
router.get("/:id", postsController.getPost);

router.use(auth);
router.post(
  "/",
  images.uploadImages([{ name: "image", count: 1 }]),
  images.handleImages("image"),
  postsController.createPost
);

router.patch(
  "/:id",
  images.uploadImages([{ name: "image", count: 1 }]),
  images.handleImages("image"),
  postsController.updatePost
);

router.delete("/:id", postsController.deletePost);

module.exports = router;
