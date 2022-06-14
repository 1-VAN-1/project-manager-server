const ApiError = require("../exceptions/api-error");
const TaskModel = require("../models/task-model");

class TasksService {
  async createTask({
    title,
    description,
    difficulty,
    donePercents,
    attachmentLinks,
    startTime,
    deadline,
  }) {
    const task = await TaskModel.create({
      title,
      description,
      difficulty,
      donePercents,
      attachmentLinks,
      startTime,
      deadline,
    });

    return task;
  }

  async putTask(taskId, { donePercents, isFree }) {
    let task = await TaskModel.findById(taskId);

    if (!task) {
      throw ApiError.BadRequest("Invalid task id");
    }

    task.donePercents = donePercents;
    task.isFree = isFree;

    await task.save();

    return task;
  }

  async getTasks() {
    const tasks = await TaskModel.find();
    return tasks;
  }

  async getTask(taskId) {
    const task = await TaskModel.findById(taskId);

    if (!task) {
      throw ApiError.BadRequest("Invalid task id");
    }

    return task;
  }

  async updateTasks(tasks) {
    for (const index in tasks) {
      let taskInDb = await TaskModel.findById(tasks[index]._id);

      if (!taskInDb) {
        continue;
      }

      taskInDb.isFree = tasks[index].isFree;

      await taskInDb.save();

      tasks[index] = taskInDb;
    }

    return tasks;
  }
}

module.exports = new TasksService();
