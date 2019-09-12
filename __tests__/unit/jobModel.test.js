const db = require("../../db");
const Company = require("../../models/companies");
const Job = require("../../models/jobs");
process.env.NODE_ENV = "test";

let j1;
let j2;

describe("Test Job class", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs");

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
  
  
  test("can create", async function () {
    let j3 = await Job.create({
      title: "accountant",
      salary: 2500,
      equity: 0.2,
      company_handle: "fb"
    });
    // title, salary, equity, company_handle, date_posted
    expect(j3.title).toBe("accountant");
    expect(j3.salary).toBe(2500);
    expect(j3.equity).toBe(0.2);
    expect(j3.company_handle).toBe("fb");
  })
  
  test("can get all jobs", async function () {
    let jobs = await Job.all();
    
    expect(jobs).toEqual([{
      "company_handle": "fb",
      "title": "coder"
    },
    {
      "company_handle": "fb",
      "title": "CEO"
    }]);
  })
  
  test("can get one job from id search", async function () {
    let job = await Job.get(j2.id);

    expect(job.title).toBe("CEO");
    expect(job.salary).toBe(20000);
    expect(job.equity).toBe(0.5);
    expect(job.company_handle).toBe("fb");
  })

});

afterAll(async function () {
  await db.end();
});