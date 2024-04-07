import { Admin } from "../../common/database/models/index";

export default class AdminsService {
  constructor(private readonly adminsRepository: typeof Admin) {}

  async findOne(filter: any, attributes: any) {
    return this.adminsRepository.findOne({ where: filter, attributes });
  }
  async updateOne(filter: any, data: any) {
    return false;
  }
}
