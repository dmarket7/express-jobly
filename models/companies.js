/** Company class for jobly */
const db = require("../db")
const ExpressError = require("../helpers/expressError");
const partialUpdate = require("../helpers/partialUpdate")

class Company {

  static async create({ handle, name, num_employees, description, logo_url }) {
    const result = await db.query(
      `INSERT INTO companies (
            handle,
            name,
            num_employees,
            description,
            logo_url)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING handle, name, num_employees, description, logo_url`,
      [handle, name, num_employees, description, logo_url]);
        //put 404 in the route
    if (!result.rows[0]) {
      throw new ExpressError(`No such message: ${id}`, 404);
    }

    return { company: result.rows[0]};
  }

  static async all() {
    let allCompanies = await db.query(
      `SELECT handle, name
      FROM companies`
    );
    return allCompanies.rows
  }

  static async get(handle) {
    let company = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
      FROM companies
      WHERE handle = $1`,
      [handle]
    );
    return {company: company.rows[0]}
  }

  static async update({ handle, ...items }) {
    let updateQuery = partialUpdate('companies', items, 'handle', handle);
    let company = await db.query(updateQuery.query, updateQuery.values);
    return {company: company.rows[0]};
  }

  static async delete(handle) {
    await db.query(
      `DELETE
      FROM companies
      WHERE handle = $1`,
      [handle]
    );
    return {message: "Company deleted."};
  }

  static async search(search, min_employees, max_employees){
    //move error to route
    if(min_employees > max_employees) {
      throw new ExpressError(`Cannot search min > max`, 400);
    }
    let counter = 1;
    let searchArray = [];
    // use length of search array instead of counter: switch order of clauses and push
    let clauses = ''
    if(search) {
      searchArray.push(`%${search}%`);
      clauses += `handle LIKE $${searchArray.length}`;
    }
    if(clauses && min_employees) {
      searchArray.push(min_employees);
      clauses += ` AND num_employees >= (CAST($${searchArray.length} AS INT))`;
    } else if(min_employees) {
      searchArray.push(min_employees);
      clauses += `num_employees >= (CAST($${searchArray.length} AS INT))`;
    }
    if(clauses && max_employees){
      searchArray.push(max_employees);
      clauses += ` AND num_employees <= CAST($${searchArray.length} AS INT)`;
    } else if(max_employees) {
      searchArray.push(max_employees);
      clauses += `num_employees <= CAST($${searchArray.length} AS INT)`;
    }

    let companies = await db.query(
      `SELECT handle, name
      FROM companies
      WHERE ${clauses}`, searchArray );

    return companies.rows;
  }

}

module.exports = Company;