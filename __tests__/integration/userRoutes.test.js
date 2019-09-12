const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const User = require('../../models/users')
process.env.NODE_ENV = "test";

describe("Users Routes Tests", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM users");

    await User.create({
      username: "user1",
      password: "abc123",
      first_name: "John",
      last_name: "Doe",
      email: "user1@email.com"
    });

    await User.create({
      username: "user2",
      password: "abc123",
      first_name: "Jane",
      last_name: "Doe",
      email: "user2@email.com"
    })

  })

  test("Gets all users from /users", async function () {
    const users = await request(app)
      .get('/users')

    expect(users.body.users).toEqual([{
        username: "user1",
        first_name: "John",
        last_name: "Doe",
        email: "user1@email.com"
      }, {
        username: "user2",
        first_name: "Jane",
        last_name: "Doe",
        email: "user2@email.com"
    }]);
  })

  test('Gets one user from /users/:username', async function () {
    const response = await request(app)
      .get('/users/user1')

      expect(response.body.user.username).toBe("user1");
      expect(response.body.user.first_name).toBe("John");
      expect(response.body.user.last_name).toBe("Doe");
      expect(response.body.user.email).toBe("user1@email.com");
  })


  test('Can POST to create a new user at /users', async function () {
    const response = await request(app)
      .post('/users')
      .send({
        username: "user3",
        password: "abc123",
        first_name: "Jack",
        last_name: "Doe",
        email: "user3@email.com"
      })

    expect(response.body.user.username).toBe("user3");
    expect(response.body.user.first_name).toBe("Jack");
    expect(response.body.user.last_name).toBe("Doe");
    expect(response.body.user.email).toBe("user3@email.com");
  })

  test('Can PATCH a user at /users/:username', async function () {
    const response = await request(app)
      .patch('/users/user2')
      .send({
        first_name: "Jack",
        last_name: "Doe",
        email: "user3@email.com",
        photo_url: "https://pbs.twimg.com/profile_images/506219037475344384/6oOxfIXB_400x400.png",
      })

    expect(response.body.user.username).toBe("user2");
    expect(response.body.user.first_name).toBe("Jack");
    expect(response.body.user.last_name).toBe("Doe");
    expect(response.body.user.email).toBe("user3@email.com");
    expect(response.body.user.photo_url).toBe("https://pbs.twimg.com/profile_images/506219037475344384/6oOxfIXB_400x400.png");
  })

  test('Can DELETE a user at /users/:username', async function () {
    const response = await request(app)
      .delete('/users/user1')
    
      expect(response.body.message).toBe("User deleted.");
  });
});

afterAll(async function () {
  await db.end();
});