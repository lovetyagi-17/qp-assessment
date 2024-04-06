import { AdminsModel } from "../../common/models";
import { statusCode } from "../../common/utils/StatusCodes";
import { AdminsService } from "../services";

export default class Admins {
  adminService;
  constructor() {
    this.adminService = new AdminsService(AdminsModel);
  }

  async login(data: any) {
    try {
      return { status: statusCode.OK, message: "success" };
    } catch (error) {
      console.error(error);
    }
  }

  async logout(data: any) {
    try {
    } catch (error) {
      console.error(error);
    }
  }
}
