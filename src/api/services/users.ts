import { Op } from 'sequelize';
import {
  Admin,
  Products,
  UserOrders,
  Users,
} from '../../common/database/models/index';

export default class UsersService {
  constructor(
    private readonly usersRepository: typeof Users,
    private readonly userOrdersRepository: typeof UserOrders
  ) {}

  async create(data: any) {
    return await this.userOrdersRepository.create(data);
  }

  async findOne(filter: any, attributes) {
    return await this.usersRepository
      .findOne({
        where: filter,
        attributes,
      })
      .then((user) => JSON.parse(JSON.stringify(user)));
  }

  async findAllCartOrders(
    filter: any,
    attributes?,
    options?: { page: number; limit: number }
  ) {
    let pagination: any = { order: [['createdAt', 'DESC']] };
    if (options) {
      pagination = {
        offset: options.page ? (options.page - 1) * options.limit : 0,
        limit: options.limit ? options.limit : 10,
        order: [['createdAt', 'DESC']],
      };
    }
    return await this.userOrdersRepository
      .findAndCountAll({
        where: filter,
        attributes: {
          exclude: [
            'updatedAt',
            'createdBy',
            'deletedAt',
            'userId',
            'productId',
          ],
        },
        include: [
          {
            model: Users,
            as: 'orderUser',
            attributes: ['id', 'name'],
          },
          {
            model: Products,
            as: 'orderProductInfo',
            attributes: ['id', 'name', 'description', 'price'],
          },
        ],
        ...pagination,
      })
      .then((admin) => JSON.parse(JSON.stringify(admin)));
  }

  async updateOne(filter: any, data: any) {
    return await this.userOrdersRepository.update(data, {
      where: filter,
    });
  }
}
