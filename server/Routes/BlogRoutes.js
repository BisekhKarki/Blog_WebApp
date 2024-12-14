const express = require("express");
const {
  addBlogs,
  getBlogs,
  addComments,
  getOneBlogs,
  deleteComment,
  addLike,
  deleteBlog,
  updateBlog,
} = require("../Controller/BlogCcontroller");
const router = express.Router();

router.post("/add", addBlogs);
router.get("/get", getBlogs);
router.post("/comment", addComments);
router.get("/getBlog/:id", getOneBlogs);
router.post("/getComment", deleteComment);
router.post("/like", addLike);
router.delete("/delete/:id", deleteBlog);
router.patch("/update/:id", updateBlog);

module.exports = router;
