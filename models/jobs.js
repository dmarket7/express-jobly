const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");

class Job {

  static async create({ title, salary, equity, company_handle }) {
    const result = await db.query(
      `INSERT INTO jobs (
            title,
            salary,
            equity,
            company_handle)
          VALUES ($1, $2, $3, $4)
          RETURNING title, salary, equity, company_handle, date_posted`,
      [title, salary, equity, company_handle]);

    return result.rows[0];

  };
  
  static async all() {
    let allJobs = await db.query(
      `SELECT title, company_handle
      FROM jobs
      ORDER BY date_posted DESC`
    );
    return allJobs.rows
  }
}

module.exports = Job;