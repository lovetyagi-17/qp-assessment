import { UsersModel } from "../../common/models";

export default class UserService {
  constructor(private readonly usersRepository: typeof UsersModel) {}

  async findOne(filter: any, params: any) {
    return this.usersRepository.findOne(filter, params);
  }
  async updateOne(filter: any, data: any) {
    return false;
  }
}
