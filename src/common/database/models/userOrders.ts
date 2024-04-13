import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

import { qpDecrypt, qpEncrypt } from '../../utils/Encryption';
import config from '../../config';
import { Products, Users } from '.';

export const setEncrypt = (value) =>
  value && value !== ''
    ? qpEncrypt(value, config.ENC_KEY, config.ENC_IV).toString()
    : '';

export const getDecrypt = (value) =>
  value && value !== ''
    ? qpDecrypt(value, config.ENC_KEY, config.ENC_IV).toString()
    : '';

export interface UserOrderAttributes {
  id: string;
  userId: string;
  productId: string;
  quantity: string;
  price: boolean;
  deletedAt?: Date;
}
export interface UserOrderModel
  extends Model<UserOrderAttributes>,
    UserOrderAttributes {}

export type UserOrderStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserOrderModel;
};

export function UserOrderFactory(sequelize: Sequelize): UserOrderStatic {
  const UserOrder = <UserOrderStatic>sequelize.define('userOrders', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  UserOrder.belongsTo(Users, {
    targetKey: 'id',
    foreignKey: 'userId',
    as: 'orderUser',
  });

  UserOrder.belongsTo(Products, {
    targetKey: 'id',
    foreignKey: 'productId',
    as: 'orderProductInfo',
  });

  return UserOrder;
}
