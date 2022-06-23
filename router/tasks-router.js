const Router = require("express");
const controller = require("../controllers/tasks-controller");
const authMiddleware = require("../middleware/auth-middleware");
const roleMiddleware = require("../middleware/role-middleware");
const formidableMiddleware = require("express-formidable");
const moment = require("moment");
const fileService = require("../service/file-service");

const router = new Router();

const fileMiddleware = formidableMiddleware(
  {
    multiples: true,
  },
  [
    {
      event: "fileBegin",
      action: function (req, res, next, name, file) {
        const date = moment().format("DDMMYYYY-HHmmss_SSS");
        file.name = `${date}-${file.name}`;
        file.path = fileService.uploadDirectory + file.name;
      },
    },
  ]
);

router.post(
  "/tasks",
  [authMiddleware, roleMiddleware(["ADMIN"]), fileMiddleware],
  controller.createTask
);

router.put("/tasks/:id", [authMiddleware, fileMiddleware], controller.putTask);
router.patch("/tasks/:id", authMiddleware, controller.patchTask);

router.get(
  "/tasks",
  [authMiddleware, roleMiddleware(["ADMIN"])],
  controller.getTasks
);

router.get("/tasks/:id", authMiddleware, controller.getTask);
router.delete(
  "/tasks/:id",
  [authMiddleware, roleMiddleware(["ADMIN"])],
  controller.deleteTask
);

module.exports = router;
