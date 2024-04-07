import { dbConfig } from "../postgres";
import { AdminFactory } from "./admin";

export const Admin = AdminFactory(dbConfig);
