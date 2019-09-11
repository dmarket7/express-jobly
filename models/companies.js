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

    if (!result.rows[0]) {
      throw new ExpressError(`No such message: ${id}`, 404);
    }

    return result.rows[0];
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

  static async update({ handle, name, num_employees, description, logo_url }) {
    // 'jobs', { 'name': 'Luke', 'title': 'engineer' }, 'id', 1

    let updateQuery = partialUpdate('companies', {name, num_employees, description, logo_url}, 'handle', handle)
    let company = await db.query(updateQuery.query, updateQuery.values);
    return {company: company.rows[0]}
  }

  static async delete(handle) {
    await db.query(
      `DELETE
      FROM companies
      WHERE handle = $1`,
      [handle]
    );
    return {message: "Company deleted."}
  }

  static async search(search, min_employees, max_employees){
    let clauses = ''
    if(search) {
      clauses += `handle LIKE '%${search}%'`
    }
    if(clauses && min_employees) {
      clauses += ` AND num_employees >= CONVERT(INT,${min_employees})`
    } else if(min_employees) {
      clauses += `num_employees >= CONVERT(INT,${min_employees})`
    }

    if(clauses && max_employees){
      clauses += ` AND num_employees <= CONVERT(INT,${max_employees})`
    } else if(max_employees) {
      clauses += `num_employees <= CONVERT(INT,${max_employees})`
    }
    console.log("Clauses  ", clauses)

    let companies = await db.query(
      `SELECT handle, name
      FROM companies
      WHERE $1
      `,
      [clauses]
    )

    return companies.rows
  }

}

module.exports = Company;