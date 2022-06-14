const Router = require("express");
const controller = require("../controllers/employees-controller");
const authMiddleware = require("../middleware/auth-middleware");
const roleMiddleware = require("../middleware/role-middleware");
const idMiddleware = require("../middleware/id-middleware");

const router = new Router();

router.put(
  "/employees/:id",
  [authMiddleware, roleMiddleware(["ADMIN"])],
  controller.putToEmployee
);

router.get(
  "/employees",
  [authMiddleware, roleMiddleware(["ADMIN"])],
  controller.getEmployees
);

router.get(
  "/employees/:userId",
  [authMiddleware, idMiddleware],
  controller.getEmployee
);

module.exports = router;
