import { celebrate, Joi } from "celebrate";

const ORDER_ITEMS = Joi.object({
  id: Joi.string().required().messages({
    "string.empty": "id is not allowed to be empty",
    "string.base": "id must be a string",
    "any.required": "id is required",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.empty": "quantity is not allowed to be empty",
    "number.base": "quantity must be a number",
    "number.min": "quantity must be greater than or equal to 1",
    "any.required": "quantity is required",
    "number.integer": "quantity must be an integer",
  }),
});

const USER_SCHEMA = {
  USER_LOGIN: celebrate({
    body: Joi.object({
      email: Joi.string().required().messages({
        "string.empty": "email is not allowed to be empty",
        "string.base": "email must be a string",
        "any.required": "email is required",
      }),
      password: Joi.string().required().messages({
        "string.empty": "password is not allowed to be empty",
        "string.base": "password must be a string",
        "any.required": "password is required",
      }),
    }),
  }),
  LIST: celebrate({
    query: Joi.object({
      page: Joi.number().integer().min(1).required().messages({
        "number.empty": "page is not allowed to be empty",
        "number.base": "page must be a number",
        "any.required": "page is required",
        "number.min": "page must be greater than or equal to 1",
        "number.integer": "page must be an integer",
      }),
      limit: Joi.number().integer().min(1).required().messages({
        "number.empty": "limit is not allowed to be empty",
        "number.base": "limit must be a number",
        "number.min": "page must be greater than or equal to 1",
        "any.required": "limit is required",
      }),
      search: Joi.string().optional().messages({
        "string.empty": "search is not allowed to be empty",
        "string.base": "search must be a string",
        "any.required": "page is required",
      }),
    }),
  }),

  DETAILS: celebrate({
    params: Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "id is not allowed to be empty",
        "string.base": "id must be a string",
        "any.required": "id is required",
      }),
    }),
  }),

  ORDER_ITEMS: Joi.object({
    id: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
  }),

  CREATE_ORDER: celebrate({
    body: Joi.object({
      items: Joi.array().items(ORDER_ITEMS).optional().min(1).messages({
        "array.empty": "items is not allowed to be empty",
        "array.only": "items must be a array",
        "any.required": "items is required",
      }),
    }),
  }),
};

export { USER_SCHEMA };
