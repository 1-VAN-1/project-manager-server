const ApiError = require("../exceptions/api-error");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const { roles: userRoles } = req.user;

      let hasRole = false;

      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return next(ApiError.PermissionDeniedError());
      }

      next();
    } catch (error) {
      return next(ApiError.PermissionDeniedError());
    }
  };
};
