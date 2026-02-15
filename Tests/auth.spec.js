const request = require("supertest");
const app = require("../index");
const { connect } = require("./testDatabase");


describe("Auth API", () => {
    let conn;

    beforeAll(async () => {
       try {
         conn = await connect();
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

    // Test user registration
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/v1/auth/register")
            .send({
                firstName: "userfirstname",
                lastName: "userlastname",
                email: "pajele@gmail.com",
                password: "userpassword"
            });
        console.log(res.body);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Account created successfully")
        expect(res.body).toHaveProperty("message");
    });

    // Test user login
    it("should login a user", async () => {
       await request(app).post("/v1/auth/register").send({
         firstName: "userfirstname",
         lastName: "userlastname",
         email: "pajele@gmail.com",
         password: "userpassword",
       });


        const res = await request(app)
            .post("/v1/auth/login")
            .send({
                email: "pajele@gmail.com",
                password: "userpassword"
            });
        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.message).toBe("Logged In successfully");
    });
})