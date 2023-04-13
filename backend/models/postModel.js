const mongoose = require("mongoose"); // Erase if already required
const Comment = require("./commentModel");

// Declare the Schema of the Mongo model
var postSchema = new mongoose.Schema(
  {
    postUrl: {
      type: Array,
    },
    desc: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    postedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
      profilPhoto: String,
    },
    comments: [Comment.schema],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Post", postSchema);
