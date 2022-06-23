const ApiError = require("../exceptions/api-error");
const ProjectModel = require("../models/project-model");
const UserModel = require("../models/user-model");

class ProjectController {
  async getProject(req, res, next) {
    try {
      const project = await ProjectModel.findById(req.params.id);

      if (!project) {
        throw ApiError.BadRequest(`Invalid project id ${project}`);
      }

      const director = await UserModel.findById(project.director);

      const userInfo = {
        email: director.email,
        name: director.name,
        surname: director.surname,
        skills: director.skills,
      };

      return res.json({
        director: userInfo,
        tasks: project.tasks,
        employees: project.employees,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
