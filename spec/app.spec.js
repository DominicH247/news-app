//set test environment
process.env.NODE_ENV = "test";

const request = require("supertest");
const connection = require("../db/connection.js");
const app = require("../app.js");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
chai.use(chaiSorted);

// end db connection after every test
after(() => {
  return connection.destroy();
});

describe("/api", () => {
  describe("/topics", () => {
    describe("GET", () => {
      it.only("status: 200, responds with an object with an array of objects, nesteted within, on the key of topics", () => {
        // expect array

        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.a("array");
          });

        // expect length of array = length of database
        // expect on of the object within array to have all correct keys
      });
      describe("/PATH/BY_ID", () => {
        it("TEST", () => {});
      });
      describe("/PATH/QUERY", () => {
        it("TEST", () => {});
      });
      describe("TYPE OF ERROR - GET", () => {
        describe("ERROR CODE: 4XX", () => {
          it("Responds with error message", () => {});
        });
      });
      describe("/PATH/PARAMETIC_ENDPOINT", () => {
        describe("POST", () => {
          it("status: 201, respons with object containing the posted item on the key of [KEY]", () => {
            // expect send object, responds with object with additional object id
          });
        });
        describe("TYPE OF ERROR - POST", () => {
          describe("ERROR CODE: 4XX", () => {
            it("Responds with error message", () => {});
          });
        });
        describe("/PATH/PARAMETRIC_ENDPONT - PATCH", () => {
          describe("PATCH", () => {
            it("test", () => {});
          });
        });
        describe("TYPE OF ERROR - PATCH", () => {
          describe("ERROR CODE: 4XX", () => {
            it("Responds with error message", () => {});
          });
        });
        describe("/PATH/PARAMETRIC_ENDPONT - DELETE", () => {
          describe("DELETE", () => {
            it("test", () => {});
          });
        });
        describe("TYPE OF ERROR - DELETE", () => {
          describe("ERROR CODE: 4XX", () => {
            it("Responds with error message", () => {});
          });
        });
      });
    });
  });
});

describe("ERROR - CONTROLLERS", () => {});
