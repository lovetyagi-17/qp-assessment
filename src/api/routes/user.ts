import { Request, Response, Router } from "express";
import * as l10n from "jm-ez-l10n";

import { statusCode } from "../../common/utils/StatusCodes";
import { IUsers } from "../controller/IUser";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);

  route.get("/login", login);
};

async function login(req: any, res: Response) {
  const data = req.body;
  IUsers.login(data)
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
