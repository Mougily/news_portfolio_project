# News API

## Background

For this project, an API has been built for the purpose of accessing application data programatically. The intention here has been to mimic the building of a real-world backend service (such as reddit or other social, articles-and-comments-based applications), providing information to the front end architecture.

The database has been created using PSQL, and is interacted with using [node-postgres](https://node-postgres.com/).

## Link to the live hosted app (hosted by Render):

https://news-app-mg2a.onrender.com/api

## Accessing this repository

Firstly, anyone wishing to access this repo, but have a GitHub account and be able to use Git on their local machine.

They must fork this repo on GitHub and clone on their local machine using the terminal or CLI. The command is 'git clone' then copy and paste the forked repo's URL.

## Installing packages and dependancies

In order to run the tests and have access to all the features in this repo, several packages must be installed onto the local machine:

# 1. npm
npm install
# 2. Express 
npm install express
# 3. PostGres - for interfacing with the PostgreSQL database
npm install pg
# 4. dotenv - allows the loading of environment variables
npm install dotenv
# 5. pg-format - for creating dynamic SQL queries and prevent SQL injection
npm install pg-format
# 6. Jest - A JavaScript testing framework
npm install -D jest
# 7. Jest-sorted - extends Jest.expect to allow dev's to specify the order they expect responses to return in tests
npm install --save-dev jest-sorted
# 8. Supertest - allows tests to be run against server endpoints, allowing devs to make test requests and check that the response is what is expected
npm install -D supertest

## Make sure the package.json scripts and jest are updated:

The scripts should look like the below to reflect the setup-dbs & seed files running commands: 

"scripts": {
    "setup-dbs": "psql -f ./db/setup.sql",
    "seed": "node ./db/seeds/run-seed.js",
    "test": "jest" ,
    "prepare": "husky install",
    "start": "node listen.js",
    "seed-prod": "NODE_ENV=production npm run seed"
  }

husky has also been pre-installed to ensure no broken code was committed to this repo.

jest must include extended and jest-sorted, like so: 

"jest": {
    "setupFilesAfterEnv": [
      "jest-extended/all", "jest-sorted"
    ]
  }

## To seed the database in this repo:

Firstly, run the setup.sql file using the git command: npm run setup-dbs then the run-seed.js file must be run using the git command: npm run run-seed

## To run the tests in this repo:

use the git command: npm t

This will run the entire test suite. Tests may also be individually ran, by using .only on individual tests in the code of the run-seed.test.js file

## Accessing the database locally

In order to locally connect to the test database and the dev databases successfully, two files need to be created in the root of the directory - a .env.test file and a .env.development file. Once created, these file names should be added to .gitignore so that they don't get pushed to the repo in github and the databases cannot be viewed publicly.

Inside each of these files, define each environment variable using this format: PGDATABASE=database_name_here (so in the .env.test file it would be the name of the test database and in the .env.development file, it would be the name of the dev database).

To use the environment variables in the project, the user will need to access the dotenv library.

## Minimum versions of Node.js and Postgres need to run this project:
This project has been built using Node.js version v18.12.1 and PostgreSQL version 15.1
