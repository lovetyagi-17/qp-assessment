import { dbConfig } from '../postgres';

import { AdminFactory } from './admin';
import { ProductFactory } from './products';
import { UserFactory } from './user';
import { UserOrderFactory } from './userOrders';

export const Admin = AdminFactory(dbConfig);
export const Products = ProductFactory(dbConfig);
export const Users = UserFactory(dbConfig);
export const UserOrders = UserOrderFactory(dbConfig);
