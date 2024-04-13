import { Admin, Products } from '../../common/database/models/index';

export default class ProductsService {
  constructor(private readonly productsRepository: typeof Products) {}

  async create(data: any) {
    return await this.productsRepository.create(data);
  }

  async findOne(filter: any, attributes) {
    return await this.productsRepository
      .findOne({
        where: filter,
        attributes,
      })
      .then((admin) => JSON.parse(JSON.stringify(admin)));
  }

  async findOneInDetail(filter: any) {
    return await this.productsRepository
      .findOne({
        where: filter,
        attributes: { exclude: ['updatedAt', 'createdBy', 'description'] },
        include: [
          {
            model: Admin,
            as: 'createdByAdmin',
            attributes: ['id', 'name'],
          },
        ],
      })
      .then((admin) => JSON.parse(JSON.stringify(admin)));
  }

  async findAll(filter: any, options: { page: number; limit: number }) {
    return await this.productsRepository
      .findAndCountAll({
        where: filter,
        attributes: { exclude: ['updatedAt', 'createdBy', 'description'] },
        include: [
          {
            model: Admin,
            as: 'createdByAdmin',
            attributes: ['id', 'name'],
          },
        ],

        offset: options.page ? (options.page - 1) * options.limit : 0,
        limit: options.limit ? options.limit : 10,
        order: [['createdAt', 'DESC']],
      })
      .then((admin) => JSON.parse(JSON.stringify(admin)));
  }

  async updateOne(filter: any, data: any) {
    return await this.productsRepository.update(data, {
      where: filter,
    });
  }

  // we can use this also, prefer soft delete
  async deleteOne(filter: any) {
    return await this.productsRepository.destroy({
      where: filter,
      // force: true,
    });
  }
}
