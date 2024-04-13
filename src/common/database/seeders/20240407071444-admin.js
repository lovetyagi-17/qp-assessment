'use strict';
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const salt = await bcrypt.genSalt(+process.env.SALT_WORK_FACTOR);
      const encryptpassword = await bcrypt.hash(
        process.env.QP_ADMIN_PASSWORD,
        salt
      );
      await queryInterface.bulkInsert('admins', [
        {
          id: `admin_${this.generateUid()}`,
          name: this.encrypt(
            process.env.QP_ADMIN_EMAIL.split('@')[0],
            process.env.ENC_KEY,
            process.env.ENC_IV
          ),
          email: this.encrypt(
            process.env.QP_ADMIN_EMAIL,
            process.env.ENC_KEY,
            process.env.ENC_IV
          ),
          password: encryptpassword,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error('seeder admin-: ', error);
    }
  },

  async down(queryInterface, Sequelize) {},

  generateUid(length = 10) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  encrypt(text, key, iv) {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      Buffer.from(iv, 'hex')
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  },
};
