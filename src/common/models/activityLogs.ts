import { model, Schema } from "mongoose";
import config from "../config";

const ActivityLogsSchema: Schema = new Schema(
  {
    module: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "activityLogs",
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

const ActivityLogsModel = model("activityLogs", ActivityLogsSchema);
export default ActivityLogsModel;
