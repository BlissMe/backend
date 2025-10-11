const doctorModel = require("../models/doctorModel");

const addComment = async (req, res) => {
  try {
    const { userID, level, comment } = req.body;

    if (!userID || !level || !comment) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    let existingComment = await doctorModel.findOne({ userID });

    if (existingComment) {
      existingComment.level = level;
      existingComment.comment = comment;
      await existingComment.save();
      return res.json({ success: true, message: "Comment updated successfully.", data: existingComment });
    }

    const newComment = new doctorModel({ userID, level, comment });
    await newComment.save();

    res.json({ success: true, message: "Comment added successfully.", data: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await doctorModel.find();
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


module.exports = { addComment, getComments };

