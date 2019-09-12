const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const Company = require('../../models/companies');
const Job = require('../../models/jobs');
process.env.NODE_ENV = "test";

describe("Jobs Routes Tests", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs")

    await Company.create({
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

  test("Will recieve 404 is going to route that does not exist", async function () {
    let response = await request(app)
      .get('/job');

    expect(response.statusCode).toEqual(404);
  });
  test("Can get all jobs from /jobs", async function () {
    let response = await request(app)
      .get('/jobs');

    expect(response.body).toEqual({
      jobs: [{
        title: "coder",
        company_handle: "fb"
      },
      {
        title: "CEO",
        company_handle: "fb"
      }
      ]
    });
  });

  test("Can search with query paramaters to /jobs", async function () {
    let response = await request(app)
      .get('/jobs')
      .query({ min_salary: 1000, min_equity: 0.4 })

    expect(response.body.jobs.length).toEqual(1);
    expect(response.body.jobs[0].title).toBe('CEO');

  });

  test("Can POST to create new job at /jobs", async function () {
    let response = await request(app)
      .post('/jobs')
      .send({
        title: "coder2",
        salary: 3000,
        equity: 0.2,
        company_handle: "fb"
      });

    expect(response.body.job.title).toBe("coder2");
    expect(response.body.job.salary).toBe(3000);
    expect(response.body.job.equity).toBe(0.2);
    expect(response.body.job.company_handle).toBe("fb");
  });

  test("Can GET from /jobs/:title", async function () {
    let response = await request(app)
      .get(`/jobs/${j2.id}`);

    expect(response.body.job.title).toBe("CEO");
    expect(response.body.job.salary).toBe(20000);
    expect(response.body.job.equity).toBe(0.5);
    expect(response.body.job.company_handle).toBe("fb");
  });

  test("Can PATCH to /jobs/:id", async function () {
    let response = await request(app)
      .patch(`/jobs/${j2.id}`)
      .send({
        title: "CEO",
        salary: 30000,
        equity: 0.6,
        company_handle: "fb"
      });

    expect(response.body.job.title).toBe("CEO");
    expect(response.body.job.salary).toBe(30000);
    expect(response.body.job.equity).toBe(0.6);
    expect(response.body.job.company_handle).toBe("fb");
  })

  test("Can DELETE at /jobs/:id", async function () {
    let response = await request(app)
      .delete(`/jobs/${j1.id}`)

    expect(response.body.message).toBe("Job deleted.");
  });

});

afterAll(async function () {
  await db.end();
});