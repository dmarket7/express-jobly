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
          RETURNING id, title, salary, equity, company_handle, date_posted`,
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

  static async get(id) {
    let job = await db.query(
      `SELECT title, salary, equity, company_handle, date_posted
      FROM jobs
      WHERE id = $1`,
      [id]
    );
    return job.rows[0];
  }

  static async update({ id, ...items }) {
    let updateQuery = partialUpdate('jobs', items, 'id', id);
    let job = await db.query(updateQuery.query, updateQuery.values);
    return job.rows[0];
  }

  static async delete(id) {
    await db.query(
      `DELETE
      FROM jobs
      WHERE id = $1`,
      [id]
    );
    return "Job deleted.";
  }

  static async search(title, min_salary, min_equity) {
    let searchArray = [];
    // use length of search array instead of counter: switch order of clauses and push
    let clauses = ''
    if (title) {
      searchArray.push(`%${title}%`);
      clauses += `title LIKE $${searchArray.length}`;
    }
    if (clauses && min_salary) {
      searchArray.push(min_salary);
      clauses += ` AND salary >= (CAST($${searchArray.length} AS INT))`;
    } else if (min_salary) {
      searchArray.push(min_salary);
      clauses += `salary >= (CAST($${searchArray.length} AS INT))`;
    }
    if (clauses && min_equity) {
      searchArray.push(min_equity);
      clauses += ` AND equity >= CAST($${searchArray.length} AS FLOAT)`;
    } else if (min_equity) {
      searchArray.push(min_equity);
      clauses += `equity >= CAST($${searchArray.length} AS FLOAT)`;
    }

    let jobs = await db.query(
      `SELECT title, company_handle
      FROM jobs
      WHERE ${clauses}`, searchArray);

    return jobs.rows;
  }
}

module.exports = Job;