import express from "express";

import UserRoute from "./users";

const router = express.Router();

// Initialize routes
const usersRoute = new UserRoute();
router.use("/users", usersRoute.routes);

export default router;
