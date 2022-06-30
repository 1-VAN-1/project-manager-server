const EmployeeModel = require("../models/employee-model");
const ProjectModel = require("../models/project-model");
const UserModel = require("../models/user-model");
const tasksService = require("./tasks-service");
const ApiError = require("../exceptions/api-error");

class EmployeesService {
  async putToEmployee(userId, employeeId, { takenTasks }) {
    const employee = await EmployeeModel.findById(employeeId);

    if (!employee) {
      throw ApiError.BadRequest("Invalid employee id");
    }

    const user = await UserModel.findById(userId);

    if (employee.user != userId && !user.roles.includes("ADMIN")) {
      throw ApiError.PermissionDeniedError();
    }

    let newTasks = await tasksService.updateTasks(takenTasks);

    const tasksIdOnly = newTasks.map((task) => task._id);

    await employee.updateOne({ takenTasks: tasksIdOnly });
  }

  async getEmployees(projectId) {
    const project = await ProjectModel.findById(projectId);

    return project.employees;
  }

  async getEmployee(userId) {
    const employee = await EmployeeModel.findOne({ user: userId });
    return employee;
  }

  async createEmployee(userId, projectId) {
    const employee = await EmployeeModel.create({ user: userId });

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw ApiError.BadRequest("Invalid project id");
    }

    project.employees.push(employee._id);
    await project.save();

    return employee;
  }
}

module.exports = new EmployeesService();
