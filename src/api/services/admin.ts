import { AdminsModel } from "../../common/models";

export default class AdminsService {
  constructor(private readonly adminsRepository: typeof AdminsModel) {}

  async findOne(filter: any, params: any) {
    return this.adminsRepository.findOne(filter, params);
  }
  async updateOne(filter: any, data: any) {
    return false;
  }
}
