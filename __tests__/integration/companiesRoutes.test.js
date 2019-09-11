const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const Company = require('../../models/companies');
process.env.NODE_ENV = "test";

describe("Company Routes Tests", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM companies");

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
  })

  // test("Will recieve 404 is going to route that does not exist", async function() {
  //   let response = await request(app)
  //     .get('/company');

  //   expect(response.statusCode).toEqual(404);
  // })

  test("Can get all companies from /companies", async function () {
    let response = await request(app)
      .get('/companies');

    expect(response.body).toEqual([{
        "handle": "aapl",
        "name": "Apple"
      },
      {
        "handle": "fb",
        "name": "Facebook"
      }
    ])
  })

  test("Can search with query paramaters to /companies", async function() {
    let response = await request(app)
      .get('/companies')
      .query({search: "aapl", min_employees: 10})

    expect(response.body.length).toEqual(1);
    expect(response.body[0].handle).toBe('aapl');

  })

  test("Can POST to create new company at /companies", async function() {
    let response = await request(app)
      .post('/companies')
      .send({
        "handle": "peet",
        "name": "peets coffee",
        "num_employees": 200,
        "description": "big coffee"
      })

      expect(response.body.company).toEqual({
        "handle": "peet",
        "name": "peets coffee",
        "num_employees": 200,
        "description": "big coffee",
        "logo_url": null
    })
  })

  

})

afterAll(async function () {
  await db.end();
})