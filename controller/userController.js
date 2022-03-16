const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users: users },
  });
});
exports.addNewUser = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "this function on develop",
  });
};
exports.getUser = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "this function on develop",
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "this function on develop",
  });
};
exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "this function on develop",
  });
};
