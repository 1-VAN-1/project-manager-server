module.exports = class TaskDto {
  _id;
  title;
  description;
  difficulty;
  attachments;
  donePercents;
  startTime;
  deadline;
  isFree;
  taskState;

  constructor(taskModel) {
    this._id = taskModel._id;
    this.title = taskModel.title;
    this.description = taskModel.description;
    this.difficulty = taskModel.difficulty;
    this.attachments = taskModel.attachments;
    this.donePercents = taskModel.donePercents;
    this.startTime = taskModel.startTime;
    this.deadline = taskModel.deadline;
    this.isFree = taskModel.isFree;
    this.taskState = taskModel.taskState;
  }
};
