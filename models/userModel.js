const mongoose = require("mongoose");
const validator = require("validator");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config({ path: "./config.env" });
const dbString = process.env.DB_CONNECT_STRING.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);
mongoose
  .connect(dbString, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connection was succesful");
  });
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "user must have a name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "user must have a last name"],
    trim: true,
  },

  email: {
    type: String,
    unique: [true, "this email has been used"],
    required: [true, "user must have a email"],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  phoneNum: {
    type: String,
    unique: [true, "this number has been used"],
    required: [true, "user must have a phone number"],
    trim: true,
    validate: [validator.isMobilePhone, "invalid phone"],
  },
  address: {
    type: String,

    trim: true,
  },
  password: {
    type: String,
    required: [true, "user must have a password"],
    trim: true,
    select: false,
  },
  gender: {
    type: String,
    enum: ["male", "female", "LGTV"],
    required: true,
  },
  passwordChangeAt: Date,
  //role problem
  role: {
    type: String,
    enum: ["user", "support", "admin"],
    default: "user",
  },
  dob: {
    type: Date,
    required: [true, "user must have date of birth"],
  },
  imageUrl: {
    type: String,
    default: "",
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.checkPassword = async (userPassword, encryptedPassword) => {
  return await bcrypt.compare(userPassword, encryptedPassword);
};
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changeTimeStamp;
  }
};
const User = mongoose.model("User", userSchema);
module.exports = User;
