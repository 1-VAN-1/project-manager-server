const Router = require("express");
const controller = require("../controllers/tasks-controller");
const authMiddleware = require("../middleware/auth-middleware");
const roleMiddleware = require("../middleware/role-middleware");
const formidableMiddleware = require("express-formidable");
const moment = require("moment");

const router = new Router();

router.post(
  "/tasks",
  [
    authMiddleware,
    roleMiddleware(["ADMIN"]),
    formidableMiddleware(
      {
        multiples: true,
      },
      [
        {
          event: "fileBegin",
          action: function (req, res, next, name, file) {
            const date = moment().format("DDMMYYYY-HHmmss_SSS");
            file.name = `${date}-${file.name}`;
            file.path = __dirname + `/../static/uploads/${file.name}`;
          },
        },
      ]
    ),
  ],
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
