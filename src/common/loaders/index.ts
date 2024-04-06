import expressLoader from "./express";
import mongoConection from "./mongoose";

export default async ({ expressApp }) => {
  mongoConection();

  console.info("✌️ Express loaded");
  expressLoader({ app: expressApp });
};
