const db = require("../../db");
const User = require("../../models/users")
process.env.NODE_ENV = "test";

describe("Test User class", function () {

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
  });

  test("can create", async function () {
    let u = await User.create({
      username: "user3",
      password: "abc123",
      first_name: "Jack",
      last_name: "Doe",
      email: "user3@email.com"
    });

    expect(u.username).toBe("user3");
    expect(u.first_name).toBe("Jack");
    expect(u.last_name).toBe("Doe");
    expect(u.email).toBe("user3@email.com");
  })

  test("can get all users", async function () {
    let users = await User.all();

    expect(users).toEqual([{
      username: "user1",
      first_name: "John",
      last_name: "Doe",
      email: "user1@email.com"
    },
    {
      username: "user2",
      first_name: "Jane",
      last_name: "Doe",
      email: "user2@email.com"
    }]);
  })

  test("can get one user from username search", async function () {
    let user = await User.get("user1");

    expect(user).toEqual({
      username: "user1",
      first_name: "John",
      last_name: "Doe",
      email: "user1@email.com",
      photo_url: 'http://www.orientjphysicalsciences.org/images/user.jpg',
      is_admin: false
    });
  })

  test("can update user information", async function () {
    let user = await User.update({
      username: "user1",
      first_name: "Johnny",
      last_name: "Doe",
      email: "johnny@yahoo.com",
      photo_url: "https://pbs.twimg.com/profile_images/506219037475344384/6oOxfIXB_400x400.png"
    });

    expect(user).toEqual({
      username: "user1",
      first_name: "Johnny",
      last_name: "Doe",
      email: "johnny@yahoo.com",
      photo_url: "https://pbs.twimg.com/profile_images/506219037475344384/6oOxfIXB_400x400.png",
      is_admin: false
    });
  })

  test("It should delete one company based handle given.", async function () {
    await User.delete("user1");
    let allUsers = await User.all();

    expect(allUsers.length).toEqual(1);
  })

});

afterAll(async function () {
  await db.end();
});