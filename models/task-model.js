const { Schema, model } = require("mongoose");

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: Number, default: 1 },
  attachments: [{ type: String }],
  donePercents: { type: Number, default: 0 },
  startTime: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  isFree: { type: Boolean, default: true },
  state: { type: String, ref: "TaskState", default: "waiting" },
  usedHours: { type: Number, default: 0 },
});

module.exports = model("Task", TaskSchema);
