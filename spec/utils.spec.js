const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates take an array (list) of objects and return a new array. Each item in the new array must have its timestamp converted into a Javascript date object.", () => {
  it("Single object within the array", () => {
    const testData = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];

    const testOutput = formatDates(testData);
    console.log(testOutput, " test");

    expect(testOutput[0].created_at).to.be.a("date");
  });
  it("Multiple objects within the array", () => {
    const testData = [
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: 280844514171
      },
      {
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 154700514171
      }
    ];

    const testOutput = formatDates(testData);

    expect(testOutput[0].created_at).to.be.a("date");
    expect(testOutput[1].created_at).to.be.a("date");
  });
  it("check original input has not been mutated", () => {
    const testData = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];

    formatDates(testData);

    expect(testData).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
