const { Schema, model } = require("mongoose");

const ProjectSchema = new Schema({
  director: { type: Schema.Types.ObjectId, ref: "User" },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  employees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
});

module.exports = model("Project", ProjectSchema);
