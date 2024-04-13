import { celebrate, Joi } from 'celebrate';

const ADMIN_SCHEMA = {
  ADMIN_LOGIN: celebrate({
    body: Joi.object({
      email: Joi.string().required().messages({
        'string.empty': 'email is not allowed to be empty',
        'string.base': 'email must be a string',
        'any.required': 'email is required',
      }),
      password: Joi.string().required().messages({
        'string.empty': 'password is not allowed to be empty',
        'string.base': 'password must be a string',
        'any.required': 'password is required',
      }),
    }),
  }),

  UPDATE_SETTINGS: celebrate({
    body: Joi.object({
      underMaintenance: Joi.boolean().required().valid(true, false).messages({
        'boolean.empty': 'Under maintenance is not allowed to be empty',
        'boolean.base': 'Under maintenance must be a boolean',
        'any.required': 'Under maintenance is required',
      }),
    }),
  }),
};

export { ADMIN_SCHEMA };
