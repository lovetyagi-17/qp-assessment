import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";

import { qpDecrypt, qpEncrypt } from "../../utils/Encryption";
import config from "../../config";

const SALT_WORK_FACTOR = 10;

export const setEncrypt = (value) =>
  value && value !== ""
    ? qpEncrypt(value, config.ENC_KEY, config.ENC_IV).toString()
    : "";

export const getDecrypt = (value) =>
  value && value !== ""
    ? qpDecrypt(value, config.ENC_KEY, config.ENC_IV).toString()
    : "";

export interface AdminAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: string;
  deletedAt?: Date;
}
export interface AdminModel extends Model<AdminAttributes>, AdminAttributes {
  prototype: {
    verifyPassword: (password: string) => boolean;
  };
}

export type AdminStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): AdminModel;
};

export function AdminFactory(sequelize: Sequelize): AdminStatic {
  const Admin = <AdminStatic>sequelize.define("admins", {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const setValue: any = setEncrypt(value);
        this.setDataValue("email", setValue);
      },
      get() {
        const getValue = getDecrypt(this.getDataValue("email"));
        return getValue;
      },
    },
    password: {
      type: DataTypes.STRING,
    },

    isActive: {
      type: DataTypes.BOOLEAN, // false - In-Active, true - Active
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  Admin.beforeCreate(async (admin, options) => {
    if (admin.password) {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const encryptpassword = await bcrypt.hash(admin.password, salt);
      admin.password = encryptpassword;
    }
  });

  return Admin;
}
