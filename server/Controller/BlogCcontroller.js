const blogModel = require("../model/BlogModel");

const getOneBlogs = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const addBlogs = async (req, res) => {
  const { Content, blog_image, Blog_Type, userId, username } = req.body;

  try {
    if (!Content || !Blog_Type || !userId || !username) {
      return res.status(400).json({
        success: false,
        message: "Blog not uploaded\nPlease try again",
      });
    }

    const addBlogs = new blogModel({
      Content,
      blog_image,
      Blog_Type,
      userId,
      username,
    });

    await addBlogs.save();
    return res.status(200).json({
      success: true,
      message: "Blog Uploaded Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getBlogs = async (req, res) => {
  try {
    const getAllBlogs = await blogModel.find({});
    if (!getAllBlogs) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch all the blogs",
      });
    }

    return res.status(200).json({
      success: true,
      message: getAllBlogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const addComments = async (req, res) => {
  const { id, username, commentText, userId } = req.body;
  try {
    const blog = await blogModel.updateOne(
      { _id: id },
      {
        $push: {
          comment: {
            id: userId,
            username,
            comment: commentText,
          },
        },
      }
    );
    if (blog.nModified === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to Add comment",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment Added Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const deleteComment = async (req, res) => {
  const { blogId, commentId } = req.body;
  try {
    const result = await blogModel.findOneAndUpdate(
      {
        _id: blogId,
      },
      {
        $pull: { comment: { _id: commentId } },
      }
    );

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete Comment",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const addLike = async (req, res) => {
  const { blogId, userId } = req.body;

  try {
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "No blog found",
      });
    }

    const userIndex = blog.likedBy.indexOf(userId);

    if (userIndex === -1) {
      // Add user to likedBy array
      blog.likedBy.push(userId);
      blog.markModified("likedBy"); // Inform Mongoose about changes
    } else {
      // Remove user from likedBy array
      blog.likedBy.splice(userIndex, 1);
      blog.markModified("likedBy");
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: userIndex === -1 ? "Blog liked" : "Blog unliked",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const blog = await blogModel.findByIdAndDelete(id);
    console.log(blog);
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Unable to delete blog",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const blog = await blogModel.findOne({ _id: id });
    const updatedField = {};
    for (const key in data) {
      if (data[key] !== blog[key]) {
        updatedField[key] = data[key];
      }
    }
    console.log(blog);
    console.log(updatedField);
    if (Object.keys(updatedField).length > 0) {
      const result = await blogModel.updateOne(
        { _id: id },
        { $set: updatedField }
      );
      console.log(result);
      return res.status(200).json({
        success: true,
        message: "Blog Updated Successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Blog not updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  addBlogs,
  getBlogs,
  addComments,
  getOneBlogs,
  deleteComment,
  addLike,
  deleteBlog,
  updateBlog,
};
