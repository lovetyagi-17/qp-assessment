import { Request, Response, Router } from "express";
import * as l10n from "jm-ez-l10n";

import { statusCode } from "../../common/utils/StatusCodes";
import { Admins } from "../controller/IAdmin";
import { ADMIN_SCHEMA } from "../schema/admin";

const route = Router();

export default (app: Router) => {
  app.use("/admin", route);

  route.post("/login", ADMIN_SCHEMA.ADMIN_LOGIN, login);
  route.post("/logout", login);
};

async function login(req: any, res: Response) {
  const data = req.body;
  Admins.login(data)
    .then((response) => {
      return res.status(response.status).json(response);
    })
    .catch((e) => {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t("SOMETHING_WENT_WRONG"),
      });
    });
}

async function logout(req: any, res: Response) {
  const data = req.body;
  Admins.logout(data)
    .then((response) => {
      return res.status(response.status).json(response);
    })
    .catch((e) => {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t("SOMETHING_WENT_WRONG"),
      });
    });
}
