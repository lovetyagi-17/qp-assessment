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

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  deletedAt?: Date;
}
export interface UserModel extends Model<UserAttributes>, UserAttributes {
  prototype: {
    verifyPassword: (password: string) => boolean;
  };
}

export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export function UserFactory(sequelize: Sequelize): UserStatic {
  const User = <UserStatic>sequelize.define("users", {
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

  User.beforeCreate(async (user, options) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const encryptpassword = await bcrypt.hash(user.password, salt);
      user.password = encryptpassword;
    }
  });

  return User;
}
