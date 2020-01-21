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

describe("makeRefObj should be able to take an array (list) of objects and return a reference object. The reference object must be keyed by each item's title, with the values being each item's corresponding id", () => {
  it("single item in the array", () => {
    const testData = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];

    const testOutput = {
      "Living in the shadow of a great man": 1
    };

    expect(makeRefObj(testData)).to.eql(testOutput);
  });
  it("More than one item in the array", () => {
    const testData = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];

    const testOutput = {
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 3
    };

    expect(makeRefObj(testData)).to.eql(testOutput);
  });
  it("original input is not mutated", () => {
    const testData = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];

    makeRefObj(testData);
    expect(testData).to.eql([
      {
        article_id: 1,
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

describe("formatComments utility function should be able to take an array of comment objects (comments) and a reference object, and return a new array of formatted comments.", () => {
  it("for single comment within the array", () => {
    const testData = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];

    const testRefObj = {
      "They're not exactly dogs, are they?": 9
    };

    const formattedDate = new Date(1511354163389);

    const testOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: "butter_bridge",
        votes: 16,
        created_at: formattedDate
      }
    ];

    const test = formatComments(testData, testRefObj);

    expect(formatComments(testData, testRefObj)).to.eql(testOutput);
  });
  it("Multiple inputs within the array", () => {
    const testData = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];

    const testRefObj = {
      "They're not exactly dogs, are they?": 9,
      "Living in the shadow of a great man": 1
    };

    const testOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ];

    expect(formatComments(testData, testRefObj)).to.eql(testOutput);
  });
  it("check no mutations", () => {
    const testData = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];

    const testRefObj = {
      "They're not exactly dogs, are they?": 9
    };

    formatComments(testData, testRefObj);
    expect(testData).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
});
