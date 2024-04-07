import { celebrate, Joi } from "celebrate";
import config from "../../common/config";

const GROCERY_SCHEMA = {
  CREATE: celebrate({
    body: Joi.object({
      name: Joi.string().required().messages({
        "string.empty": "name is not allowed to be empty",
        "string.base": "name must be a string",
        "any.required": "name is required",
      }),
      description: Joi.string().required().messages({
        "string.empty": "description is not allowed to be empty",
        "string.base": "description must be a string",
        "any.required": "description is required",
      }),
      quantity: Joi.number().required().messages({
        "number.empty": "quantity is not allowed to be empty",
        "number.base": "quantity must be a number",
        "any.required": "quantity is required",
      }),
      isActive: Joi.boolean().required().valid(true, false).messages({
        "boolean.empty": "is active is not allowed to be empty",
        "boolean.base": "is active must be a boolean",
        "any.only": "is active must be true/false",
      }),
      inStock: Joi.boolean().required().valid(true, false).messages({
        "boolean.empty": "in stock is not allowed to be empty",
        "boolean.base": "in stock must be a boolean",
        "any.only": "in stock must be true/false",
      }),
    }),
  }),

  LIST: celebrate({
    query: Joi.object({
      page: Joi.number().integer().min(1).required().messages({
        "number.empty": "page is not allowed to be empty",
        "number.base": "page must be a number",
      }),
      limit: Joi.number().integer().required().messages({
        "number.empty": "limit is not allowed to be empty",
        "number.base": "limit must be a number",
      }),
      search: Joi.string().optional().messages({
        "string.empty": "search is not allowed to be empty",
        "string.base": "search must be a string",
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

  UPDATE: celebrate({
    params: Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "id is not allowed to be empty",
        "string.base": "id must be a string",
        "any.required": "id is required",
      }),
    }),
    body: Joi.object({
      name: Joi.string().required().messages({
        "string.empty": "email is not allowed to be empty",
        "string.base": "email must be a string",
        "any.required": "email is required",
      }),
    }),
  }),
};

export { GROCERY_SCHEMA };
