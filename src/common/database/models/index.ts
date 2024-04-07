import { dbConfig } from "../postgres";
import { AdminFactory } from "./admin";
import { ProductFactory } from "./products";

export const Admin = AdminFactory(dbConfig);
export const Products = ProductFactory(dbConfig);
