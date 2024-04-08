import * as l10n from "jm-ez-l10n";
import Container from "typedi";

import { MODULE_NAME, REQUEST_METHOD } from "../../common/utils/Constants";
import HelperServices from "../../common/utils/Helpers";
import { statusCode } from "../../common/utils/StatusCodes";
import { Admin, Products } from "../../common/database/models";
import { AdminsService, ProductsService } from "../services";

export class IProducts {
  private readonly productService: ProductsService;
  private readonly helperService: HelperServices;
  private readonly adminService: AdminsService;
  constructor() {
    this.productService = new ProductsService(Products);
    this.adminService = new AdminsService(Admin);
    this.helperService = new HelperServices();
  }

  async createProduct(data: any) {
    try {
      const token: { id: string; name: string } = Container.get("auth-token");

      const filter = { id: token.id };
      const attributes = ["id", "isActive", "deletedAt", "createdAt"];

      const admin: any = await this.adminService.findOne(filter, attributes);
      if (!admin || !admin.isActive || admin.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.ADMIN,
          }),
        };
      }

      if (admin) {
        data.id = `item_${this.helperService.generateUid()}`;
        data.createdBy = admin.id;
      }
      await this.productService.create(data);

      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.PRODUCT,
          method: REQUEST_METHOD.POST,
        }),
        data: { id: data.id },
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t("SOMETHING_WENT_WRONG"),
      };
    }
  }

  async getProductList(data: any) {
    try {
      const token: { id: string; name: string } = Container.get("auth-token");

      const filter = { id: token.id };
      const attributes = ["id", "isActive", "deletedAt", "createdAt"];

      const admin = await this.adminService.findOne(filter, attributes);
      if (!admin || !admin.isActive || admin.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.ADMIN,
          }),
        };
      }

      const itemFilter = {
        isActive: true,
        deletedAt: null,
        createdBy: admin.id,
      };

      const products = await this.productService.findAll(itemFilter, {
        page: +data.page,
        limit: +data.limit,
      });

      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.PRODUCT,
          method: REQUEST_METHOD.GET,
        }),
        data: {
          count: products.count,
          data: products.rows ? products.rows : [],
        },
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t("SOMETHING_WENT_WRONG"),
      };
    }
  }

  async productDetails(data: any) {
    try {
      const token: { id: string; name: string } = Container.get("auth-token");

      const filter = { id: token.id };
      const attributes = ["id", "isActive", "deletedAt", "createdAt"];

      const admin = await this.adminService.findOne(filter, attributes);
      if (!admin || !admin.isActive || admin.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.ADMIN,
          }),
        };
      }

      const productFilter = { id: data.id, isActive: true, deletedAt: null };
      const product = await this.productService.findOneInDetail(productFilter);

      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: `${MODULE_NAME.PRODUCT} details`,
          method: REQUEST_METHOD.GET,
        }),
        data: product,
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t("SOMETHING_WENT_WRONG"),
      };
    }
  }

  async updateProduct(data: any) {
    try {
      const token: { id: string; name: string } = Container.get("auth-token");

      const filter = { id: token.id };
      const attributes = ["id", "isActive", "deletedAt", "createdAt"];

      const admin = await this.adminService.findOne(filter, attributes);
      if (!admin || !admin.isActive || admin.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.ADMIN,
          }),
        };
      }

      const productFilter = { id: data.id, isActive: true, deletedAt: null };
      const productAttributes = ["id", "name", "isActive", "deletedAt"];

      const product = await this.productService.findOne(
        productFilter,
        productAttributes
      );
      if (!product || !product.isActive || product.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.PRODUCT,
          }),
        };
      }

      let dataToUpdate = data;

      // if quantity is set to 0, so updating product as out of stock
      if ("quantity" in data && data.quantity == 0) {
        "inStock" in data && data.inStock
          ? (dataToUpdate.inStock = true)
          : (dataToUpdate.inStock = false);
      }

      await this.productService.updateOne(productFilter, dataToUpdate);

      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.PRODUCT,
          method: REQUEST_METHOD.PUT,
        }),
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t("SOMETHING_WENT_WRONG"),
      };
    }
  }

  async removeProduct(data: any) {
    try {
      const token: { id: string; name: string } = Container.get("auth-token");

      const filter = { id: token.id };
      const attributes = ["id", "isActive", "deletedAt", "createdAt"];

      const admin = await this.adminService.findOne(filter, attributes);
      if (!admin || !admin.isActive || admin.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.ADMIN,
          }),
        };
      }

      const productFilter = { id: data.id, isActive: true, deletedAt: null };
      const productAttributes = ["id", "name", "isActive", "deletedAt"];

      const product = await this.productService.findOne(
        productFilter,
        productAttributes
      );
      if (!product || !product.isActive || product.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t("NOT_EXISTS", {
            key: MODULE_NAME.PRODUCT,
          }),
        };
      }

      /*
        `deleteOne`:  method for permanent delete,
         soft delete using update method
      */
      await this.productService.updateOne(productFilter, {
        isActive: false,
        deletedAt: new Date(),
      });

      return {
        status: statusCode.OK,
        message: l10n.t("COMMON_SUCCESS_MESSAGE", {
          key: MODULE_NAME.PRODUCT,
          method: REQUEST_METHOD.DELETE,
        }),
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t("SOMETHING_WENT_WRONG"),
      };
    }
  }
}
