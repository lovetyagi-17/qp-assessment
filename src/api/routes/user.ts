import { Request, Response, Router } from 'express';
import * as l10n from 'jm-ez-l10n';

import { statusCode } from '../../common/utils/StatusCodes';
import { IUsers } from '../controller/IUser';
import { isAuthUser } from '../middleware/authentication';
import { USER_SCHEMA } from '../schema/users';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  /* user login and product route */
  route.post('/login', USER_SCHEMA.USER_LOGIN, login);
  route.get('/products', USER_SCHEMA.LIST, productList);
  route.get('/products/:id', USER_SCHEMA.DETAILS, productDetails);

  /* user cart routes */
  route.post('/cart', isAuthUser, USER_SCHEMA.ADD_TO_CART, addToCart);
  route.get('/cart', isAuthUser, USER_SCHEMA.LIST, cartList);

  /* user order route */
  route.post('/order', isAuthUser, USER_SCHEMA.CREATE_ORDER, order);
};

async function login(req: any, res: Response) {
  const data = req.body;
  const user = new IUsers();
  user
    .login(data)
    .then((response) => {
      return res.status(response.status).json(response);
    })
    .catch((e) => {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      });
    });
}

async function productList(req: any, res: Response) {
  const data = req.query;
  const user = new IUsers();
  user
    .productList(data)
    .then((response) => {
      return res.status(response.status).json(response);
    })
    .catch((e) => {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      });
    });
}

async function productDetails(req: any, res: Response) {
  const data = req.params;
  const user = new IUsers();
  user
    .productDetails(data)
    .then((response) => {
      return res.status(response.status).json(response);
    })
    .catch((e) => {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      });
    });
}

async function addToCart(req: any, res: Response) {
  const data = req.body;
  const user = new IUsers();
  user
    .addToCart(data)
    .then((response) => {
      return res.status(response.status).json(response);
    })
    .catch((e) => {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      });
    });
}

async function cartList(req: any, res: Response) {
  const data = req.query;
  const user = new IUsers();
  user
    .cartList(data)
    .then((response) => {
      return res.status(response.status).json(response);
    })
    .catch((e) => {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      });
    });
}

async function order(req: any, res: Response) {
  const data = req.body;
  const user = new IUsers();
  user
    .order(data)
    .then((response) => {
      return res.status(response.status).json(response);
    })
    .catch((e) => {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: statusCode.INTERNAL_SERVER_ERROR,
        message: l10n.t('SOMETHING_WENT_WRONG'),
      });
    });
}
