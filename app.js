const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const AppError = require("./utils/appError");

const globalErrHandler = require("./controller/errorController");

dotenv.config({ path: "./config.env" });
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`acan't find ${req.originalUrl} on this server`));
});
app.use(globalErrHandler);
module.exports = app;
