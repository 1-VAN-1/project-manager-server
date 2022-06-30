const ApiError = require("../exceptions/api-error");
const TaskModel = require("../models/task-model");
const TaskStateModel = require("../models/task-state-model");
const ProjectModel = require("../models/project-model");
const mongoose = require("mongoose");
const fs = require("fs");
const fileService = require("./file-service");

class TasksService {
  async createTask(
    projectId,
    {
      title,
      description,
      difficulty,
      donePercents,
      startTime,
      deadline,
      state,
      isFree,
    },
    files
  ) {
    let attachments = [];

    if (files.files) {
      if (Array.isArray(files.files)) {
        attachments = files.files.map((file) => file.name);
      } else {
        attachments = [files.files.name];
      }
    }

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw ApiError.BadRequest("Invalid project id");
    }

    if (state) {
      if (!(await TaskStateModel.findOne({ value: state }))) {
        throw ApiError.BadRequest(`Task state "${state} isn't valid"`);
      }
    } else {
      state = new TaskStateModel().value;
    }

    isFree = isFree === "true";

    const task = await TaskModel.create({
      title,
      description,
      difficulty,
      donePercents,
      attachments,
      startTime,
      deadline,
      state,
      isFree,
    });

    project.tasks.push(task._id);
    await project.save();

    return task;
  }

  async putTask(
    taskId,
    {
      donePercents,
      isFree,
      taskState,
      title,
      description,
      difficulty,
      deadline,
      usedHours,
    },
    files
  ) {
    let task = await TaskModel.findById(taskId);

    if (!task) {
      throw ApiError.BadRequest("Invalid task id");
    }

    for (const index in task.attachments) {
      fileService.deleteFileFromUploads(task.attachments[index]);
    }

    let attachments = [];

    if (files.files) {
      if (Array.isArray(files.files)) {
        attachments = files.files.map((file) => file.name);
      } else {
        attachments = [files.files.name];
      }
    }

    task.donePercents = donePercents;
    task.isFree = isFree;
    task.taskState = taskState;
    task.attachments = attachments;
    task.title = title;
    task.description = description;
    task.difficulty = difficulty;
    task.deadline = deadline;
    task.usedHours = usedHours;

    await task.save();

    return task;
  }

  async patchTask(taskId, { donePercents, state, isFree, usedHours }) {
    let task = await TaskModel.findById(taskId);

    if (!task) {
      throw ApiError.BadRequest("Invalid task id");
    }

    if (state) {
      if (!(await TaskStateModel.findOne({ value: state }))) {
        throw ApiError.BadRequest(`Task state "${state} isn't valid"`);
      }
    }

    task.donePercents = donePercents ?? task.donePercents;
    task.isFree = isFree ?? task.isFree;
    task.state = state ?? task.state;
    task.usedHours = usedHours ?? task.usedHours;

    await task.save();

    return task;
  }

  async getTasks(projectId) {
    const project = await ProjectModel.findById(projectId);

    return project.tasks;
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

      await taskInDb.updateOne({ isFree: tasks[index].isFree });

      tasks[index] = taskInDb;
    }

    return tasks;
  }

  async deleteTask(taskId, projectId) {
    const task = await TaskModel.findById(taskId);

    for (const index in task.attachments) {
      fileService.deleteFileFromUploads(task.attachments[index]);
    }

    await task.remove();

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw ApiError.BadRequest("Invalid project id");
    }

    project.tasks = project.tasks.filter((task) => task != taskId);

    await project.save();
  }
}

module.exports = new TasksService();
