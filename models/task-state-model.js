const { Schema, model } = require("mongoose");

const TaskStateSchema = new Schema({
  value: { type: String, unique: true, required: true, default: "waiting" },
});

module.exports = model("TaskState", TaskStateSchema);
