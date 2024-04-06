import { model, Schema } from "mongoose";
import config from "../config";

const AdminSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
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
    collection: "admins",
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

const AdminsModel = model("admins", AdminSchema);
export default AdminsModel;
