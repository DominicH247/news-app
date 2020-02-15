# NC-News Backend

Welcome to NC News! This is the backend repo to NC News' RESTful API, which serves a wide variety of news stories collected and curated by our roving reporters based throughout Leeds and Manchester.

A live example of the RESTful API, and all available endpoints, with example responses can be found at: https://domh-be-nc-news.herokuapp.com/api/

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This project was developed using the following set of dependencies.

Backend framework:

```
Node.js v12.12.1
Express.js v4.17.1
```

Data is stored via:

```
Postgres SQL v7.17.1
```

Seeding and querying is achieved using:

```
Knex.js -postgres v0.20.8
```

Testing suite:

```
mocha.js v7.0.0
chai.js v4.2.0
chai-sorted.js v0.2.0
supertest.js 4.0.2
```

Development:

```
nodemon.js v2.0.2
```

### Installing

The project dependencies are stored in the package.json file.

Install via npm

```
npm install
```

To start the server listening on port 9090:

```
npm run start
```

## Running the tests

The tests have been created using the mocha.js test framework and chai.js assertion library. The npm package, supertest.js, was used for making HTTP requests to the endpoints. The package, chai-sorted, has also been used for testing sort order, for the endpoints which accept an order query.

Separate testing suites have been created for utility functions and for the application as a whole.

To start the test runner, first ensure that the development dependencies hae been installed.

Then seed the test data into the database by running:

```
npm run seed-test
```

To run the utility tests:

```
npm run test-utils
```

To run the application tests:

```
npm run test
```

## Deployment

This application was deployed using heroku. Please see the heroku [getting started guide](https://devcenter.heroku.com/start) for instructions on how to deploy your version of the be-nc-news application onto the web.

## Version

This application is currently at version 1.0.0. For the versions available, see the [tags on this repository](https://github.com/DominicH247/news-app/releases).

## Authors

- **[Dominic Hui](https://github.com/DominicH247)**
