import { Router } from "express";
import user from "./user";
import product from "./product";
import admin from "./admin";

export default () => {
  const app = Router();
  user(app);
  product(app);
  admin(app);
  return app;
};
