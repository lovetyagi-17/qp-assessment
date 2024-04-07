import { dbConfig } from "../postgres";
import { AdminFactory } from "./admin";
import { GroceryFactory } from "./grocery";

export const Admin = AdminFactory(dbConfig);
export const Grocery = GroceryFactory(dbConfig);
