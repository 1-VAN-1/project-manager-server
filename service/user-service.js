const UserModel = require("../models/user-model");
const RoleModel = require("../models/role-model");
const ProjectModel = require("../models/project-model");
const bcrypt = require("bcryptjs");
const { v4 } = require("uuid");
const mailService = require("../service/mail-service");
const tokenService = require("../service/token-service");
const employeesService = require("./employees-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async registration({
    email,
    password,
    role,
    name,
    surname,
    skills,
    inviteCode,
  }) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(
        `User with email ${email} is already registered`
      );
    }

    let project = null;

    if (role === "USER" && inviteCode) {
      project = await ProjectModel.findById(inviteCode);
    }

    if (!project) {
      throw ApiError.BadRequest(`Invite code ${inviteCode} doesn't exist`);
    }

    const hashPassword = bcrypt.hashSync(password, 5);
    const userRole = new RoleModel({ value: role });
    const activationLink = v4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      name,
      surname,
      roles: [userRole.value],
      skills,
      activationLink,
      project,
    });

    if (role === "ADMIN") {
      project = await ProjectModel.create({ director: user._id });
    }

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login({ email, password }) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest(`User ${email} doesn't exist`);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      throw ApiError.BadRequest("Wrong password");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    await tokenService.removeToken(refreshToken);
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Invalid activation link");
    }

    if (user.isActivated) {
      return;
    }

    user.isActivated = true;
    await user.save();

    if (user.roles.includes("USER")) {
      await employeesService.createEmployee(user._id, user.project);
    }
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getUser(userId) {
    const user = await UserModel.findById(userId);
    return user;
  }
}

module.exports = new UserService();
