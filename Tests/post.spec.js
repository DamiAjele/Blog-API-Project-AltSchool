const request = require("supertest");
const app = require("../index");
const { connect } = require("./testDatabase");

describe("Post API", () => {
    let conn;
    let authToken;

    beforeAll(async () => {
       try {
         conn = await connect();

         // Register and login a user to get an auth token for protected routes
         await request(app).post("/v1/auth/register").send({
           firstName: "userfirstname",
           lastName: "userlastname",
           email: "dajele@gmail.com",
           password: "userpassword",
         });
         const res = await request(app).post("/v1/auth/login").send({
           email: "dajele@gmail.com",
           password: "userpassword",
         });
         authToken = res.body.token;
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

    // Test creating a new post
    it("should create a new post", async () => {
        const res = await request(app)
            .post("/v1/posts/add-post")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Test Post",
                content: "This is a test post.",
                description: "Test description",
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("post");
        expect(res.body.post.title).toBe("Test Post");
    });

    // Test fetching all posts by logged in users
    it("should fetch only published posts for the logged-in user", async () => {
      await request(app)
        .post("/v1/posts/add-post")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Integration Test Post",
          content: "This is a test post.", 
          description: "Test description",
          state: "published",
        });

      // 2. Fetch posts
      const res = await request(app)
        .get("/v1/posts/get-posts-by-loggedin-users")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ limit: 10, page: 1, search: "Integration Test Post" });

      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("posts");
    });

    //Test for not logged in users
    it("should fetch only published posts for users not logged in", async () => {
      await request(app)
        .post("/v1/posts/add-post")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Integration Test Post",
          content: "This is a test post.",
          description: "Test description",
          state: "published",
        });

      // 2. Fetch posts
      const res = await request(app)
        .get("/v1/posts/get-posts-by-notloggedin-users")
        .query({ limit: 10, page: 1, search: "Integration Test Post" });

      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("posts");
    });

    // Test fetching a single post by ID
    it("should fetch a post by ID", async () => {
        const createRes = await request(app)
            .post("/v1/posts/add-post")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Test Post",
                content: "This is a test post.",
                description: "Test description",
            });
        const postId = createRes.body.post._id;
        const res = await request(app).get(`/v1/posts/get-post/${postId}`).set("Authorization", `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("post");
    });

    // Test updating a post
    it("should update a post", async () => {
        const createRes = await request(app)
            .post("/v1/posts/add-post")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Test Post",
                content: "This is a test post.",
                description: "Test description",
            });
        const postId = createRes.body.post._id;
        const res = await request(app)
            .put(`/v1/posts/update-post/${postId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Updated Test Post",
                content: "This is an updated test post.",
                description: "Updated test description",
            });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("post");
    });

    // Test deleting a post
    it("should delete a post", async () => {
        const createRes = await request(app)
            .post("/v1/posts/add-post")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Test Post",
                content: "This is a test post.",
                description: "Test description",
            });
        const postId = createRes.body.post._id;
        await request(app).get(`/v1/posts/get-post/${postId}`).set("Authorization", `Bearer ${authToken}`);
        const res = await request(app).delete(`/v1/posts/delete-post/${postId}`).set("Authorization", `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Post deleted successfully");
    });

    // Test publishing a post
    it("should publish a post", async () => {
        const createRes = await request(app)
            .post("/v1/posts/add-post")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Test Post",
                content: "This is a test post.",
                description: "Test description",
            });
        const postId = createRes.body.post._id;
        const res = await request(app).put(`/v1/posts/publish-post/${postId}`).set("Authorization", `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("post");
        expect(res.body.post.state).toBe("published");
    });

});