const service = require("../service/tasks-service");
const TaskDto = require("../dtos/task-dto");

const convertToDto = async (taskId) => {
  const TaskModel = require("../models/task-model");
  const taskModel = await TaskModel.findById(taskId);

  return new TaskDto(taskModel);
};

class TasksController {
  async createTask(req, res, next) {
    try {
      const task = await service.createTask(
        req.user.project,
        req.fields,
        req.files
      );

      return res.status(201).json({ task });
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req, res, next) {
    try {
      const tasks = await service.getTasks(req.user.project);

      const dto = [];

      for (const index in tasks) {
        const converted = await convertToDto(tasks[index]);
        dto.push(converted);
      }

      return res.json({ tasks: dto });
    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    try {
      const task = await service.getTask(req.params.id);

      return res.json({ task });
    } catch (error) {
      next(error);
    }
  }

  async putTask(req, res, next) {
    try {
      const task = await service.putTask(req.params.id, req.fields, req.files);

      return res.json({ task });
    } catch (error) {
      next(error);
    }
  }

  async patchTask(req, res, next) {
    try {
      const task = await service.patchTask(req.params.id, req.body);

      return res.json({ task });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      await service.deleteTask(req.params.id, req.user.project);

      return res.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TasksController();
