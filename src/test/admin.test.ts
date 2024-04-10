import assert from "assert";
import * as l10n from "jm-ez-l10n";
import request from "supertest";

import { IAdmins } from "../api/controller/IAdmin";
import config from "../common/config";
import { MODULE_NAME } from "../common/utils/Constants";
import { statusCode } from "../common/utils/StatusCodes";

const adminRepository = new IAdmins();
let token;

let baseUrl = "http://localhost:4010/admin/";

describe("Admin", function () {
  it("admin login with invalid credentials", (done) => {
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
          assert.strictEqual(typeof result._body, "object");
          assert.strictEqual(result.status, statusCode.NOT_FOUND);

          done();
        } else {
          done(error);
        }
      });
  });
  it("admin login with invalid password", (done) => {
    request(baseUrl)
      .post("login")
      .send({
        email: config.QP_ADMIN_EMAIL,
        password: config.QP_USER_PASSWORD,
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
  it("admin login with valid credentials", function (done) {
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
          const response = result._body;

          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, "string");
          assert.ok(response.data.token);
          assert.strictEqual(typeof response.data.token, "string");

          const admin = response.data.admin;
          assert.ok(admin);
          assert.strictEqual(typeof response.data.admin, "object");
          assert.strictEqual(typeof admin.name, "string");
          assert.strictEqual(typeof admin.email, "string");
          assert.strictEqual(typeof admin.id, "string");
          assert.strictEqual(typeof admin.isActive, "boolean");
          assert.strictEqual(typeof admin.createdAt, "string");
          assert.ok(typeof admin.deletedAt, null);

          token = response.data.token;
          done();
        } else {
          done(error);
        }
      });
  });
});

describe("Get Admin", function () {
  it("admin profile with invalid token", function (done) {
    request(baseUrl)
      .get("")
      .set("Authorization", `Bearer ${123}`)
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

  it("admin profile with no token", function (done) {
    request(baseUrl)
      .get("")
      // .set("Authorization", `Bearer ${token}`)
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

  it("admin profile with token", function (done) {
    request(baseUrl)
      .get("")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end(function (error, result) {
        if (result && result._body) {
          const response = result._body;

          assert.strictEqual(typeof response, "object");
          assert.strictEqual(response.status, statusCode.OK);
          assert.strictEqual(typeof response.message, "string");

          assert.strictEqual(typeof response.data, "object");

          const admin = response.data;
          assert.ok(admin);
          assert.strictEqual(typeof admin, "object");
          assert.strictEqual(typeof admin.name, "string");
          assert.strictEqual(typeof admin.email, "string");
          assert.strictEqual(typeof admin.id, "string");
          assert.strictEqual(typeof admin.isActive, "boolean");
          assert.strictEqual(typeof admin.createdAt, "string");
          assert.equal(admin.deletedAt, null);
          done();
        } else {
          done(error);
        }
      });
  });
});
