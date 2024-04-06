import { model, Schema } from 'mongoose';
import config from '../config';


const GlobalSettingsSchema: Schema = new Schema(
  {
    underMaintenance: {
        type: Boolean,
        default: false,
        required: true
    }
  },
  {
    collection: 'globalSettings',
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
  },
);

const GlobalSettingsModel = model('globalSettings', GlobalSettingsSchema);
export default GlobalSettingsModel;
