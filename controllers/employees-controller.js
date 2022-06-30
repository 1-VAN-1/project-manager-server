const service = require("../service/employees-service");
const EmployeeDto = require("../dtos/employee-dto");

const convertToDto = async (employeeId) => {
  const UserModel = require("../models/user-model");
  const TaskModel = require("../models/task-model");
  const EmployeeModel = require("../models/employee-model");

  const employeeModel = await EmployeeModel.findById(employeeId);

  const user = await UserModel.findById(employeeModel.user);
  if (!user) {
    return null;
  }

  let tasks = [];

  for (const index in employeeModel.takenTasks) {
    const task = await TaskModel.findById(employeeModel.takenTasks[index]);
    tasks.push(task);
  }

  return new EmployeeDto(
    employeeModel._id,
    user.name,
    user.surname,
    user.skills,
    tasks,
    employeeModel.user
  );
};

class EmployeesController {
  async putToEmployee(req, res, next) {
    try {
      const employeeId = req.params.id;

      await service.putToEmployee(req.user.id, employeeId, req.body);

      return res.end();
    } catch (error) {
      next(error);
    }
  }

  async getEmployees(req, res, next) {
    try {
      const employees = await service.getEmployees(req.user.project);

      const dto = [];

      for (const index in employees) {
        const converted = await convertToDto(employees[index]);
        dto.push(converted);
      }

      return res.json({ employees: dto });
    } catch (error) {
      next(error);
    }
  }

  async getEmployee(req, res, next) {
    try {
      const employee = await service.getEmployee(req.params.userId);

      const dto = await convertToDto(employee);

      return res.json({ employee: dto });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeesController();
