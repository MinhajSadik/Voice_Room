import UserModel from "../models/user.model.js";

class UserService {
  async findUser(filter) {
    const user = await UserModel.findOne(filter);

    return user;
  }

  async createUser(payload) {
    const user = await UserModel.create(payload);

    return user;
  }
}

export default new UserService();
