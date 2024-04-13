import assert from 'assert';
import request from 'supertest';

import config from '../common/config';
import { statusCode } from '../common/utils/StatusCodes';

let token;
let baseUrl = `${config.BASE_URL}user/`;

const pagination = { page: 1, limit: 5 }; // for listing api
let items = []; // use while adding product to cart
let cartItemIds = []; // use while ordering cart items

describe('User', function () {
  it('user login with invalid credentials', (done) => {
    request(baseUrl)
      .post('login')
      .send({
        email: config.QP_ADMIN_EMAIL,
        password: config.QP_ADMIN_PASSWORD,
      })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          assert.strictEqual(typeof result._body, 'object');
          assert.strictEqual(result.status, statusCode.NOT_FOUND);

          done();
        } else {
          done(error);
        }
      });
  });
  it('user login with invalid password', (done) => {
    request(baseUrl)
      .post('login')
      .send({
        email: config.QP_USER_EMAIL,
        password: config.QP_ADMIN_PASSWORD,
      })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          assert.strictEqual(typeof result._body, 'object');
          assert.strictEqual(result._body.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof result._body.message, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('user login with valid credentials', function (done) {
    request(baseUrl)
      .post('login')
      .send({
        email: config.QP_USER_EMAIL,
        password: config.QP_USER_PASSWORD,
      })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, 'string');
          assert.ok(response.data.token);
          assert.strictEqual(typeof response.data.token, 'string');

          const user = response.data.user;
          assert.ok(user);
          assert.strictEqual(typeof response.data.user, 'object');
          assert.strictEqual(typeof user.name, 'string');
          assert.strictEqual(typeof user.email, 'string');
          assert.strictEqual(typeof user.id, 'string');
          assert.strictEqual(typeof user.isActive, 'boolean');
          assert.strictEqual(typeof user.createdAt, 'string');
          assert.ok(typeof user.deletedAt, null);

          token = response.data.token;
          done();
        } else {
          done(error);
        }
      });
  });
});

describe('Product', function () {
  it('get list of products without pagination', function (done) {
    request(baseUrl)
      .get('products')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;
          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, 'string');
          assert.strictEqual(typeof response.type, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('get list of products', function (done) {
    request(baseUrl)
      .get('products')
      .query(pagination)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, 'string');
          assert.strictEqual(typeof response.data.count, 'number');

          const products = response.data.data;

          for (let product of products) {
            assert.ok(product);

            assert.strictEqual(typeof product.name, 'string');
            assert.strictEqual(typeof product.id, 'string');
            assert.strictEqual(typeof product.quantity, 'number');
            assert.strictEqual(typeof product.isActive, 'boolean');
            assert.strictEqual(typeof product.inStock, 'boolean');
            assert.strictEqual(typeof product.price, 'string');
            assert.ok(typeof product.deletedAt, null);
            assert.strictEqual(typeof product.createdAt, 'string');

            const productOwner = product.createdByAdmin;
            assert.ok(productOwner);
            assert.strictEqual(typeof productOwner.name, 'string');
            assert.strictEqual(typeof productOwner.id, 'string');

            if (product.quantity > 0 && product.inStock) {
              items.push({ id: product.id, quantity: 1 });
            }
          }

          done();
        } else {
          done(error);
        }
      });
  });
});

describe('Add to Cart', function () {
  it('token not found', function (done) {
    request(baseUrl)
      .post('cart')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('invalid auth token', function (done) {
    request(baseUrl)
      .post('cart')
      .set('Authorization', `Bearer ${1234}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.UNAUTHORISED);
          assert.strictEqual(typeof response.message, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('add to cart without products', function (done) {
    request(baseUrl)
      .post('cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [] })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('add products to cart', function (done) {
    request(baseUrl)
      .post('cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: items })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
});

describe('Orders in Cart', function () {
  it('token not found', function (done) {
    request(baseUrl)
      .get('cart')
      .query(pagination)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('invalid auth token', function (done) {
    request(baseUrl)
      .get('cart')
      .query(pagination)
      .set('Authorization', `Bearer ${1234}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.UNAUTHORISED);
          assert.strictEqual(typeof response.message, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('list of orders without pagination', function (done) {
    request(baseUrl)
      .get('cart')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;
          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, 'string');
          assert.strictEqual(typeof response.type, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('list of cart orders', function (done) {
    request(baseUrl)
      .get('cart')
      .query(pagination)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, 'string');
          assert.strictEqual(typeof response.data.count, 'number');

          const orders = response.data.data;

          for (let order of orders) {
            assert.ok(order);

            assert.strictEqual(typeof order.id, 'string');
            assert.strictEqual(typeof order.quantity, 'number');
            assert.strictEqual(typeof order.price, 'string');
            assert.strictEqual(typeof order.createdAt, 'string');

            const orderUser = order.orderUser;
            assert.ok(orderUser);
            assert.strictEqual(typeof orderUser.name, 'string');
            assert.strictEqual(typeof orderUser.id, 'string');

            const productInfo = order.orderProductInfo;
            assert.ok(productInfo);
            assert.strictEqual(typeof productInfo.name, 'string');
            assert.strictEqual(typeof productInfo.description, 'string');
            assert.strictEqual(typeof productInfo.id, 'string');
            assert.strictEqual(typeof productInfo.price, 'string');

            cartItemIds.push(order.id);
          }

          done();
        } else {
          done(error);
        }
      });
  });
});

describe('Orders placed', function () {
  it('token not found', function (done) {
    request(baseUrl)
      .post('order')
      .query(pagination)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('invalid auth token', function (done) {
    request(baseUrl)
      .post('order')
      .query(pagination)
      .set('Authorization', `Bearer ${1234}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.UNAUTHORISED);
          assert.strictEqual(typeof response.message, 'string');

          done();
        } else {
          done(error);
        }
      });
  });
  it('place order', function (done) {
    request(baseUrl)
      .post('order')
      .send({ orderIds: cartItemIds })
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, 'object');
          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, 'string');
          assert.strictEqual(typeof response.data.totalPrice, 'number');

          const orderUser = response.data.orderUser;
          assert.ok(orderUser);
          assert.strictEqual(typeof orderUser.id, 'string');
          assert.strictEqual(typeof orderUser.name, 'string');

          const orderProduct = response.data.productDetails;
          for (let order of orderProduct) {
            assert.ok(order);

            assert.strictEqual(typeof order.quantity, 'number');
            assert.strictEqual(typeof order.price, 'number');
            assert.strictEqual(typeof order.createdAt, 'string');

            const productInfo = order.productInfo;
            assert.ok(productInfo);
            assert.strictEqual(typeof productInfo.productId, 'string');
            assert.strictEqual(typeof productInfo.name, 'string');
            assert.strictEqual(typeof productInfo.price, 'number');
          }

          // to claer cartItemIds
          cartItemIds.splice(0, cartItemIds.length);

          done();
        } else {
          done(error);
        }
      });
  });
});
