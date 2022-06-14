const { Schema, model } = require("mongoose");

const EmployeeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  takenTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

module.exports = model("Employee", EmployeeSchema);
