const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const Jobs = require('../../models/jobs');
process.env.NODE_ENV = "test";

describe("Jobs Routes Tests", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs")

    let c1 = await Company.create({
      handle: "fb",
      name: "Facebook",
      num_employees: 50,
      description: "I have your data."
    })

    j1 = await Job.create({
      title: "coder",
      salary: 2000,
      equity: 0.3,
      company_handle: "fb"
    });

    j2 = await Job.create({
      title: "CEO",
      salary: 20000,
      equity: 0.5,
      company_handle: "fb"
    });
    
  });
}


afterAll(async function () {
  await db.end();
});