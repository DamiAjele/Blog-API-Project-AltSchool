const app = require("../index");
const request = require("supertest");
const { connect } = require("./testDatabase");

describe("User API", () => {
  let conn;
  let authToken;
  let userId; // 1. Define userId variable here

  beforeAll(async () => {
    try {
      conn = await connect();

      // 2. Register user 
      const registerRes = await request(app).post("/v1/auth/register").send({
        firstName: "userfirstname",
        lastName: "userlastname",
        email: "user@gmail.com",
        password: "userpassword",
      });

      // 3. Save the userId
      userId = registerRes.body.newUser._id;

      // Login to get token
      const loginRes = await request(app).post("/v1/auth/login").send({
        email: "user@gmail.com",
        password: "userpassword",
      });
      authToken = loginRes.body.token;
    } catch (error) {
      console.error("Failed to connect to test DB:", error);
      throw error;
    }
  });

  afterEach(async () => {
    if (conn) await conn.cleanup();
  });

  afterAll(async () => {
    if (conn) {
      await conn.disconnect();
    }
  });

  //test fetching user profile
  it("should fetch user profile", async () => {
    const res = await request(app)
      .get(`/v1/users/get-user/${userId}`)
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  // Test updating user profile
  it("should update user profile", async () => {
    const registerRes = await request(app).post("/v1/auth/register").send({
      firstName: "userfirstname",
      lastName: "userlastname",
      email: "user@gmail.com",
      password: "userpassword",
    });

    userId = registerRes.body.newUser._id;
    const loginRes = await request(app).post("/v1/auth/login").send({
      email: "user@gmail.com",
      password: "userpassword",
    });
    authToken = loginRes.body.token;
    const res = await request(app)
      .put(`/v1/users/update-profile/${userId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        firstName: "updatedfirstname",
        lastName: "updatedlastname",
      });

    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });
});
