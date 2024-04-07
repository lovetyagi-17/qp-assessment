import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto-js";
import config from "../config";

export default class HelperServices {
  constructor() {}

  toLowerCase(data: any) {
    return data.toLowerCase();
  }

  generateUid(length = 10) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async verifyPassword(requestPassword, password): Promise<any> {
    return bcrypt.compare(requestPassword, password);
  }

  generateToken(data, expiresIn = config.JWT_TTL) {
    const cipherTextAuthKey = config.CIPHER_SECRET;
    const jwtSecreteKeyAuthKey = config.JWT_SECRET;
    const expiryTTL = expiresIn;
    const ciphertext = crypto.AES.encrypt(
      JSON.stringify(data),
      cipherTextAuthKey
    );
    const token = jwt.sign(
      { sub: ciphertext.toString() },
      jwtSecreteKeyAuthKey,
      { expiresIn: expiryTTL }
    );
    return token;
  }
}
