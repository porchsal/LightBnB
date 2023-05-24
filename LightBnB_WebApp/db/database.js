const properties = require("./json/properties.json");
const users = require("./json/users.json");

'use strict';
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `
    SELECT * FROM users
    WHERE users.email = $1;
  `;
  return pool.query(queryString, [email])
  .then (res => {
    if (res.rows) {
      return res.rows[0];
    } else {
      return null
    }
  })
  .catch (err => {
    console.log('query error:', err)
  });

};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `
    SELECT * FROM users
    WHERE users.id = $1;
  `;
  return pool.query(queryString, id)
  .then (res => {
    if (res.rows) {
      return res.rows[0];
    } else {
      return null
    }
  })
  .catch (err => {
    console.log('query error:', err)
  });
  
  
   //return Promise.resolve(users[id]);
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING*;
  `;
  
  const values = [ user.name, user.email, user.password];
  return pool.query(queryString, values)
  .then(res => {
    return res.row[0];
  })
  .catch (err => {
    console.log('query error:', err)
  });
  
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `
    SELECT reservations.* 
    FROM reservations
    WHERE reservations.guest_id = $1
    LIMIT $2;
  `;
  const values = [guest_id, limit];
  return pool.query(queryString,values)
    .then(res =>{
      return res.row;
    })
    .catch (err => {
      console.log('query error:', err)
    });
  
  //return getAllProperties(null, 4);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  return pool
  .query(`SELECT * FROM properties LIMIT $1;`,[limit])
  .then((result) => {
    console.log(result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
