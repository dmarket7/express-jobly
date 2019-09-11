const db = require("../../db");
const Company = require("../../models/companies");
// require("dotenv").config();
process.env.NODE_ENV = "test";


describe("Test Company class", function () {

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
  });

  test("can create", async function () {
    let c = await Company.create({
      handle: "goog",
      name: "Google",
      num_employees: 15,
      description: "Don't be evil."
    });

    expect(c).toEqual({
      "handle": "goog",
      "name": "Google",
      "num_employees": 15,
      "description": "Don't be evil.",
      "logo_url": null
    });
  })

  test("can get all companies", async function () {
    let companies = await Company.all();

    expect(companies).toEqual([{
      "handle": "aapl",
      "name": "Apple"
    },
    {
      "handle": "fb",
      "name": "Facebook"
    }]);
  })

  test("can get one company from handle search", async function () {
    let company = await Company.get("aapl");

    expect(company).toEqual({
      "company":
      {
        "handle": "aapl",
        "name": "Apple",
        "num_employees": 15,
        "description": "Buy a new iPhone.",
        "logo_url": null
      }
    });
  })

  test("can update company information", async function () {
    let company = await Company.update({
      handle: "fb",
      name: "Facebook",
      num_employees: 1000,
      description: "I'm still watching."
    });

    expect(company).toEqual({
      "company":
      {
        "handle": "fb",
        "name": "Facebook",
        "num_employees": 1000,
        "description": "I'm still watching.",
        "logo_url": null
      }
    });
  })

  test("It should delete one company based handle given.", async function () {
    await Company.delete("aapl");
    let allSearch = await Company.all();

    expect(allSearch.length).toEqual(1);
  })

});

afterAll(async function () {
  await db.end();
});