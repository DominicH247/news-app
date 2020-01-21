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
                .get("/api/articles/-1")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("404 Not Found - Item does not exist");
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
                  expect(msg).to.equal("400 Bad Request - Invalid data-type");
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
      describe("/comments", () => {
        describe("POST", () => {
          it("Status: 201, responds with newly posted comment", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "icellusedkars", body: "Test message" })
              .expect(201)
              .then(({ body }) => {
                expect(body.comment).to.have.all.keys([
                  "article_id",
                  "author",
                  "body",
                  "comment_id",
                  "created_at",
                  "votes"
                ]);
              });
          });
        });
        //TODO GET comments by article id and error handlers
      });
    });
  });
});

// describe("ERROR - CONTROLLERS", () => {});

// describe("TYPE OF ERROR - GET", () => {
//   describe("ERROR CODE: 4XX", () => {
//     it("Responds with error message", () => {});
//   });
// });
// describe("/PATH/PARAMETIC_ENDPOINT", () => {
//   describe("POST", () => {
//     it("status: 201, respons with object containing the posted item on the key of [KEY]", () => {
//       // expect send object, responds with object with additional object id
//     });
//   });
//   describe("TYPE OF ERROR - POST", () => {
//     describe("ERROR CODE: 4XX", () => {
//       it("Responds with error message", () => {});
//     });
//   });
//   describe("/PATH/PARAMETRIC_ENDPONT - PATCH", () => {
//     describe("PATCH", () => {
//       it("test", () => {});
//     });
//   });
//   describe("TYPE OF ERROR - PATCH", () => {
//     describe("ERROR CODE: 4XX", () => {
//       it("Responds with error message", () => {});
//     });
//   });
//   describe("/PATH/PARAMETRIC_ENDPONT - DELETE", () => {
//     describe("DELETE", () => {
//       it("test", () => {});
//     });
//   });
//   describe("TYPE OF ERROR - DELETE", () => {
//     describe("ERROR CODE: 4XX", () => {
//       it("Responds with error message", () => {});
//     });
// });
// });
