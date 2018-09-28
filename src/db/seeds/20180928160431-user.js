'use strict';

const faker = require("faker");
const bcrypt = require("bcryptjs"); 

const salt = bcrypt.genSaltSync(10);
const plainPassword = "123456";

let users = [];

for (let i = 1; i <= 60; i++) {
  users.push({
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(plainPassword, salt),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard",
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
