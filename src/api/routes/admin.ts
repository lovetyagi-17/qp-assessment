import { Request, Response, Router } from 'express';
import * as l10n from 'jm-ez-l10n';

import { statusCode } from '../../common/utils/StatusCodes';
import { IAdmins } from '../controller/IAdmin';
import { isAuthAdmin } from '../middleware/authentication';
import { ADMIN_SCHEMA } from '../schema/admin';

const route = Router();

export default (app: Router) => {
  app.use('/admin', route);

  route.post('/login', ADMIN_SCHEMA.ADMIN_LOGIN, login);
  route.post('/logout', isAuthAdmin, logout);
  route.get('/', isAuthAdmin, profile);
};

async function login(req: any, res: Response) {
  const data = req.body;
  const admin = new IAdmins();
  admin
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

async function profile(req: any, res: Response) {
  const admin = new IAdmins();
  admin
    .profile()
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

async function logout(req: any, res: Response) {
  const admin = new IAdmins();
  admin
    .logout()
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
