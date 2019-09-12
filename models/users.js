const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");
const ExpressError = require('../helpers/expressError');

class User {

  static async create({ username, password, first_name, last_name, email, photo_url, is_admin }) {
    let clauseOptions = [];
    let sterilInputs = [username, password, first_name, last_name, email]
    let sterilCount = sterilInputs.length+1;
    let sterilCountString = ``

    if(photo_url){
      sterilInputs.push(photo_url)
      clauseOptions.push(`, photo_url`)
      sterilCountString+=`, $${sterilCount}`
      sterilCount++
    }
    if(is_admin) {
      sterilInputs.push(is_admin);
      clauseOptions.push(`, is_admin`)
      sterilCountString+=`, $${sterilCount}`
    }
    let clauseOptionsString = clauseOptions.join('');

    const result = await db.query(
      `INSERT INTO users (
            username,
            password,
            first_name,
            last_name,
            email 
            ${clauseOptionsString})
          VALUES ($1, $2, $3, $4, $5 ${sterilCountString})
          RETURNING username, password, first_name, last_name, email, photo_url, is_admin`,
      sterilInputs);

    return result.rows[0];
  };

  static async all() {
    let allUsers = await db.query(
      `SELECT username, first_name, last_name, email
      FROM users`
    );
    return allUsers.rows;
    }

  static async get(username) {
    let user = await db.query(
      `SELECT username, first_name, last_name, email, photo_url, is_admin
      FROM users
      WHERE username = $1`,
      [username]
    );
    return user.rows[0];
  }

  static async update({username, ...items}) {
    let updateQuery = partialUpdate('users', items, 'username', username);
    let user = await db.query(updateQuery.query, updateQuery.values);
    let { first_name, last_name, is_admin, photo_url, email} = user.rows[0];

    return {username, first_name, last_name, is_admin, photo_url, email};
  }

  static async delete(username) { 
    const user = await db.query(
      `SELECT username, first_name, last_name, email, photo_url, is_admin
      FROM users
      WHERE username = $1`, [username])    
    if (user.rows[0]) {
      await db.query(`
      DELETE FROM users
      WHERE username = $1`, [username])
  
      return "User deleted."
    }
    throw new ExpressError('No user exists', 404)
  }


}

module.exports = User