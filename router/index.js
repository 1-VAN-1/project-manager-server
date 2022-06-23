const authRouter = require("./auth-router");
const tasksRouter = require("./tasks-router");
const employeesRouter = require("./employees-router");
const projectRouter = require("./project-router");

module.exports = [authRouter, tasksRouter, employeesRouter, projectRouter];
