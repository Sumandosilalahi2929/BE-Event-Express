const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let usersSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "nama harus diisi"],
      minlength: 3,
      maxlegth: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email harus diisi"],
    },
    password: {
      type: String,
      unique: true,
      required: [true, "passoword harus diisi"],
      minlength: 6,
    },
    role: {
      type: String,
      role: ["admin", "organizer", "owner"],
      default: "admin",
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
  },
  { timestamps: true }
);

usersSchema.pre("save", async function (next) {
  const User = this;
  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

usersSchema.methods.comparePassword = async function (canditatePassword) {
  const isMath = await bcrypt.compare(canditatePassword, this.password);
  return isMath;
};

module.exports = model("User", usersSchema);
