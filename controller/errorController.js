const AppError = require("../utils/appError");

const handleJWTError = (err) => new AppError("Invalid token", 401);
const expriedTokenHandler = (err) =>
  new AppError("Token has been expried try login again", 401);
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.name === "JsonWebTokenError") {
    handleJWTError(err);
  }
  if (err.name === "TokenExpiredError") {
    expriedTokenHandler(err);
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next();
};
