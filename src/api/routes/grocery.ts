import { Request, Response, Router } from "express";
import * as l10n from "jm-ez-l10n";

import { statusCode } from "../../common/utils/StatusCodes";
import { IGrocery } from "../controller/IGrocery";
import { GROCERY_SCHEMA } from "../schema/grocery";

const route = Router();

export default (app: Router) => {
  app.use("/admin/grocery", route);

  route.post("/", GROCERY_SCHEMA.CREATE, createGrocery);
  route.get("/", GROCERY_SCHEMA.LIST, getGroceryList);
  route.get("/:id", GROCERY_SCHEMA.DETAILS, groceryDetails);
  route.patch("/:id", GROCERY_SCHEMA.UPDATE, updateGrocery);
  route.delete("/:id", GROCERY_SCHEMA.DETAILS, removeGrocery);
};

async function createGrocery(req: any, res: Response) {
  const data = req.body;
  const grocery = new IGrocery();
  grocery
    .createGrocery(data)
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

async function getGroceryList(req: any, res: Response) {
  const data = req.query;
  const grocery = new IGrocery();
  grocery
    .getGroceryList(data)
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

async function groceryDetails(req: any, res: Response) {
  const data = req.params;
  const grocery = new IGrocery();
  grocery
    .groceryDetails(data)
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

async function updateGrocery(req: any, res: Response) {
  const data = req.body;
  data.id = req.params.id;
  const grocery = new IGrocery();
  grocery
    .updateGrocery(data)
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

async function removeGrocery(req: any, res: Response) {
  const data = req.params;
  const grocery = new IGrocery();
  grocery
    .removeGrocery(data)
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
