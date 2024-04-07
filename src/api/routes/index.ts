import { Router } from "express";
import user from "./user";
import grocery from "./grocery";
import admin from "./admin";

export default () => {
  const app = Router();
  user(app);
  grocery(app);
  admin(app);
  return app;
};
