module.exports = class UserDto {
  id;
  email;
  roles;
  isActivated;

  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.roles = model.roles;
    this.isActivated = model.isActivated;
  }
};
