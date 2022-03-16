const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const userRoute = express.Router();
userRoute.route("/signup").post(authController.signup);
userRoute.route("/login").post(authController.login);
userRoute
  .route("/")
  .get(userController.getAllUser)
  .post(userController.addNewUser);
userRoute
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRoute;
