module.exports = class EmployeeDto {
  id;
  user;
  name;
  surname;
  skills;
  takenTasks;

  constructor(id, name, surname, skills, takenTasks, user) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.surname = surname;
    this.skills = skills;
    this.takenTasks = takenTasks;
  }
};
