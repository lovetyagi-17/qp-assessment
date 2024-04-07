import * as l10n from "jm-ez-l10n";

import { Products } from "../../common/database/models";
import { MODULE_NAME, REQUEST_METHOD } from "../../common/utils/Constants";
import HelperServices from "../../common/utils/Helpers";
import { statusCode } from "../../common/utils/StatusCodes";
import { ProductsService } from "../services";

export class IUsers {
  private readonly productService: ProductsService;
  private readonly helperService: HelperServices;
  constructor() {
    this.productService = new ProductsService(Products);
  }

  async login(data: any) {
    try {
      return { status: statusCode.OK, message: "success" };
    } catch (error) {
      console.error(error);
    }
  }

  async productList(data: any) {
    try {
      const itemFilter = {
        isActive: true,
        deletedAt: null,
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
      console.error(error);
    }
  }

  async productDetails(data: any) {
    try {
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
      console.error(error);
    }
  }

  async order(data: any) {
    try {
      const orderData = [];
      const attributes = {
        exclude: ["createdBy", "createdAt", "updatedAt", "deletedAt"],
      };
      for (let product of data.items) {
        const productData = await this.productService.findOne(
          { id: product.id, isActive: true, inStock: true },
          attributes
        );

        if (productData) {
          orderData.push({
            productId: productData.id,
            quantity: Math.min(product.quantity, productData.quantity),
          });
        }
      }

      return { status: 200, data: orderData };
    } catch (error) {
      console.error(error);
    }
  }
}
