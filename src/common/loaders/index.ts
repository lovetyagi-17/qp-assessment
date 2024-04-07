import expressLoader from "./express";
import connectDB from "../database/postgres";

export default async ({ expressApp }) => {
  await connectDB();

  console.info("✌️ Express loaded");
  expressLoader({ app: expressApp });
};
