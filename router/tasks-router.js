const Router = require("express");
const controller = require("../controllers/tasks-controller");
const authMiddleware = require("../middleware/auth-middleware");
const roleMiddleware = require("../middleware/role-middleware");

const router = new Router();

router.post(
  "/tasks",
  [authMiddleware, roleMiddleware(["ADMIN"])],
  controller.createTask
);

router.put("/tasks/:id", authMiddleware, controller.putTask);

router.get(
  "/tasks",
  [authMiddleware, roleMiddleware(["ADMIN"])],
  controller.getTasks
);

router.get("/tasks/:id", authMiddleware, controller.getTask);

module.exports = router;
