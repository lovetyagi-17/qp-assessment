import * as l10n from 'jm-ez-l10n';
import Container from 'typedi';

import { Products, UserOrders, Users } from '../../common/database/models';
import { setEncrypt } from '../../common/database/models/user';
import { MODULE_NAME, REQUEST_METHOD } from '../../common/utils/Constants';
import HelperServices from '../../common/utils/Helpers';
import { statusCode } from '../../common/utils/StatusCodes';
import { ProductsService } from '../services';
import UsersService from '../services/users';
import { Op } from 'sequelize';

export class IUsers {
  private readonly productsService: ProductsService;
  private readonly helperService: HelperServices;
  private readonly usersService: UsersService;

  constructor() {
    this.productsService = new ProductsService(Products);
    this.usersService = new UsersService(Users, UserOrders);
    this.helperService = new HelperServices();
  }

  async login(data: any) {
    try {
      const filter = {
        email: setEncrypt(data.email).toLowerCase(),
        isActive: true,
      };

      const attributes = [
        'name',
        'email',
        'password',
        'id',
        'isActive',
        'deletedAt',
        'createdAt',
      ];

      const user = await this.usersService.findOne(filter, attributes);
      if (!user || !user.isActive || user.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t('NOT_EXISTS', {
            key: MODULE_NAME.USER,
          }),
        };
      }

      const checkPassword = await this.helperService.verifyPassword(
        data.password,
        user.password
      );

      const tokenData = {
        id: user.id,
        name: user.name,
      };

      const token = this.helperService.generateToken(tokenData);

      delete user.password;

      if (!checkPassword) {
        return {
          status: statusCode.BAD_REQUEST,
          message: l10n.t('INVALID_CREDENTIALS'),
        };
      }

      return {
        status: statusCode.OK,
        message: l10n.t('COMMON_SUCCESS_MESSAGE', {
          key: MODULE_NAME.USER,
          method: REQUEST_METHOD.LOGIN,
        }),
        data: { user, token },
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      };
    }
  }

  async productList(data: any) {
    try {
      const itemFilter = {
        isActive: true,
        deletedAt: null,
      };

      const products = await this.productsService.findAll(itemFilter, {
        page: +data.page,
        limit: +data.limit,
      });

      return {
        status: statusCode.OK,
        message: l10n.t('COMMON_SUCCESS_MESSAGE', {
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
        message: l10n.t('SOMETHING_WENT_WRONG'),
      };
    }
  }

  async productDetails(data: any) {
    try {
      const productFilter = { id: data.id, isActive: true, deletedAt: null };
      const product = await this.productsService.findOneInDetail(productFilter);

      return {
        status: statusCode.OK,
        message: l10n.t('COMMON_SUCCESS_MESSAGE', {
          key: `${MODULE_NAME.PRODUCT} details`,
          method: REQUEST_METHOD.GET,
        }),
        data: product,
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      };
    }
  }

  async addToCart(data: any) {
    try {
      const token: { id: string; name: string } = Container.get('auth-token');

      const userFilter = { id: token.id };
      const userAttributes = [
        'name',
        'email',
        'id',
        'isActive',
        'deletedAt',
        'createdAt',
      ];
      const user = await this.usersService.findOne(userFilter, userAttributes);
      if (!user || !user.isActive || user.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t('NOT_EXISTS', {
            key: MODULE_NAME.USER,
          }),
        };
      }
      const attributes = {
        exclude: ['createdBy', 'createdAt', 'updatedAt', 'deletedAt'],
      };
      for (let product of data.items) {
        const productData = await this.productsService.findOne(
          { id: product.id, isActive: true, inStock: true },
          attributes
        );

        if (productData) {
          const quantityToOrder = Math.min(
            product.quantity,
            productData.quantity
          );
          const totalPrice = quantityToOrder * productData.price;

          const userOrder = await this.usersService.create({
            id: `userOrder_${this.helperService.generateUid()}`,
            userId: user.id,
            productId: productData.id,
            quantity: quantityToOrder,
            price: totalPrice,
          });

          // to upadte quantity in products
          if (userOrder) {
            const newQuantity = productData.quantity - quantityToOrder;
            let dataToUpdate: { quantity: number; inStock?: boolean } = {
              quantity: newQuantity,
            };
            if (newQuantity == 0) {
              dataToUpdate.inStock = false;
            }
            this.productsService.updateOne(
              { id: productData.id },
              dataToUpdate
            );
          }
        }
      }

      return {
        status: statusCode.OK,
        message: l10n.t('COMMON_SUCCESS_MESSAGE', {
          key: MODULE_NAME.PRODUCT,
          method: `${this.helperService.toLowerCase(
            REQUEST_METHOD.POST
          )} to ${this.helperService.toLowerCase(MODULE_NAME.CART)}`,
        }),
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      };
    }
  }

  async cartList(data: any) {
    try {
      const token: { id: string; name: string } = Container.get('auth-token');

      const userFilter = { id: token.id };
      const userAttributes = [
        'name',
        'email',
        'id',
        'isActive',
        'deletedAt',
        'createdAt',
      ];
      const user = await this.usersService.findOne(userFilter, userAttributes);
      if (!user || !user.isActive || user.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t('NOT_EXISTS', {
            key: MODULE_NAME.USER,
          }),
        };
      }

      const filter = { userId: user.id, isActive: true };
      const userOrders = await this.usersService.findAllCartOrders(filter, {
        page: +data.page,
        limit: +data.limit,
      });

      return {
        status: statusCode.OK,
        message: l10n.t('COMMON_SUCCESS_MESSAGE', {
          key: `${MODULE_NAME.CART} ${this.helperService.toLowerCase(
            MODULE_NAME.ITEMS
          )}`,
          method: REQUEST_METHOD.GET,
        }),
        data: {
          count: userOrders.count,
          data: userOrders.rows ? userOrders.rows : [],
        },
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      };
    }
  }

  async order(data: any) {
    try {
      const token: { id: string; name: string } = Container.get('auth-token');

      const userFilter = { id: token.id };
      const userAttributes = [
        'name',
        'email',
        'id',
        'isActive',
        'deletedAt',
        'createdAt',
      ];
      const user = await this.usersService.findOne(userFilter, userAttributes);
      if (!user || !user.isActive || user.deletedAt) {
        return {
          status: statusCode.NOT_FOUND,
          message: l10n.t('NOT_EXISTS', {
            key: MODULE_NAME.USER,
          }),
        };
      }

      // to get cart products
      const filter = { userId: user.id, id: { [Op.in]: data.orderIds } };
      const userOrders = await this.usersService.findAllCartOrders(filter);

      let orderDetails: any = {
        totalPrice: 0,
        orderUser: {},
        productDetails: [],
      };

      // // to map response and provide order info
      for (let cartItem of userOrders.rows) {
        orderDetails.totalPrice += +cartItem.price;
        orderDetails.orderUser = cartItem.orderUser;
        orderDetails.productDetails.push({
          quantity: cartItem.quantity,
          price: +cartItem.price,
          createdAt: cartItem.createdAt,
          productInfo: {
            productId: cartItem.orderProductInfo.productId,
            name: cartItem.orderProductInfo.name,
            price: +cartItem.orderProductInfo.price,
          },
        });
      }

      return {
        status: statusCode.OK,
        message: l10n.t('COMMON_SUCCESS_MESSAGE', {
          key: MODULE_NAME.ORDER,
          method: REQUEST_METHOD.PLACED,
        }),
        data: orderDetails,
      };
    } catch (error) {
      return {
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      };
    }
  }
}
