import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface SettingsAttributes {
  id: string;
  underMaintenance: boolean;
  deletedAt?: Date;
}
export interface GlobalSettingModel
  extends Model<SettingsAttributes>,
    SettingsAttributes {}

export type SettingsStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): GlobalSettingModel;
};

export function GlobalSettingFactory(sequelize: Sequelize): SettingsStatic {
  const GlobalSetting = <SettingsStatic>sequelize.define('globalSettings', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    underMaintenance: {
      type: DataTypes.BOOLEAN, // false - working, true - under-maintenance
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  return GlobalSetting;
}
