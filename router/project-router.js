const Router = require("express");
const controller = require("../controllers/project-controller");
const authMiddleware = require("../middleware/auth-middleware");

const router = new Router();

router.get("/project/:id", authMiddleware, controller.getProject);

module.exports = router;
