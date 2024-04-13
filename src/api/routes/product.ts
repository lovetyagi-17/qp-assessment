import { Request, Response, Router } from 'express';
import * as l10n from 'jm-ez-l10n';

import { statusCode } from '../../common/utils/StatusCodes';
import { IProducts } from '../controller/IProducts';
import { isAuthAdmin } from '../middleware/authentication';
import { PRODUCT_SCHEMA } from '../schema/product';

const route = Router();

export default (app: Router) => {
  app.use('/admin/product', route);

  route.post('/', isAuthAdmin, PRODUCT_SCHEMA.CREATE, createProduct);
  route.get('/', isAuthAdmin, PRODUCT_SCHEMA.LIST, getProductList);
  route.get('/:id', isAuthAdmin, PRODUCT_SCHEMA.DETAILS, productDetails);
  route.patch('/:id', isAuthAdmin, PRODUCT_SCHEMA.UPDATE, updateProduct);
  route.delete('/:id', isAuthAdmin, PRODUCT_SCHEMA.DETAILS, removeProduct);
};

async function createProduct(req: any, res: Response) {
  const data = req.body;
  const product = new IProducts();
  product
    .createProduct(data)
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

async function getProductList(req: any, res: Response) {
  const data = req.query;
  const product = new IProducts();
  product
    .getProductList(data)
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
  const product = new IProducts();
  product
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

async function updateProduct(req: any, res: Response) {
  const data = req.body;
  data.id = req.params.id;
  const product = new IProducts();
  product
    .updateProduct(data)
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

async function removeProduct(req: any, res: Response) {
  const data = req.params;
  const product = new IProducts();
  product
    .removeProduct(data)
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
