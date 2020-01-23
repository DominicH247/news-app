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
    // precautionary
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
    describe("GET", () => {
      it("STATUS: 200, responds with an object with an array of objects, nesteted within, on the key of topics", () => {
        // expect array
        // expect length of array = length of test db topics item
        // expect first item in topics array to be object with expected keys

        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.a("array");
            expect(topics.length).to.equal(3);
            expect(topics[0]).to.have.all.keys(["description", "slug"]);
          });
      });
      /* TOPICS /tpoics ENDPOINT ERRORS */
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
      describe("ERROR - METHODS", () => {
        describe("INVALID METHOD", () => {
          it("STATUS: 405 - responds with error message", () => {
            const invalidMethods = ["post", "put", "patch", "delete"];

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
    describe("/users/:username", () => {
      describe("GET", () => {
        it("STATUS: 200, responds with a user object for the given username", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              const testOutput = {
                user: [
                  {
                    username: "butter_bridge",
                    name: "jonny",
                    avatar_url:
                      "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                  }
                ]
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
      });
    });
  });

  /* ARTICLES ENDPOINT */
  describe("/articles", () => {
    describe("GET", () => {
      it("Status: 200, responds with array of article objects, default query created_at - descending", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.a("array");
            expect(articles.length).to.equal(12);
            expect(articles).to.be.sortedBy("created_at", { descending: true });
            expect(articles[1].comment_count).to.equal("0");
            expect(articles[8].comment_count).to.equal("2");
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
                console.log(articles);
                expect(articles).to.eql([]);
              });
          });
          it("status: 200, returns empty array, if topic and author exists, but topic has no articles", () => {
            return request(app)
              .get(`/api/articles?author=butter_bridge&topic=paper`)
              .expect(200)
              .then(({ body: { articles } }) => {
                console.log(articles);
                expect(articles).to.eql([]);
              });
          });
        });
      });
      /* ERROR api/articles */
      describe("NOT FOUND", () => {
        it("STATUS: 404, query valid but author does not exist, returns error message", () => {
          return request(app)
            .get("/api/articles?author=NOT-A-REAL-AUTHOR")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("404 Not Found - User does not exist");
            });
        });

        it("STATUS: 404, query valid but item does not exist, returns error message", () => {
          return request(app)
            .get("/api/articles?topic=NOT-VALID-TOPIC")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("404 Not Found - Topic does not exist");
            });
        });

        it("STATUS: 404, query valid but author does not exist but topic does", () => {
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
              expect(msg).to.equal("404 Not Found - Topic does not exist");
            });
        });

        it("STATUS: 404, query valid topic and author does not exist", () => {
          return request(app)
            .get("/api/articles?author=NOT-A-USER&topic=NOT-A-TOPIC")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("404 Not Found - Topic does not exist");
            });
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
                expect(article[0].votes).to.equal(200);
              });
          });
        });
        /* ARTICLES /:article_id END POINT ERRORS */
        describe("ERROR - GET", () => {
          describe("NOT FOUND", () => {
            it("STATUS: 404, responds with error message", () => {
              return request(app)
                .get("/api/articles/1000")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("404 Not Found - Item does not exist");
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
                    expect(msg).to.equal("404 Not Found - Item does not exist");
                  });
              });
            });
          });
        });
        /* Invalid methods already covered */
      });
      /* ENDPOINT /api/articles/:article_id/comments  */
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
                .get(`/api/articles/1/comments?sort_by=author&order=${order}`)
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
                .get(`/api/articles/1/comments?sort_by=votes&order=${order}`)
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
          it("ordering defaults to created_at, ascending if no queries are provided", () => {
            return request(app)
              .get(`/api/articles/1/comments`)
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.sortedBy("created_at");
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
            it("404 - NOT FOUND, query not valid", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=NOT-VALID")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("404 - Not Found");
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
          it("STATUS 400, posting to non-existant comment_id", () => {
            return request(app)
              .patch("/api/comments/-1")
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
          it("STATUS: 400, missing fields", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({})
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("400 Bad Request");
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
    // TODO GO BACK THROUGH FOR EACH ID 404 FOR VALID BUT NON EXISTANT ID, 400 FOR INVALID ID
  });
});
