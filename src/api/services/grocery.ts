import { Grocery } from "../../common/database/models/index";

export default class GroceryService {
  constructor(private readonly groceryRepository: typeof Grocery) {}

  async findOne(filter: any, attributes) {
    return await this.groceryRepository.findOne({
      where: filter,
      attributes,
    });
  }

  async findAll(filter: any, attributes) {
    return await this.groceryRepository.findOne({
      where: filter,
      attributes,
    });
  }

  async updateOne(filter: any, data: any) {
    return await this.groceryRepository.update(data, {
      where: filter,
      returning: true,
    });
  }

  // we can use this also, prefer soft delete
  async deleteOne(filter: any) {
    return await this.groceryRepository.destroy({
      where: filter,
      // force: true,
    });
  }
}
