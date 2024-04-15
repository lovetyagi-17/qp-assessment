import { Joi } from "celebrate";

const envVarsSchema = Joi.object()
  .keys({
    ENV: Joi.string().required().valid("dev", "local"),
    NODE_ENV: Joi.string().required().valid("development", "production"),

    NAME: Joi.string().required(),
    VERSION: Joi.string().required(),

    ENC_KEY: Joi.string().required(),
    ENC_IV: Joi.string().required(),

    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_DIALECT: Joi.string().required(),

    JWT_SECRET: Joi.string().required(),
    CIPHER_SECRET: Joi.string().required(),
    JWT_TTL: Joi.string().required(),
    PORT: Joi.number().required(),
    SALT_WORK_FACTOR: Joi.number().required(),

    QP_ADMIN_EMAIL: Joi.string().required(),
    QP_ADMIN_PASSWORD: Joi.string().required(),

    QP_USER_EMAIL: Joi.string().required(),
    QP_USER_PASSWORD: Joi.string().required(),
  })
  .unknown();

export const validateEnvSchema = () => {
  const { error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
};
