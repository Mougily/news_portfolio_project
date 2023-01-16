# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Accessing the database locally 

In order to locally connect to the test database and the dev databases successfully, two files need to be created in the root of the directory - a .env.test file and a .env.development file. Once created, these file names should be added to .gitignore so that they don't get pushed to the repo in github and the databases cannot be viewd publicly.

Inside each of these files, define each environment variable using this format: PGDATABASE=database_name_here (so in the .env.test file it would be the name of the test database and in the .env.development file, it would be the name of the dev database).

To use the environment variables in the project, the user will need to access the dotenv library.
