const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let imageSchcema = Schema(
  {
    name: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Image", imageSchcema);
