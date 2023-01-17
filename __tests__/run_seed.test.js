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
  describe("GET /api/topics", () => {
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
        .then(( { body }) => {
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
                comment_count : expect.any(String)
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
          expect(body.articles[0].created_at).toBe(
            "2020-11-03T09:12:00.000Z"
          );
          expect(body.articles[body.articles.length - 1].created_at).toBe("2020-06-06T09:10:00.000Z");
        });
    });
    test.only("responds with a 404 error when passed an incorrect route", () => {
        return request(app)
        .get(`/api/articles123`)
        .expect(404)
        .then(({body : {msg}}) =>{
            expect(msg).toBe(undefined)
        })
    })
  });
});
