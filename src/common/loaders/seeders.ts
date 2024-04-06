import { connect, connection, set } from "mongoose";
import config from "../config";
import { AdminsModel, GlobalSettingsModel, UsersModel } from "../models";
import { MODULE_NAME } from "../utils/Constants";
import HelperServices from "../utils/Helpers";

connect(
  config.NODE_ENV == "development"
    ? config.MONGO_URI
    : `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_NAME}?authSource=admin`
)
  .then(() => {
    console.info(`
	    ##################################################
	    🛡️  \x1b[37m\x1b[1m MongoDB Connected \x1b[0m 🛡️
	    ##################################################
	`);
    set("debug", true);
  })
  .catch((err) => {
    console.error(
      `*****\x1b[31m\x1b[1m MongoDB Connection Error \x1b[0m***** ${err}`
    );
    process.exit(1);
  });

const seed = async () => {
  const helperService = new HelperServices();
  // re-check & update it
  for (let i = 0; i < process.argv.length; i++) {
    if (
      process.argv[process.argv.length] ==
      helperService.toLowerCase(MODULE_NAME.GLOBAL_SETTING)
    ) {
      await GlobalSettingsModel.insertMany(GlobalSettingData);
    } else if (
      process.argv[process.argv.length] ==
      helperService.toLowerCase(MODULE_NAME.ADMIN)
    ) {
      await AdminsModel.insertMany(AdminData);
    } else {
      await GlobalSettingsModel.deleteMany({});
      await GlobalSettingsModel.insertMany(GlobalSettingData);

      await AdminsModel.deleteMany({});
      await AdminsModel.insertMany(AdminData);
    }
  }
};

const GlobalSettingData: Record<string, any>[] = [
  {
    underMaintenance: false,
  },
];

const AdminData: Record<string, any>[] = [
  {
    email: "qp@yopmail.com",
    name: "Parpora",
    password: "Password@123",
    active: true,
  },
];

seed().then(() => {
  connection.close();
  process.exit();
});
