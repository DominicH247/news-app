//set test environment
process.env.NODE_ENV = "test";

const request = require("supertest");
const connection = require("../db/connection.js");
const app = require("../app.js");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
chai.use(chaiSorted);

//re-sed db after each test
beforeEach(() => connection.seed.run());

// end db connection after every test
after(() => connection.destroy());

describe("/api", () => {
  /* APPLICATION ROUTE */
  describe("GET", () => {
    it("Status: 200, responds with json object, of available routes", () => {
      const available_routes = {
        available_routes: {
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api"
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }]
            }
          },
          "POST /api/topics": {
            description: "post a new topic, returns the posted topic",
            exampleRequestBody: {
              slug: "Hello World!",
              description: "making new discoveries"
            },
            exampleResponse: {
              article: {
                slug: "Hello World!",
                description: "making new discoveries"
              }
            }
          },

          "GET /api/users/:username": {
            description: " servers a user object",
            queries: [],
            exampleResponse: {
              user: {
                username: "happyamy2016",
                avatar_url:
                  "https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729",
                name: "Amy Happy"
              }
            }
          },
          "POST /api/users": {
            description: "post a new user, responds with the new user",
            exampleRequestBody: {
              username: "testuser1",
              avatar_url: "www.avatar.com",
              name: "test user"
            },
            exampleResponse: {
              user: {
                username: "testuser1",
                avatar_url: "www.avatar.com",
                name: "test user"
              }
            }
          },
          "GET /api/articles": {
            description: "serves an array of all articles",
            queries: ["author", "topic", "sort_by", "order", "page", "limit"],
            exampleResponse: {
              next: { page: 3, limit: 5 },
              previous: { page: 1, limit: 5 },
              articles: [
                {
                  author: "weegembump",
                  title: "Seafood substitutions are increasing",
                  article_id: 33,
                  topic: "cooking",
                  votes: 0,
                  created_at: "2018-05-30T16: 59: 13.341Z",
                  total_count: 38
                }
              ]
            }
          },
          "POST /api/articles": {
            description:
              "post a new article (must be an existing user), responds with the posted artticle, defaults votes to zero for nely posted article",
            exampleRequestBody: {
              username: "lurker",
              topic: "football",
              title: "top 10 strikers in the league",
              body: "article content..."
            },
            exampleReponse: {
              article: {
                author: "lurker",
                title: "top 10 strikers in the league",
                topic: "football",
                body: "article content...",
                article_id: 10,
                votes: 0,
                comment_count: 0,
                created_at: "2018-05-30T16:59:13.341Z"
              }
            }
          },
          "GET /api/articles/:article_id": {
            description: "serves an article object for the given article_id",
            queries: [],
            exampleResponse: {
              article: {
                article_id: 1,
                title: "Running a Node App",
                votes: 50,
                topic: "coding",
                author: "jessjelly",
                created_at: "2016-08-18T13:07:52.389Z",
                comment_count: 8,
                body: "Some content for the article body."
              }
            }
          },
          "DELETE /api/aritcles/:article_id": {
            description: "Delete an existing article"
          },
          "PATCH /api/articles/:article_id": {
            description:
              "patches the number of voted for the given article id, responds with the updated article object",
            exampleRequestBody: { inc_votes: 10 },
            exampleResponse: {
              article: {
                article_id: 1,
                title: "Running a Node App",
                votes: 50,
                topic: "coding",
                author: "jessjelly",
                created_at: "2016-08-18T13:07:52.389Z",
                comment_count: 8,
                body: "Some content for the article body."
              }
            }
          },
          "POST /api/articles/:article_id/commments": {
            description:
              "post a comment to an existing article_id, responds with the comment object, defaults votes to zero for newly posted comment",
            exampleRequestBody: { username: "jessjelly", body: "hello world!" },
            exampleResponse: {
              comment: {
                comment_id: 205,
                votes: 0,
                created_at: "2016-08-18T13:07:52.389Z",
                author: "jessjelly",
                body: "hello world!"
              }
            }
          },
          "GET /api/articles/:article_id/commments": {
            description:
              "serves an array of comments for the specified article_id",
            queries: ["sort_by", "order", "limit", "page"],
            exampleResponse: {
              next: {
                page: 3,
                limit: 5
              },
              previous: {
                page: 1,
                limit: 5
              },
              comments: [
                {
                  comment_id: 31,
                  author: "weegembump",
                  votes: 11,
                  created_at: "2016-02-01T02:29:55.551Z",
                  body: "a comment"
                },
                {
                  comment_id: 33,
                  author: "cooljmessy",
                  votes: 4,
                  created_at: "2016-05-13T07:34:27.403Z",
                  body: "Another comment"
                }
              ]
            }
          },
          "PATCH /api/commments/:comment_id": {
            description:
              "patch the existing number of comment votes for an existing comment_id",
            exampleRequestBody: { inc_votes: 1 },
            exampleResponse: {
              comment: {
                comment_id: 31,
                author: "weegembump",
                votes: 12,
                created_at: "2016-02-01T02:29:55.551Z",
                body: "a comment"
              }
            }
          },
          "DELETE /api/comments/:comment_id": {
            description: "delete an existing comment"
          }
        }
      };

      return request(app)
        .get("/api/")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql(available_routes);
        });
    });

    // ERRORS /api/
    describe("ERROR - INVALID APPLICATION PATH", () => {
      it("STATUS: 404, responds with error msg", () => {
        return request(app)
          .get("/not-a-path")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("404 Not Found - Invalid Path");
          });
      });
    });
  });

  /* TOPICS END POINT */
  describe("/topics", () => {
    describe("POST", () => {
      it("Status: 201, post new topic, returns the posted topic", () => {
        return request(app)
          .post("/api/topics")
          .send({
            slug: "new topic",
            description: "a description",
            topic_icon: "www.icon.com"
          })
          .expect(201)
          .then(({ body: { topic } }) => {
            expect(topic).to.eql({
              slug: "new topic",
              description: "a description",
              topic_icon: "www.icon.com"
            });
          });
      });
    });
    describe("GET", () => {
      it("STATUS: 200, responds with an array of objects, nested within, on the key of topics", () => {
        // expect array
        // expect length of array = length of test db topics item
        // expect first item in topics array to be object with expected keys

        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.a("array");
            expect(topics.length).to.equal(3);
            expect(topics[0]).to.have.all.keys([
              "description",
              "slug",
              "topic_icon"
            ]);
          });
      });
      /* TOPICS /topics ENDPOINT ERRORS */
      describe("ERROR - GET", () => {
        describe("INVALID PATH", () => {
          it("STATUS:404 - responds with error message", () => {
            return request(app)
              .get("/api/not-a-route")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("404 Not Found - Invalid Path");
              });
          });
        });
      });
      describe("POST", () => {
        describe("BAD REQUEST", () => {
          it("STATUS: 400, missing fields", () => {
            return request(app)
              .post("/api/topics")
              .send({})
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("400 Bad Request");
              });
          });
          it("STATUS:400, topic with slug already exists", () => {
            return request(app)
              .post("/api/topics")
              .send({ slug: "mitch", description: "test" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("400 Bad Request");
              });
          });
        });
      });
      describe("ERROR - METHODS", () => {
        describe("INVALID METHOD", () => {
          it("STATUS: 405 - responds with error message", () => {
            const invalidMethods = ["put", "patch", "delete"];

            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/topics")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("405 - Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });

  /* USERS END POINT */
  describe("/users", () => {
    describe("GET", () => {
      it("Status: 200, responds with array of all user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users.length).to.equal(4);
          });
      });
    });
    describe("POST", () => {
      it("Status 201: create new user, responds with created user", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "testuser1",
            avatar_url: "www.avatar.com",
            name: "test user"
          })
          .expect(201)
          .then(({ body: { user } }) => {
            expect(user).to.eql({
              username: "testuser1",
              avatar_url: "www.avatar.com",
              name: "test user"
            });
          });
      });
    });
    describe("/users/:username", () => {
      describe("GET", () => {
        it("STATUS: 200, responds with a user object for the given username", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              const testOutput = {
                user: {
                  username: "butter_bridge",
                  name: "jonny",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                }
              };
              expect(body).to.eql(testOutput);
            });
        });
        /* USERS ENDPOINT ERRORS */
        describe("ERROR - GET", () => {
          describe("NOT FOUND", () => {
            it("STATUS: 404 - responds with error message", () => {
              return request(app)
                .get("/api/users/not-a-username")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("404 Not Found - Item does not exist");
                });
            });
          });
        });
        /* Invalid Methods on users endpoint already covered via 
        testing in the topics end point */
        describe("POST", () => {
          describe("BAD REQUEST", () => {
            it("STATUS:400, missing fields", () => {
              return request(app)
                .post("/api/users")
                .send({})
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("400 Bad Request");
                });
            });
            it("STATUS:400, username already exists", () => {
              return request(app)
                .post("/api/users")
                .send({
                  username: "lurker",
                  avatar_url: "www.avatar.com",
                  name: "test user"
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("400 Bad Request - already exists");
                });
            });
          });
        });
      });
    });
  });

  /* ARTICLES ENDPOINT */
  describe("/articles", () => {
    describe("GET", () => {
      it("Status: 200, responds with array of article objects, default query created_at - descending adds comment_count and total_count of all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.a("array");
            expect(articles).to.be.sortedBy("created_at", { descending: true });
            expect(articles[1].comment_count).to.equal(0);
            expect(articles[8].comment_count).to.equal(2);
            expect(articles[0]).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count",
              "total_count"
            ]);
            expect(articles[0].total_count).to.equal(12);
          });
      });
      it("query sort by author", () => {
        const orders = ["asc", "desc"];
        const ordersPromises = orders.map(order => {
          return request(app)
            .get(`/api/articles?sort_by=author&order=${order}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              if (order === "desc") {
                expect(articles).to.be.sortedBy("author", { descending: true });
              } else {
                expect(articles).to.be.sortedBy("author");
              }
            });
        });
        return Promise.all(ordersPromises);
      });

      it("query sort by title", () => {
        const orders = ["asc", "desc"];

        const ordersPromises = orders.map(order => {
          return request(app)
            .get(`/api/articles?sort_by=title&order=${order}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              if (order === "desc") {
                expect(articles).to.be.sortedBy("title", { descending: true });
              } else {
                expect(articles).to.be.sortedBy("title");
              }
            });
        });
        return Promise.all(ordersPromises);
      });
      it("query sort by article_id", () => {
        const orders = ["asc", "desc"];

        const ordersPromises = orders.map(order => {
          return request(app)
            .get(`/api/articles?sort_by=article_id&order=${order}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              if (order === "desc") {
                expect(articles).to.be.sortedBy("article_id", {
                  descending: true
                });
              } else {
                expect(articles).to.be.sortedBy("article_id");
              }
            });
        });
        return Promise.all(ordersPromises);
      });
      it("query sort by topic", () => {
        const orders = ["asc", "desc"];

        const ordersPromises = orders.map(order => {
          return request(app)
            .get(`/api/articles?sort_by=topic&order=${order}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              if (order === "desc") {
                expect(articles).to.be.sortedBy("topic", {
                  descending: true
                });
              } else {
                expect(articles).to.be.sortedBy("topic");
              }
            });
        });
        return Promise.all(ordersPromises);
      });
      it("query sort by created_at", () => {
        const orders = ["asc", "desc"];

        const ordersPromises = orders.map(order => {
          return request(app)
            .get(`/api/articles?sort_by=created_at&order=${order}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              if (order === "desc") {
                expect(articles).to.be.sortedBy("created_at", {
                  descending: true
                });
              } else {
                expect(articles).to.be.sortedBy("created_at");
              }
            });
        });
        return Promise.all(ordersPromises);
      });

      // LIMIT AND PAGINATION FUNCTIONALITY
      describe("Accepts a limit query", () => {
        it("Limits the number of results served", () => {
          return request(app)
            .get("/api/articles?limit=5")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(5);
            });
        });
        it("Query limit defaults to 10, if no limmit is passed in", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(10);
            });
        });
        it("Displays the max number of results available if limit exceeds number of results", () => {
          return request(app)
            .get("/api/articles?limit=100")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(12);
            });
        });
        it("Works with sort_by query", () => {
          return request(app)
            .get("/api/articles?sort_by=author&limit=5")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(5);
              expect(articles).to.be.sortedBy("author", { descending: true });
            });
        });
        it("Works with author,topic query and sort_by", () => {
          return request(app)
            .get(
              "/api/articles?author=rogersop&topic=mitch&sort_by=article_id&order=asc&limit=2"
            )
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(2);
              expect(articles).to.be.sortedBy("article_id");
              expect(articles[0].author).to.equal("rogersop");
              expect(articles[0].topic).to.equal("mitch");
            });
        });
      });
      describe("Allows paginated results", () => {
        it("accepts page as query and displays the results for that page", () => {
          return request(app)
            .get("/api/articles?page=1&limit=2")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.eql({
                next: { page: 2, limit: 2 },
                articles: [
                  {
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    topic: "mitch",
                    created_at: "2018-11-15T12:21:54.171Z",
                    votes: 100,
                    comment_count: 13,
                    total_count: 12
                  },
                  {
                    author: "icellusedkars",
                    title: "Sony Vaio; or, The Laptop",
                    article_id: 2,
                    topic: "mitch",
                    created_at: "2014-11-16T12:21:54.171Z",
                    votes: 0,
                    comment_count: 0,
                    total_count: 12
                  }
                ]
              });
            });
        });
        it("accepts page as query and displays the results for that page 3", () => {
          return request(app)
            .get("/api/articles?page=3&limit=3")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.eql({
                next: { page: 4, limit: 3 },
                previous: { page: 2, limit: 3 },
                articles: [
                  {
                    author: "icellusedkars",
                    title: "Z",
                    article_id: 7,
                    topic: "mitch",
                    created_at: "1994-11-21T12:21:54.171Z",
                    votes: 0,
                    comment_count: 0,
                    total_count: 12
                  },
                  {
                    author: "icellusedkars",
                    title: "Does Mitch predate civilisation?",
                    article_id: 8,
                    topic: "mitch",
                    created_at: "1990-11-22T12:21:54.171Z",
                    votes: 0,
                    comment_count: 0,
                    total_count: 12
                  },
                  {
                    author: "butter_bridge",
                    title: "They're not exactly dogs, are they?",
                    article_id: 9,
                    topic: "mitch",
                    created_at: "1986-11-23T12:21:54.171Z",
                    votes: 0,
                    comment_count: 2,
                    total_count: 12
                  }
                ]
              });
            });
        });
        it("page is greater than results returns empty array the results for that page", () => {
          return request(app)
            .get("/api/articles?page=1000&limit=10")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.eql([]);
            });
        });
        it("Status: 200, page query at 3 the previous page is 2 an next page is 4 ", () => {
          return request(app)
            .get("/api/articles/?page=2&limit=3")
            .expect(200)
            .then(({ body }) => {
              expect(body.next.page).to.equal(3);
              expect(body.previous.page).to.equal(1);
            });
        });
        // LIMIT AND PAGINATION FUNCTIONALITY
        describe("query by author", () => {
          it("Status:200, returns array of articles who author is equal to query", () => {
            return request(app)
              .get("/api/articles?author=rogersop")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles[0].author).to.equal("rogersop");
                expect(articles[2].author).to.equal("rogersop");
              });
          });
          it("Status: 200 Author exists but has no articles", () => {
            return request(app)
              .get(`/api/articles?author=lurker`)
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.eql([]);
              });
          });
        });
        describe("query by topic", () => {
          it("status:200, returns array of articles whos topic matches the query", () => {
            return request(app)
              .get("/api/articles?topic=mitch")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles[0].topic).to.equal("mitch");
                expect(articles[5].topic).to.equal("mitch");
              });
          });
          it("status: 200, topic exists but no article returns empty array", () => {
            return request(app)
              .get(`/api/articles?topic=paper`)
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.eql([]);
              });
          });
          describe("query by topic and author", () => {
            it("status: 200, returns array of articles by author and topic", () => {
              return request(app)
                .get(`/api/articles?author=butter_bridge&topic=mitch`)
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles[0].topic).to.equal("mitch");
                  expect(articles[0].author).to.equal("butter_bridge");
                  expect(articles[2].topic).to.equal("mitch");
                  expect(articles[2].author).to.equal("butter_bridge");
                });
            });
            it("status: 200, returns empty array, if topic exists, but author has no articles", () => {
              return request(app)
                .get(`/api/articles?author=lurker&topic=mitch`)
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles).to.eql([]);
                });
            });
            it("status: 200, returns empty array, if topic and author exists, but topic has no articles", () => {
              return request(app)
                .get(`/api/articles?author=butter_bridge&topic=paper`)
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles).to.eql([]);
                });
            });
          });
        });
        describe("POST", () => {
          it("Status:201, post new article, responds with the new article", () => {
            return request(app)
              .post("/api/articles")
              .send({
                username: "lurker",
                topic: "mitch",
                title: "Test title",
                body: "test"
              })
              .expect(201)
              .then(({ body: { article } }) => {
                expect(article).to.have.all.keys([
                  "author",
                  "title",
                  "topic",
                  "body",
                  "article_id",
                  "votes",
                  "comment_count",
                  "created_at"
                ]);
              });
          });
          it("Status:201, defaults votes to zero if added to newly posted article", () => {
            return request(app)
              .post("/api/articles")
              .send({
                username: "lurker",
                topic: "mitch",
                title: "Test title",
                body: "test",
                votes: 10
              })
              .expect(201)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(0);
              });
          });
          /* ERROR api/articles */
          describe("GET - ERROR", () => {
            describe("NOT FOUND", () => {
              it("STATUS: 404, query valid but author does not exist, returns error message", () => {
                return request(app)
                  .get("/api/articles?author=NOT-A-REAL-AUTHOR")
                  .expect(404)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("404 Not Found - User does not exist");
                  });
              });

              it("STATUS: 404, query valid but topic does not exist, returns error message", () => {
                return request(app)
                  .get("/api/articles?topic=NOT-VALID-TOPIC")
                  .expect(404)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal(
                      "404 Not Found - Topic does not exist"
                    );
                  });
              });

              it("STATUS: 404, query valid author does not exist but topic does", () => {
                return request(app)
                  .get("/api/articles?author=DOES-NOT-EIXST&topic=mitch")
                  .expect(404)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("404 Not Found - User does not exist");
                  });
              });

              it("STATUS: 404, query valid topic does not exist but author does", () => {
                return request(app)
                  .get("/api/articles?author=lurker&topic=NOT-A-TOPIC")
                  .expect(404)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal(
                      "404 Not Found - Topic does not exist"
                    );
                  });
              });

              it("STATUS: 404, query valid topic and author does not exist", () => {
                return request(app)
                  .get("/api/articles?author=NOT-A-USER&topic=NOT-A-TOPIC")
                  .expect(404);
              });

              describe("BAD REQUEST", () => {
                it("STATUS: 400, bad request, order invalid", () => {
                  return request(app)
                    .get("/api/articles?order=NOT-VALID")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
                it("STATUS: 400, bad request invalid sort_by", () => {
                  return request(app)
                    .get("/api/articles?sort_by=NOT-A-VALID-COLUMN")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
                it("STATUS: 400, invalid limit ", () => {
                  return request(app)
                    .get("/api/articles?limit=INVALID-LIMIT")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
                it("STATUS: 400, invalid page ", () => {
                  return request(app)
                    .get("/api/articles?page=INVALID")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
              });
            });
          });
          describe("POST - ERROR", () => {
            describe("BAD REQUEST", () => {
              it("STATUS: 400, missing fields", () => {
                return request(app)
                  .post("/api/articles")
                  .send({})
                  .expect(400)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("400 Bad Request");
                  });
              });
              it("STATUS: 400, additional field outside of schema", () => {
                return request(app)
                  .post("/api/articles")
                  .send({
                    username: "lurker",
                    topic: "mitch",
                    title: "Test title",
                    body: "test",
                    additionalField: "ADDITIONAL FIELD"
                  })
                  .expect(400)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("400 Bad Request");
                  });
              });
              describe("NON-EXISTING ENTITY", () => {
                it("STATUS: 422, non-existing topic", () => {
                  return request(app)
                    .post("/api/articles")
                    .send({
                      username: "lurker",
                      topic: "NON-EXISTING-TOPIC",
                      title: "Test title",
                      body: "test"
                    })
                    .expect(422)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("422 Unprocessable Entity");
                    });
                });
                it("STATUS: 422, non-existing user", () => {
                  return request(app)
                    .post("/api/articles")
                    .send({
                      username: "NON-EXISTING USER",
                      topic: "mitch",
                      title: "Test title",
                      body: "test"
                    })
                    .expect(422)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("422 Unprocessable Entity");
                    });
                });
              });
            });
          });
        });

        /* ENDPOINT /api/articles/article:id */
        describe("/:article_id", () => {
          describe("GET", () => {
            it("status: 200, responds with array of article objects", () => {
              return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body: { article } }) => {
                  expect(article).to.have.all.keys([
                    "author",
                    "title",
                    "article_id",
                    "body",
                    "topic",
                    "created_at",
                    "votes",
                    "comment_count"
                  ]);
                  expect(article.article_id).to.equal(1);
                });
            });
            describe("PATCH", () => {
              it("status: 200, takes object for vote change, respond with the updated article", () => {
                return request(app)
                  .patch("/api/articles/1")
                  .send({ inc_votes: 100 })
                  .expect(200)
                  .then(({ body: { article } }) => {
                    expect(article.votes).to.equal(200);
                  });
              });
              it("status: 200, sending an empty body returns the article unaffected", () => {
                return request(app)
                  .patch("/api/articles/1")
                  .send({})
                  .expect(200)
                  .then(({ body: { article } }) => {
                    expect(article.votes).to.equal(100);
                  });
              });
            });
            describe("DELETE", () => {
              it("status: 204, delete article returns nothing", () => {
                return request(app)
                  .delete("/api/articles/1")
                  .expect(204)
                  .then(() => {
                    return request(app)
                      .get("/api/articles/1/comments")
                      .expect(404);
                  })
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal(
                      "404 Not Found - Article does not exist"
                    );
                  });
              });
            });

            /* ARTICLES /:article_id END POINT ERRORS */
            describe("ERROR - GET", () => {
              describe("NOT FOUND", () => {
                it("STATUS:404, article does not exist", () => {
                  return request(app)
                    .get("/api/articles/1000")
                    .expect(404)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal(
                        "404 Not Found - Article does not exist"
                      );
                    });
                });
              });

              describe("BAD REQUEST", () => {
                it("STATUS:400, invalid id ", () => {
                  return request(app)
                    .get("/api/articles/NOT-VALID-ID")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
              });
            });
            describe("ERROR - PATCH", () => {
              describe("BAD REQUEST", () => {
                it("STATUS: 400, responds with error message", () => {
                  // trying to post wrong data type
                  return request(app)
                    .patch("/api/articles/1")
                    .send({ inc_votes: "wrong data type" })
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
                describe("NOT FOUND", () => {
                  it("STATUS 404: NOT FOUND, correct format, non existant article_id", () => {
                    return request(app)
                      .patch("/api/articles/99999")
                      .send({ inc_votes: 1 })
                      .expect(404)
                      .then(({ body: { msg } }) => {
                        expect(msg).to.equal(
                          "404 Not Found - Item does not exist"
                        );
                      });
                  });
                });
                describe("DELETE", () => {
                  describe("NOT FOUND", () => {
                    it("STATUS:404, article_id not yet exist", () => {
                      return request(app)
                        .delete("/api/articles/1000")
                        .expect(404)
                        .then(({ body: { msg } }) => {
                          expect(msg).to.equal(
                            "404 Not Found - Article does not exist"
                          );
                        });
                    });
                  });
                  describe("BAD REQUEST", () => {
                    it("STATUS:400, invalid article_id", () => {
                      return request(app)
                        .delete("/api/articles/NOT-VALID-ID")
                        .expect(400)
                        .then(({ body: { msg } }) => {
                          expect(msg).to.equal("400 Bad Request");
                        });
                    });
                  });
                });
              });
            });
            /* Invalid methods already covered */
          });
          /* ENDPOINT /api/articles/:article_id/comments */
          describe("/comments", () => {
            describe("POST", () => {
              it("Status: 201, responds with newly posted comment", () => {
                return request(app)
                  .post("/api/articles/1/comments")
                  .send({ username: "icellusedkars", body: "Test message" })
                  .expect(201)
                  .then(({ body: { comment } }) => {
                    expect(comment).to.have.all.keys([
                      "article_id",
                      "author",
                      "body",
                      "comment_id",
                      "created_at",
                      "votes"
                    ]);
                    expect(comment.article_id).to.equal(1);
                  });
              });
            });
            describe("GET", () => {
              it("Status: 200, responds with array of comments for given article_id", () => {
                return request(app)
                  .get("/api/articles/1/comments")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments[1]).to.have.all.keys([
                      "comment_id",
                      "author",
                      "votes",
                      "created_at",
                      "body"
                    ]);
                  });
              });
              it("status: 200, responds with empty array if article exists but has no comments", () => {
                return request(app)
                  .get("/api/articles/2/comments")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).to.eql([]);
                  });
              });

              it("accepts query sort_by comment_id, and order, asc, desc", () => {
                const orders = ["asc", "desc"];

                const orderPromises = orders.map(order => {
                  return request(app)
                    .get(
                      `/api/articles/1/comments?sort_by=comment_id&order=${order}`
                    )
                    .expect(200)
                    .then(({ body: { comments } }) => {
                      if (order === "desc") {
                        expect(comments).to.be.sortedBy("comment_id", {
                          descending: true
                        });
                      } else {
                        expect(comments).to.be.sortedBy("comment_id");
                      }
                    });
                });
                return Promise.all(orderPromises);
              });
              it("accepts query sorted_by author and order", () => {
                const orders = ["asc", "desc"];

                const orderPromises = orders.map(order => {
                  return request(app)
                    .get(
                      `/api/articles/1/comments?sort_by=author&order=${order}`
                    )
                    .expect(200)
                    .then(({ body: { comments } }) => {
                      if (order === "desc") {
                        expect(comments).to.be.sortedBy("author", {
                          descending: true
                        });
                      } else {
                        expect(comments).to.be.sortedBy("author");
                      }
                    });
                });
                return Promise.all(orderPromises);
              });
              it("accepts query sort_by votes, and order", () => {
                const orders = ["asc", "desc"];

                const orderPromises = orders.map(order => {
                  return request(app)
                    .get(
                      `/api/articles/1/comments?sort_by=votes&order=${order}`
                    )
                    .expect(200)
                    .then(({ body: { comments } }) => {
                      if (order === "desc") {
                        expect(comments).to.be.sortedBy("votes", {
                          descending: true
                        });
                      } else {
                        expect(comments).to.be.sortedBy("votes");
                      }
                    });
                });
                return Promise.all(orderPromises);
              });
              it("accepts query sorted by created_at and order", () => {
                const orders = ["asc", "desc"];

                const orderPromises = orders.map(order => {
                  return request(app)
                    .get(
                      `/api/articles/1/comments?sort_by=created_at&order=${order}`
                    )
                    .expect(200)
                    .then(({ body: { comments } }) => {
                      if (order === "desc") {
                        expect(comments).to.be.sortedBy("created_at", {
                          descending: true
                        });
                      } else {
                        expect(comments).to.be.sortedBy("created_at");
                      }
                    });
                });
                return Promise.all(orderPromises);
              });
              it("ordering defaults to created_at, descending if no queries are provided", () => {
                return request(app)
                  .get(`/api/articles/1/comments`)
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).to.be.sortedBy("created_at", {
                      descending: true
                    });
                  });
              });
              it("accepts a limit query to limit the number of results served", () => {
                return request(app)
                  .get("/api/articles/1/comments?limit=3")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments.length).to.equal(3);
                  });
              });

              // LIMIT AND PAGINATION
              it("Status: 200, accepts pagination query", () => {
                return request(app)
                  .get("/api/articles/1/comments?page=2&limit=3")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments[0].comment_id).to.equal(5);
                  });
              });
              it("Status: 200, page exceeds is past the available comments, returns empty array ", () => {
                return request(app)
                  .get("/api/articles/1/comments?page=1000&limit=3")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments.length).to.equal(0);
                  });
              });
              it("Status: 200, page query at 3 the previous page is 2 an next page is 4 ", () => {
                return request(app)
                  .get("/api/articles/1/comments?page=2&limit=3")
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.next.page).to.equal(3);
                    expect(body.previous.page).to.equal(1);
                  });
              });
            });
            /* ERRORS api/articles/:article_id/comments*/
            describe("ERRORS - POST", () => {
              describe("UNPROCESSABLE ENTITY", () => {
                it("STATUS: 422 - username does not exist, responds with error message", () => {
                  return request(app)
                    .post("/api/articles/1/comments")
                    .send({
                      username: "not-a-user",
                      body: "test message"
                    })
                    .expect(422)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("422 Unprocessable Entity");
                    });
                });
              });
              describe("BAD REQUEST", () => {
                it("STATUS: 400 - Passing an empty object with no username or body", () => {
                  return request(app)
                    .post("/api/articles/1/comments")
                    .send({})
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
              });
              describe("BAD REQUEST", () => {
                it("STATUS: 400 - article id does not exist", () => {
                  return request(app)
                    .post("/api/articles/not-an-id/comments")
                    .send({
                      username: "icellusedkars",
                      body: "test message"
                    })
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
              });
            });
            describe("GET", () => {
              describe("NOT FOUND", () => {
                it("STATUS: 404, valid param but article currently does not exist", () => {
                  return request(app)
                    .get("/api/articles/1000/comments")
                    .expect(404)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal(
                        "404 Not Found - Article does not exist"
                      );
                    });
                });
              });
              describe("BAD REQUEST", () => {
                it("400 - query not valid", () => {
                  return request(app)
                    .get("/api/articles/1/comments?sort_by=NOT-VALID")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
                it("400 - Not valid article_id", () => {
                  return request(app)
                    .get("/api/articles/NOT-VALID-ID/comments")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
                it("STATUS: 400, Not valid limit", () => {
                  return request(app)
                    .get("/api/articles/1/comments?limit=NOT-VALID-LIMIT")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
                it("STATUS:400, not valid page query", () => {
                  return request(app)
                    .get("/api/articles/1/comments?page=NOT-VALID&limit=3")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
                it("STATUS:400, invalid page query and limit", () => {
                  return request(app)
                    .get(
                      "/api/articles/1/comments?page=NOT-VALID&limit=NOT-VALID"
                    )
                    .expect(400)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal("400 Bad Request");
                    });
                });
              });
            });
          });
        });
      });

      /* COMMENTS ENDPOINT */
      describe("/comments", () => {
        describe("/:comment_id", () => {
          describe("PATCH", () => {
            it("Status:200 increase comment_id votes", () => {
              return request(app)
                .patch("/api/comments/1")
                .send({ inc_votes: 50 })
                .expect(200)
                .then(({ body: { comment } }) => {
                  expect(comment.votes).to.equal(66);
                  expect(comment.comment_id).to.equal(1);
                });
            });
            it("Status:200 decrease comment_id votes", () => {
              return request(app)
                .patch("/api/comments/1")
                .send({ inc_votes: -10 })
                .expect(200)
                .then(({ body: { comment } }) => {
                  expect(comment.votes).to.equal(6);
                  expect(comment.comment_id).to.equal(1);
                });
            });
            it("Status:200 accepts empty body and responds with comment unaffected", () => {
              return request(app)
                .patch("/api/comments/1")
                .send({})
                .expect(200)
                .then(({ body: { comment } }) => {
                  expect(comment.votes).to.equal(16);
                  expect(comment.comment_id).to.equal(1);
                });
            });
          });
        });
        describe("DELTE", () => {
          it("Status 204", () => {
            return request(app)
              .delete("/api/comments/1")
              .expect(204);
          });
        });
        /* ERRORS /api/comments/:comment_id */
        describe("ERRORS", () => {
          describe("PATCH", () => {
            describe("BAD REQUEST", () => {
              it("STATUS 400, posting to invalid comment_id", () => {
                return request(app)
                  .patch("/api/comments/NOT-VALID")
                  .send({ inc_votes: 10 })
                  .expect(400)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("400 Bad Request");
                  });
              });
              it("STATUS: 400, posting incorrect data type", () => {
                return request(app)
                  .patch("/api/comments/1")
                  .send({ inc_votes: "invalid-votes" })
                  .expect(400)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("400 Bad Request");
                  });
              });
            });
            describe("NOT FOUND", () => {
              it("STATUS 404, posting to non - existant comment_id", () => {
                return request(app)
                  .patch("/api/comments/100")
                  .send({ inc_votes: 10 })
                  .expect(404)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("404 Not Found - Item does not exist");
                  });
              });
            });
          });
        });
        describe("DELETE", () => {
          describe("NOT FOUND", () => {
            it("STATUS 404, deleting from non-existant comment_id returns error msg", () => {
              return request(app)
                .delete("/api/comments/1000")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("404 Not Found - Item does not exist");
                });
            });
            describe("BAD REQUEST", () => {
              it("STATUS: 400, comment_id, invalid, returns error message", () => {
                return request(app)
                  .delete("/api/comments/NOT-VALID-COMMENT-ID")
                  .expect(400)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("400 Bad Request");
                  });
              });
            });
          });
        });
      });
    });
  });
});
