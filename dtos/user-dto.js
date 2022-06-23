module.exports = class UserDto {
  id;
  project;
  roles;
  isActivated;

  constructor(model) {
    this.id = model._id;
    this.project = model.project._id;
    this.roles = model.roles;
    this.isActivated = model.isActivated;
  }
};
