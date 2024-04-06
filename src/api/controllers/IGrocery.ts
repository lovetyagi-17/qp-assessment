import { GroceryModel } from "../../common/models";
import { statusCode } from "../../common/utils/StatusCodes";
import { GroceryService } from "../services";

export default class Grocery {
  groceryService;
  constructor() {
    this.groceryService = new GroceryService(GroceryModel);
  }
}
