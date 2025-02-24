const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let talentSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
    },
    role: {
      type: String,
      default: "-",
    },

    //untuk membuat relasi pada mongodb kita perlu membuat types objectId
    Image: {
      type: mongoose.Types.ObjectId,
      ref: "image",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Talent", talentSchema);
