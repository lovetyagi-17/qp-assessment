import assert from "assert";
import * as l10n from "jm-ez-l10n";
import request from "supertest";

import { IUsers } from "../api/controller/IUser";
import config from "../common/config";
import { MODULE_NAME } from "../common/utils/Constants";
import { statusCode } from "../common/utils/StatusCodes";

let token;
const baseUrl = "http://localhost:4010/user/";
const page = 1;
const limit = 2;
let items = [];

describe("User", function () {
  it("user login with invalid credentials", (done) => {
    request(baseUrl)
      .post("login")
      .send({
        email: config.QP_ADMIN_EMAIL,
        password: config.QP_ADMIN_PASSWORD,
      })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          assert.strictEqual(typeof result._body, "object");
          assert.strictEqual(result.status, statusCode.NOT_FOUND);

          done();
        } else {
          done(error);
        }
      });
  });
  it("user login with invalid password", (done) => {
    request(baseUrl)
      .post("login")
      .send({
        email: config.QP_USER_EMAIL,
        password: config.QP_ADMIN_PASSWORD,
      })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          assert.strictEqual(typeof result._body, "object");
          assert.strictEqual(result._body.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof result._body.message, "string");

          done();
        } else {
          done(error);
        }
      });
  });
  it("user login with valid credentials", function (done) {
    request(baseUrl)
      .post("login")
      .send({
        email: config.QP_USER_EMAIL,
        password: config.QP_USER_PASSWORD,
      })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, "string");
          assert.ok(response.data.token);
          assert.strictEqual(typeof response.data.token, "string");

          const user = response.data.user;
          assert.ok(user);
          assert.strictEqual(typeof response.data.user, "object");
          assert.strictEqual(typeof user.name, "string");
          assert.strictEqual(typeof user.email, "string");
          assert.strictEqual(typeof user.id, "string");
          assert.strictEqual(typeof user.isActive, "boolean");
          assert.strictEqual(typeof user.createdAt, "string");
          assert.ok(typeof user.deletedAt, null);

          token = response.data.token;
          done();
        } else {
          done(error);
        }
      });
  });
});

describe("Product", function () {
  it("get list of products without pagination", function (done) {
    request(baseUrl)
      .get("products")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;
          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, "string");
          assert.strictEqual(typeof response.type, "string");

          done();
        } else {
          done(error);
        }
      });
  });
  it("get list of products", function (done) {
    request(baseUrl)
      .get("products")
      .query({ page, limit })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, "string");
          assert.strictEqual(typeof response.data.count, "number");

          const products = response.data.data;

          for (let product of products) {
            assert.ok(product);

            assert.strictEqual(typeof product.name, "string");
            assert.strictEqual(typeof product.id, "string");
            assert.strictEqual(typeof product.quantity, "number");
            assert.strictEqual(typeof product.isActive, "boolean");
            assert.strictEqual(typeof product.inStock, "boolean");
            assert.strictEqual(typeof product.price, "string");
            assert.ok(typeof product.deletedAt, null);
            assert.strictEqual(typeof product.createdAt, "string");

            const productOwner = product.createdByAdmin;
            assert.ok(productOwner);
            assert.strictEqual(typeof productOwner.name, "string");
            assert.strictEqual(typeof productOwner.id, "string");

            items.push({ id: product.id, quantity: 2 });
          }

          items = items;
          done();
        } else {
          done(error);
        }
      });
  });
});

describe.skip("Cart", function () {
  it.skip("token not found", function (done) {
    request(baseUrl)
      .post("cart")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;
          console.log({ response });

          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, "string");

          done();
        } else {
          done(error);
        }
      });
  });
  it("invalid auth token", function (done) {
    request(baseUrl)
      .post("cart")
      .set("Authorization", `Bearer ${1234}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;
          console.log({ response });

          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.UNAUTHORISED);
          assert.strictEqual(typeof response.message, "string");

          done();
        } else {
          done(error);
        }
      });
  });
  it("add products to cart", function (done) {
    request(baseUrl)
      .post("cart")
      .set("Authorization", `Bearer ${token}`)
      .send(items)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;
          console.log({ response });

          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, "string");

          done();
        } else {
          done(error);
        }
      });
  });
});

describe("Order", function () {
  it("token not found", function (done) {
    request(baseUrl)
      .get("cart")
      .query({ page, limit })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, "string");

          done();
        } else {
          done(error);
        }
      });
  });
  it("invalid auth token", function (done) {
    request(baseUrl)
      .get("cart")
      .query(page, limit)
      .set("Authorization", `Bearer ${1234}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.UNAUTHORISED);
          assert.strictEqual(typeof response.message, "string");

          done();
        } else {
          done(error);
        }
      });
  });
  it("list of orders without pagination", function (done) {
    request(baseUrl)
      .get("cart")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;
          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.BAD_REQUEST);
          assert.strictEqual(typeof response.message, "string");
          assert.strictEqual(typeof response.type, "string");

          done();
        } else {
          done(error);
        }
      });
  });
  it("list of cart products", function (done) {
    request(baseUrl)
      .get("cart")
      .query({ page, limit })
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, "string");
          assert.strictEqual(typeof response.data.count, "number");

          const orders = response.data.data;

          for (let order of orders) {
            assert.ok(order);

            assert.strictEqual(typeof order.id, "string");
            assert.strictEqual(typeof order.quantity, "number");
            assert.strictEqual(typeof order.price, "string");
            assert.strictEqual(typeof order.createdAt, "string");

            const orderUser = order.orderUser;
            assert.ok(orderUser);
            assert.strictEqual(typeof orderUser.name, "string");
            assert.strictEqual(typeof orderUser.id, "string");

            const productInfo = order.orderProductInfo;
            assert.ok(productInfo);
            assert.strictEqual(typeof productInfo.name, "string");
            assert.strictEqual(typeof productInfo.description, "string");
            assert.strictEqual(typeof productInfo.id, "string");
            assert.strictEqual(typeof productInfo.price, "string");
          }

          done();
        } else {
          done(error);
        }
      });
  });
});
