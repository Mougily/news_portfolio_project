const app = require("../app");
const request = require("supertest");
const { db } = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("App testing", () => {
  describe("GET topics", () => {
    test("Returns a 200 status and an array of all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBeGreaterThan(0);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/articles", () => {
    test("Returns a 200 status and an array of all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBeGreaterThan(0);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                article_id: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("Sorts by date in decending order by default", () => {
      return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(body.articles[body.articles.length - 1].created_at).toBe(
            "2020-06-06T09:10:00.000Z"
          );
        });
    });
    test("responds with a 404 error when passed an incorrect route", () => {
      return request(app)
        .get(`/api/articles123`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
        });
    });
  });

  describe("GET /article/comments", () => {
    test("Responds with a 200 status and an array of comments for the given article_id", () => {
      return request(app)
        .get(`/api/articles/3/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBeGreaterThan(0);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              })
            );
          });
        });
    });
    test("Orders comments in ascending order, with the most recent first", () => {
      return request(app)
        .get(`/api/articles/3/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0].created_at).toBe("2020-06-20T07:24:00.000Z");
          expect(body.comments[body.comments.length - 1].created_at).toBe(
            "2020-09-19T23:10:00.000Z"
          );
        });
    });
    test("responds with an error message when passed an incorrect id", () => {
      return request(app)
        .get("/api/articles/2345678/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
        });
    });
    test("responds with a 400 error message when passed an incorrect id type", () => {
      return request(app)
        .get("/api/articles/hello/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request!");
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("Returns a 200 status and responds with an article object based on passed article_id", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const article3 = {
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            article_id: 3,
            votes: 0,
          };
          expect(body.article.length).toBeGreaterThan(0);
          body.article.forEach((article) => {
            expect(article).toEqual(article3);
          });
        });
    });
    test("Returns a 404 error message for id not found", () => {
      return request(app)
        .get("/api/articles/2345678")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
        });
    });
    test("Returns a 400 error message for invalid id", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request!");
        });
    });
  });
});
describe("POST", () => {
  describe("POST responds request body accepts a comment object and responds with the post comment", () => {
    test("Returns a status 201 and responds with the updated comment object", () => {
      const updatedComment = { username: "lurker", body: "blah blah blah" };
      const responseComment = {
        comment: {
          article_id: 3,
          author: "lurker",
          body: "blah blah blah",
          comment_id: 19,
          created_at: expect.any(String),
          votes: 0,
        },
      };
      return request(app)
        .post(`/api/articles/3/comments`)
        .send(updatedComment)
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual(responseComment);
        });
    });
    test("Returns a 404 error message for article id not found", () => {
      return request(app)
        .post("/api/articles/2345678/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
        });
    });
    test("Returns a 400 error message for invalid id", () => {
      return request(app)
        .post("/api/articles/hello/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request!");
        });
    });
    test("Returns a 404 error message when passed a body without a username", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({ body: "hello" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
        });
    });
    test("Returns a 404 error message when passed a body where username is not present in test database", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({ username: "Steph", body: "hello" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
        });
    });
    test("Returns a status 201 and responds with the updated comment object when passed a comment body with an extra key, function is able to ignore extra key", () => {
      const updatedComment = {
        username: "lurker",
        body: "blah blah blah",
        hour: 12,
      };
      const responseComment = {
        comment: {
          article_id: 3,
          author: "lurker",
          body: "blah blah blah",
          comment_id: 19,
          created_at: expect.any(String),
          votes: 0,
        },
      };
      return request(app)
        .post(`/api/articles/3/comments`)
        .send(updatedComment)
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual(responseComment);
        });
    });
  });
});
describe("PATCH", () => {
  test("PATCH : responds with a 200 status and updates votes on an article via artice_id, when passed a positive number", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        const returnedBody = { article : {
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: expect.any(String),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 5,
          article_id: 4,
        } };
        const { body } = response;
        expect(body).toEqual(returnedBody);
      });
  });
  test("PATCH : responds with a 200 status and updates votes on an article via artice_id, when passed a negative number", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: -10 })
      .expect(200)
      .then((response) => {
        const returnedBody = { article : {
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: expect.any(String),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: -10,
          article_id: 4,
        } };
        const { body } = response;
        expect(body).toEqual(returnedBody);
      });
  });
});
