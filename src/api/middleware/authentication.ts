import { Container } from "typedi";
import * as l10n from "jm-ez-l10n";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto-js";
import config from "../../common/config";
import { statusCode } from "../../common/utils/StatusCodes";
import { MODULE_NAME, REQUEST_METHOD } from "../../common/utils/Constants";
import { isTokenInvalid } from "./tokenManager";

export async function isAuthAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headerToken = <string>req.headers["authorization"];

  if (!headerToken) {
    return res.status(statusCode.BAD_REQUEST).json({
      status: statusCode.BAD_REQUEST,
      message: l10n.t("NOT_EXISTS", {
        key: `${MODULE_NAME.AUTH} ${MODULE_NAME.TOKEN}`,
      }),
    });
  } else {
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split("Bearer ")[1];

    if (!token) {
      return res.status(statusCode.UNAUTHORISED).json({
        status: statusCode.UNAUTHORISED,
        message: l10n.t("INVALID_REQUEST", {
          key: MODULE_NAME.TOKEN,
        }),
      });
    }

    if (isTokenInvalid(token)) {
      return res.status(statusCode.UNAUTHORISED).json({
        status: statusCode.UNAUTHORISED,
        message: l10n.t("ALREADY_DONE", {
          key: `${MODULE_NAME.AUTH} ${MODULE_NAME.TOKEN}`,
          status: REQUEST_METHOD.EXPIRED,
        }),
      });
    }

    jwt.verify(token, config.JWT_SECRET, async (error: any, decode: any) => {
      if (error) {
        return res.status(statusCode.UNAUTHORISED).json({
          status: statusCode.UNAUTHORISED,
          message: l10n.t("INVALID_REQUEST", {
            key: MODULE_NAME.TOKEN,
          }),
        });
      }
      res.locals.jwtTTL = { exp: decode.exp, jwt: token };

      const bytes = crypto.AES.decrypt(decode.sub, config.CIPHER_SECRET);
      const decryptedData = bytes.toString(crypto.enc.Utf8);

      res.locals.jwtPayload = JSON.parse(decryptedData);

      Container.set("auth-token", res.locals.jwtPayload);
      Container.set("token-string", token);
      next();
    });
  }
}
