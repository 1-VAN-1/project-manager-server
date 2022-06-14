const authRouter = require("./auth-router");
const tasksRouter = require("./tasks-router");
const employeesRouter = require("./employees-router");

module.exports = [authRouter, tasksRouter, employeesRouter];
