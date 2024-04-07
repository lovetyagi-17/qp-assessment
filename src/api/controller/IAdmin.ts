import { statusCode } from "../../common/utils/StatusCodes";
import { AdminsService } from "../services";

export class Admins {
  adminService;
  constructor() {
    // this.adminService = new AdminsService();
  }

  static async login(data: any) {
    try {
      return { status: statusCode.OK, message: "success", data: data };
    } catch (error) {
      console.error(error);
    }
  }

  static async logout(data: any) {
    try {
      return { status: statusCode.OK, message: "success", data: data };
    } catch (error) {
      console.error(error);
    }
  }
}
