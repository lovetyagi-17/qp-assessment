import * as l10n from "jm-ez-l10n";
import { Container } from "typedi";

import { Admin } from "../../common/database/models";
import { setEncrypt } from "../../common/database/models/admin";
import { MODULE_NAME, REQUEST_METHOD } from "../../common/utils/Constants";
import HelperServices from "../../common/utils/Helpers";
import { statusCode } from "../../common/utils/StatusCodes";
import { AdminsService } from "../services";
import { addToInvalidatedTokens } from "../middleware/tokenManager";

export class Admins {
  private readonly adminService: AdminsService;
  private readonly helperService: HelperServices;
  constructor() {
    this.adminService = new AdminsService(Admin);
    this.helperService = new HelperServices();
  }

  async login(data: any) {
    try {
      const filter = {
        email: setEncrypt(data.email).toLowerCase(),
        isActive: true,
      };

      const attributes = [
        "name",
        "email",
        "password",
        "id",
        "isActive",
        "deletedAt",
        "createdAt",
      ];

      const admin: any = await this.adminService.findOne(filter, attributes);
      if (!admin || !admin.isActive || admin.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.ADMIN,
          }),
        };
      }

      const checkPassword = await this.helperService.verifyPassword(
        data.password,
        admin.password
      );

      const tokenData = {
        id: admin.id,
        name: admin.name,
      };

      const token = this.helperService.generateToken(tokenData);

      delete admin.password;

      if (!checkPassword) {
        return {
          status: statusCode.BAD_REQUEST,
          message: l10n.t("INVALID_CREDENTIALS"),
        };
      }

      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.ADMIN,
          method: REQUEST_METHOD.LOGIN,
        }),
        data: { admin, token },
      };
    } catch (error) {
      console.error(error);
    }
  }

  async profile() {
    try {
      const token: { id: string; name: string } = Container.get("auth-token");

      const filter = { id: token.id };
      const attributes = [
        "name",
        "email",
        "id",
        "isActive",
        "deletedAt",
        "createdAt",
      ];
      const admin: any = await this.adminService.findOne(filter, attributes);
      if (!admin || !admin.isActive || admin.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.ADMIN,
          }),
        };
      }
      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: `${MODULE_NAME.ADMIN} ${this.helperService.toLowerCase(
            MODULE_NAME.PROFILE
          )}`,
          method: REQUEST_METHOD.GET,
        }),
        data: admin,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async logout() {
    try {
      const token: { id: string; name: string } = Container.get("auth-token");
      const authString = Container.get("token-string");

      const filter = { id: token.id };
      const attributes = [
        "name",
        "email",
        "id",
        "isActive",
        "deletedAt",
        "createdAt",
      ];

      const admin: any = await this.adminService.findOne(filter, attributes);
      if (!admin || !admin.isActive || admin.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.ADMIN,
          }),
        };
      }

      addToInvalidatedTokens(authString);
      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.ADMIN,
          method: REQUEST_METHOD.LOGOUT,
        }),
      };
    } catch (error) {
      console.error(error);
    }
  }
}
