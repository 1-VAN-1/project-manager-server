module.exports = class EmployeeDto {
  id;
  name;
  surname;
  skills;
  takenTasks;

  constructor(id, name, surname, skills, takenTasks) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.skills = skills;
    this.takenTasks = takenTasks;
  }
};
