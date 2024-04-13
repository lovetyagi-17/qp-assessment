import { Admin } from '../../common/database/models/index';

export default class AdminsService {
  constructor(private readonly adminsRepository: typeof Admin) {}

  async findOne(filter: any, attributes) {
    return await this.adminsRepository
      .findOne({
        where: filter,
        attributes,
      })
      .then((admin) => JSON.parse(JSON.stringify(admin)));
  }

  async updateOne(filter: any, data: any) {
    return await this.adminsRepository.update(data, {
      where: filter,
      returning: true,
    });
  }
}
