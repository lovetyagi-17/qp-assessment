import { Request, Response, Router } from "express";
import express from "../../common/loaders/express";
import { statusCode } from "../../common/utils/StatusCodes";
import Users from "../controllers/IUser";
import UserService from "../services/users";

export default class UserRoute {
  routes;
  userController;
  constructor() {
    this.routes = Router();
    this.userController = new Users();
    this.initRoutes();
  }

  initRoutes() {
    this.routes.post("/login", this.login.bind(this));
  }

  async login(req: Request, res: Response) {
    const data = req.body;
    this.userController
      .login(data)
      .then((response) => {
        return res.status(response.status).json(response);
      })
      .catch((e) => {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
          status: statusCode.INTERNAL_SERVER_ERROR,
          message: "Error Occuerd",
        });
      });
  }
}
