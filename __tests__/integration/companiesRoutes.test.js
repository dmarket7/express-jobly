const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const Company = require('../../models/companies');
const Job = require('../../models/jobs');
process.env.NODE_ENV = "test";

describe("Company Routes Tests", function () {

  let admin;
  beforeEach(async function () {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM users");

    admin = await request(app)
      .post('/users')
      .send({
        username: "user309",
        password: "abc123",
        first_name: "Jack",
        last_name: "Doe",
        email: "user3@email.com",
        is_admin: true
      });

    let c1 = await Company.create({
      handle: "aapl",
      name: "Apple",
      num_employees: 15,
      description: "Buy a new iPhone."
    });

    let c2 = await Company.create({
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
      title: "coder2",
      salary: 2000,
      equity: 0.3,
      company_handle: "aapl"
    });
  })

  test("Will recieve 404 is going to route that does not exist", async function () {
    let response = await request(app)
      .get('/company');

    expect(response.statusCode).toEqual(404);
  });

  test("Can get all companies from /companies", async function () {
    let response = await request(app)
      .get('/companies')
      .send({
        _token: admin.body.token
      });

    expect(response.body.companies).toEqual([{
        handle: "aapl",
        name: "Apple"
      },
      {
        handle: "fb",
        name: "Facebook"
      }
    ]);
  });

  test("Can search with query paramaters to /companies", async function () {
    let response = await request(app)
      .get('/companies')
      .query({
        search: "aapl",
        min_employees: 10
      })
      .send({
        _token: admin.body.token
      });

    expect(response.body.companies.length).toEqual(1);
    expect(response.body.companies[0].handle).toBe('aapl');

  });

  test("Can POST to create new company at /companies", async function () {
    let response = await request(app)
      .post('/companies')
      .send({
        handle: "peet",
        name: "peets coffee",
        num_employees: 200,
        description: "big coffee",
        _token: admin.body.token
      });

    expect(response.body.company).toEqual({
      handle: "peet",
      name: "peets coffee",
      num_employees: 200,
      description: "big coffee",
      logo_url: null
    });
  });

  test("Can GET from /companies/:handle", async function () {
    let response = await request(app)
      .get('/companies/aapl')
      .send({
        _token: admin.body.token
      });

    expect(response.body).toEqual({
      company: {
        handle: "aapl",
        name: "Apple",
        num_employees: 15,
        description: "Buy a new iPhone.",
        logo_url: null,
        jobs: [{
          title: "coder2",
          company_handle: "aapl"
        }]
      }
    });
  });

  test("Can PATCH to /companies/:handle", async function () {
    let response = await request(app)
      .patch('/companies/aapl')
      .send({
        name: "peeties coffee",
        num_employees: 2000,
        description: "big coffee XL",
        _token: admin.body.token
      });

    expect(response.body.company).toEqual({
      handle: "aapl",
      name: "peeties coffee",
      num_employees: 2000,
      description: "big coffee XL",
      logo_url: null
    });
  })

  test("Can DELETE at /companies/:handle", async function () {
    let response = await request(app)
      .delete('/companies/aapl')
      .send({
        _token: admin.body.token
      });

    expect(response.body.message).toBe("Company deleted.");
  });

})

afterAll(async function () {
  await db.end();
});