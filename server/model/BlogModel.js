const mongoose = require("mongoose");
const { Schema } = mongoose;

const blog = new mongoose.Schema(
  {
    Blog_Type: {
      type: String,
      required: true,
    },
    Content: {
      type: String,
      required: true,
    },
    blog_image: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    comment: {
      type: [
        {
          id: {
            type: String,
          },
          username: {
            type: String,
          },
          comment: {
            type: String,
            minlength: 1,
            maxlength: 500,
          },
          date: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const blogModel = mongoose.models.blog || mongoose.model("Blog", blog);

module.exports = blogModel;
