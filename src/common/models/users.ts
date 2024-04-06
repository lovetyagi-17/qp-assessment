import { model, Schema } from "mongoose";
import config from "../config";

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
      required: true,
      default: "default.png",
    },
    password: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "users",
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true,
      getters: true,
    },
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

const UsersModel = model("users", UserSchema);
export default UsersModel;
