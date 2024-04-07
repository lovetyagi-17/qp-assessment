import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

import { qpDecrypt, qpEncrypt } from "../../utils/Encryption";
import config from "../../config";
import { Admin } from ".";

export const setEncrypt = (value) =>
  value && value !== ""
    ? qpEncrypt(value, config.ENC_KEY, config.ENC_IV).toString()
    : "";

export const getDecrypt = (value) =>
  value && value !== ""
    ? qpDecrypt(value, config.ENC_KEY, config.ENC_IV).toString()
    : "";

export interface GroceryAttributes {
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
export interface GroceryModel
  extends Model<GroceryAttributes>,
    GroceryAttributes {
  prototype: {
    verifyPassword: (password: string) => boolean;
  };
}

export type GroceryStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): GroceryModel;
};

export function GroceryFactory(sequelize: Sequelize): GroceryStatic {
  const Grocery = <GroceryStatic>sequelize.define("grocery", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
      set(value) {
        const setValue: any = setEncrypt(value);
        this.setDataValue("name", setValue);
      },
      get() {
        const getValue = getDecrypt(this.getDataValue("name"));
        return getValue;
      },
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "",
      set(value) {
        const setValue: any = setEncrypt(value);
        this.setDataValue("description", setValue);
      },
      get() {
        const getValue = getDecrypt(this.getDataValue("description"));
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

  Grocery.belongsTo(Admin, {
    targetKey: "id",
    foreignKey: "createdBy",
    as: "createdByAdmin",
  });

  return Grocery;
}
