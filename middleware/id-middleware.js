const ApiError = require("../exceptions/api-error");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    if (req.user.roles.includes("ADMIN")) {
      return next();
    }

    if (req.user.id !== req.params.userId) {
      throw ApiError.PermissionDeniedError();
    }

    next();
  } catch (error) {
    return next(ApiError.PermissionDeniedError());
  }
};
