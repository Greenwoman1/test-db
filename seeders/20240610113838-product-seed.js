'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed za User
    await queryInterface.bulkInsert('Users', [
      { id: "65bf0f14-2b90-4370-9b59-dfe15a887e8e", firstName: 'User 1', lastName: 'lastName for user 1', updateTimestamp: new Date() },
      { id: "7c371c20-33bb-401a-a281-3eb3734cb847", firstName: 'User 2', lastName: 'lastName for user 2', updateTimestamp: new Date() },
      {
        id: "a14fb671-7247-42ed-aa36-cf60d070cd8a", firstName: 'User 3', lastName: 'lastName for user 3', updateTimestamp: new Date()
      }
      // Dodajte više korisnika po potrebi
    ], {});

    // Seed za Product
    await queryInterface.bulkInsert('Products', [
      {
        id: uuidv4(), // Generisanje UUID za id
        name: 'Product 1',
        description: 'Description for Product 1',
        category: 1,
        price: 10.99,
        owner: 'a14fb671-7247-42ed-aa36-cf60d070cd8a', // Zamijenite sa stvarnom vrijednošću UUID-a vlasnika
        updateTimestamp: new Date()
      },
      {
        id: uuidv4(),
        name: 'Product 2',
        description: 'Description for Product 2',
        category: 2,
        price: 19.99,
        owner: 'a14fb671-7247-42ed-aa36-cf60d070cd8a',
        updateTimestamp: new Date()
      },
      // Dodajte više proizvoda po potrebi
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Brišemo sve unose iz tabele Users
    await queryInterface.bulkDelete('Users', null, {});
    // Brišemo sve unose iz tabele Products
    await queryInterface.bulkDelete('Products', null, {});
  }
};
