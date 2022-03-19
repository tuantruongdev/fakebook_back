const jwt = require("jsonwebtoken");
const util = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id, name, lastName) => {
  return jwt.sign(
    { id: id, firstName: name, lastName: lastName },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPRIE,
    }
  );
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,

    password: req.body.password,
    dob: req.body.dob,
    gender: req.body.gender,
    address: req.body.address,
    phoneNum: req.body.phoneNum,
  });
  const token = signToken(newUser._id, newUser.firstName, newUser.lastName);

  delete newUser.password;
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;
  //if no email or passsword then throw a error
  if (!userName || !password) {
    return next(new AppError("please include username and password!"), 400);
  }
  // query a user and select password, +password to show a hidden default properties
  const user = await User.findOne({
    $or: [{ email: userName }, { phoneNum: userName }],
  }).select("+password");
  //checkPassword defined at the schema
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("username or password is incorrect"), 401);
  }

  const token = signToken(user._id, user.firstName, user.lastName);

  res.status(201).json({
    status: "success",
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  //get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("you're not logged in!"), 401);
  }
  //verify token
  // console.log(token);
  //convert callback to await
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  //basicly done here
  //check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("user not exist anymore", 401));
  }

  //check if user change password
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError("password changed recently", 401));
  }

  req.user = freshUser;
  next();
});
exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you dont have permission", 403));
    }
    next();
  };
};
