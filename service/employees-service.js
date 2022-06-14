const EmployeeModel = require("../models/employee-model");
const tasksService = require("./tasks-service");
const ApiError = require("../exceptions/api-error");

class EmployeesService {
  async putToEmployee(employeeId, { takenTasks }) {
    const employee = await EmployeeModel.findById(employeeId);

    if (!employee) {
      throw ApiError.BadRequest("Invalid employee id");
    }

    let newTasks = await tasksService.updateTasks(takenTasks);

    const tasksIdOnly = newTasks.map((task) => task._id);

    employee.takenTasks = tasksIdOnly;

    await employee.save();
  }

  async getEmployees() {
    const employees = await EmployeeModel.find();
    return employees;
  }

  async getEmployee(userId) {
    const employee = await EmployeeModel.findOne({ user: userId });
    return employee;
  }

  async createEmployee(userId) {
    const employee = await EmployeeModel.create({ user: userId });
    return employee;
  }
}

module.exports = new EmployeesService();
