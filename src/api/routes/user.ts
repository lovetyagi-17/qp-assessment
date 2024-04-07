import { Request, Response, Router } from "express";
import * as l10n from "jm-ez-l10n";

import { statusCode } from "../../common/utils/StatusCodes";
import { IUsers } from "../controller/IUser";
import { USER_SCHEMA } from "../schema/users";

const route = Router();

export default (app: Router) => {
  app.use("/user", route);

  route.get("/login", login);
  route.get("/products", productList);
  route.get("/products/:id", productDetails);

  route.post("/order", USER_SCHEMA.CREATE_ORDER, order);
};

async function login(req: any, res: Response) {
  const data = req.body;
  const user = new IUsers();
  user
    .login(data)
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

async function productList(req: any, res: Response) {
  const data = req.query;
  const user = new IUsers();
  user
    .productList(data)
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

async function productDetails(req: any, res: Response) {
  const data = req.params;
  const user = new IUsers();
  user
    .productDetails(data)
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

async function order(req: any, res: Response) {
  const data = req.body;
  const user = new IUsers();
  user
    .order(data)
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
