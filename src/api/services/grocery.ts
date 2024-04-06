import { GroceryModel } from "../../common/models";

export default class GroceryService {
  constructor(private readonly groceryRepository: typeof GroceryModel) {}

  async findOne(filter: any, params: any) {
    return this.groceryRepository.findOne(filter, params);
  }
  async updateOne(filter: any, data: any) {
    return false;
  }
}
