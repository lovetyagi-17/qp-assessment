import * as l10n from "jm-ez-l10n";

import { MODULE_NAME, REQUEST_METHOD } from "../../common/utils/Constants";
import HelperServices from "../../common/utils/Helpers";
import { statusCode } from "../../common/utils/StatusCodes";
import GroceryService from "../services/grocery";
import { Grocery } from "../../common/database/models";

export class IGrocery {
  private readonly groceryService: GroceryService;
  private readonly helperService: HelperServices;
  constructor() {
    this.groceryService = new GroceryService(Grocery);
    this.helperService = new HelperServices();
  }

  async createGrocery(data: any) {
    try {
      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.ADMIN,
          method: REQUEST_METHOD.LOGIN,
        }),
        data: data,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async getGroceryList(data: any) {
    try {
      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.ADMIN,
          method: REQUEST_METHOD.LOGIN,
        }),
        data: data,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async groceryDetails(data: any) {
    try {
      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.ADMIN,
          method: REQUEST_METHOD.LOGIN,
        }),
        data: data,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async updateGrocery(data: any) {
    try {
      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.ADMIN,
          method: REQUEST_METHOD.LOGIN,
        }),
        data: data,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async removeGrocery(data: any) {
    try {
      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.ADMIN,
          method: REQUEST_METHOD.LOGIN,
        }),
        data: data,
      };
    } catch (error) {
      console.error(error);
    }
  }
}
