const app = require("../app");
const request = require("supertest");
const { db } = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const jestSorted = require("jest-sorted");
const endpoints = require("../endpoints.json")

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
    test("responds with a 404 error when passed an incorrect route", () => {
      return request(app)
        .get(`/api/topics123`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
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
  });
  describe("GET: queries", () => {
    test("Returns a 200 status and accepts a sort-by query, which sorts articles by any valid column, sorting by created_at by default", () => {
      return request(app)
        .get(`/api/articles?sort_by=title`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted("title", { descending: true });
        });
    });
    test("Returns a 200 status and accepts a sort-by query sorting by created_at by default", () => {
      return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted("created_at", { descending: true });
        });
    });
    test("200 : accepts an order query, with default set to descending order", () => {
      return request(app)
        .get(`/api/articles?sort_by=title&order=ASC`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted("title", { ascending: true });
        })
        .then(() => {
          return request(app)
            .get(`/api/articles?sort_by=title`)
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSorted("title", { descending: true });
            });
        });
    });
    test("Responds with a 200 status and accepts a topic query", () => {
      return request(app)
        .get(`/api/articles?topic=cats`)
        .expect(200)
        .then(({ body: { articles } }) => {
          const catsArticle = {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            comment_count: "2",
            votes: 0,
            created_at: "2020-08-03T13:14:00.000Z",
            article_img_url: expect.any(String),
          };
          expect(articles[0]).toEqual(catsArticle);
        });
    });
    test("responds with a 200 status not found when passed a topic that exists but which does not have any associated articles", () => {
      return request(app)
        .get(`/api/articles/?topic=paper`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([]);
        });
    });
    test("responds with a 404 error when passed a topic that does not exist on the database", () => {
      return request(app)
        .get(`/api/articles/?topic=banana`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
        });
    });
    test("400 : responds with error for not accepted order query", () => {
      return request(app)
        .get(`/api/articles?order=crumpets`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
        });
    });
    test("responds with a 404 error when passed a sort_by column query where the passed column does not exist on the database", () => {
      return request(app)
        .get(`/api/articles/?sort_by=rainbows`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found!");
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
          expect(body.comments).toBeSorted("created_at", { ascending: true });
        });
    });
    test("responds with a 404 error message when passed an incorrect id", () => {
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
            comment_count: "2",
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
    describe("GET /api/articles/:article_id - feature request", () => {
      test("Returns a 200 status and responds with an article object based on passed article_id with comment_count on returned object, defaulted to 0", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.length).toBeGreaterThan(0);
            body.article.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  title: expect.any(String),
                  topic: expect.any(String),
                  body: expect.any(String),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  article_id: expect.any(Number),
                  article_img_url: expect.any(String),
                  comment_count: expect.any(String),
                })
              );
            });
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
  });
});

describe("GET : users", () => {
  test("Returns a 200 status and an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
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
        const returnedBody = {
          article: {
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: expect.any(String),
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            votes: 5,
            article_id: 4,
          },
        };
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
        const returnedBody = {
          article: {
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: expect.any(String),
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            votes: -10,
            article_id: 4,
          },
        };
        const { body } = response;
        expect(body).toEqual(returnedBody);
      });
  });
  test("PATCH : responds with a 200 status and updates votes even when passed surplus keys on body object", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: -10, name: "Steph" })
      .expect(200)
      .then((response) => {
        const returnedBody = {
          article: {
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: expect.any(String),
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            votes: -10,
            article_id: 4,
          },
        };
        const { body } = response;
        expect(body).toEqual(returnedBody);
      });
  });
  test("Checks votes have been added to test database", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        const returnedBody = {
          article: {
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: expect.any(String),
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            votes: 5,
            article_id: 4,
          },
        };
        const { body } = response;
        expect(body).toEqual(returnedBody);
        return request(app)
          .get(`/api/articles/4`)
          .then((response) => {
            const votes = response.body.article[0].votes;
            expect(votes).toBe(5);
          });
      });
  });
  test("PATCH : returns a 404 error message when article_id does not exist on test database", () => {
    return request(app)
      .patch("/api/articles/400000")
      .send({ inc_votes: -10 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found!");
      });
  });
  test("PATCH : returns a 400 error message when passed invalid article_id data type", () => {
    return request(app)
      .patch("/api/articles/hello")
      .send({ inc_votes: -10 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request!");
      });
  });
  test("PATCH : returns a 400 error message when passed invalid key on body", () => {
    return request(app)
      .patch("/api/articles/hello")
      .send({ someVotes: -10 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request!");
      });
  });
});

describe("DELETE : status 204 and no content", () => {
  test("Deletes given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/5")
      .expect(204)
      .then(() => {
        return request(app)
          .delete("/api/comments/5")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
          });
      });
  });
  test("Returns a 404 error message when passed a comment id that does not exist", () => {
    return request(app)
      .delete("/api/comments/12345")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found!");
      });
  });
  test("Returns a 400 error message when passed a comment id of the wrong data type", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request!");
      });
  });
});
describe('Endpoints', () => {
  test('endpoints.json file should have correct format', () => {
      expect(endpoints).toBeDefined();
      expect(Object.keys(endpoints).length).toBeGreaterThan(0);
  });
  Object.keys(endpoints).forEach(endpoint => {
      test(`${endpoint} should match the format`, () => {
          expect(endpoints[endpoint]).toHaveProperty('description');
          if (endpoints[endpoint].hasOwnProperty('exampleResponse')) {
              expect(endpoints[endpoint]).toHaveProperty('exampleResponse');
          }
      });
  });
});


