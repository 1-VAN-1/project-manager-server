const Router = require("express");
const controller = require("../controllers/user-controller");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth-middleware");
const idMiddleware = require("../middleware/id-middleware");
const roleMiddleware = require("../middleware/role-middleware");

const router = new Router();

router.post(
  "/auth/registration",
  [
    body("email", "Invalid email").isEmail(),
    body(
      "password",
      "Password must contain at least 6 characters and no more than 32 characters"
    ).isLength({
      min: 6,
      max: 32,
    }),
  ],
  controller.registration
);
router.post("/auth/login", controller.login);
router.post("/logout", controller.logout);

router.get("/activate/:link", controller.activate);
router.get("/refresh", controller.refresh);
router.get("/user/:id", authMiddleware, controller.getUser);

module.exports = router;
