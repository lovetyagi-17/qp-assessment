import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

import { qpDecrypt, qpEncrypt } from '../../utils/Encryption';
import config from '../../config';
import { Admin, Products } from '.';

export const setEncrypt = (value) =>
  value && value !== ''
    ? qpEncrypt(value, config.ENC_KEY, config.ENC_IV).toString()
    : '';

export const getDecrypt = (value) =>
  value && value !== ''
    ? qpDecrypt(value, config.ENC_KEY, config.ENC_IV).toString()
    : '';

export interface ProductsAttributes {
  id: string;
  name: string;
  description: string;
  quantity: number;
  isActive: boolean;
  inStock: boolean;
  price: number;
  createdBy: string;
  deletedAt?: Date;
}
export interface ProductModel
  extends Model<ProductsAttributes>,
    ProductsAttributes {
  prototype: {};
}

export type ProductStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ProductModel;
};

export function ProductFactory(sequelize: Sequelize): ProductStatic {
  const Products = <ProductStatic>sequelize.define('products', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: '',
      set(value) {
        const setValue: any = setEncrypt(value);
        this.setDataValue('name', setValue);
      },
      get() {
        const getValue = getDecrypt(this.getDataValue('name'));
        return getValue;
      },
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: '',
      set(value) {
        const setValue: any = setEncrypt(value);
        this.setDataValue('description', setValue);
      },
      get() {
        const getValue = getDecrypt(this.getDataValue('description'));
        return getValue;
      },
    },
    quantity: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN, // false - In-Active, true - Active
      defaultValue: true,
    },
    inStock: {
      type: DataTypes.BOOLEAN, // false - out-of-stock, true - stock
      defaultValue: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    createdBy: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  Products.belongsTo(Admin, {
    targetKey: 'id',
    foreignKey: 'createdBy',
    as: 'createdByAdmin',
  });

  return Products;
}
