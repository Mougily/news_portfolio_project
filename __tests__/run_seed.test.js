const app = require('../app');
const request = require("supertest");
const { db } = require("../db/connection");
const  seed  = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("App testing", () => {
  describe("GET ", () => {
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
    test("Returns a 200 status and responds with an article object based on passed article_id", () => {
        return request(app)
        .get("/api/articles/article_id=3")
        .expect(200)
        .then(({body}) => {
            const article3 = {
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: 1604394720000,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  article_id : 3,
                  votes : 0
              }
            expect(body.articles.length).toBeGreaterThan(0);
            body.article.forEach((article) => {
                expect(article).toEqual(article3)                
            })
        })
    })

  });
});
