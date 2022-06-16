const service = require("../service/tasks-service");

class TasksController {
  async createTask(req, res, next) {
    try {
      const task = await service.createTask(req.fields, req.files);

      return res.status(201).json({ task });
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req, res, next) {
    try {
      const tasks = await service.getTasks();

      return res.json({ tasks });
    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    try {
      const task = await service.getTask();

      return res.json({ task });
    } catch (error) {
      next(error);
    }
  }

  async putTask(req, res, next) {
    try {
      await service.putTask(req.params.id, req.body);

      return res.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TasksController();
