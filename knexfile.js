'use strict';
//This file is setup to use for MySQL and can be swapped out with the PostgrSQL
module.exports = {
  development: {    
      client: 'mysql',
      //local development server
      connection: {
        host : '127.0.0.1',
        user : 'root',
        password : '',
        //database name
        database : 'test_db'
      }    
  },
  production: {
    client: 'mysql',
    connection: process.env.DATABASE_URL
  },
  test: {
    client: 'mysql',
    connection: process.env.TEST_DATABASE_URL || {
      host : '127.0.0.1',
      user : 'root',
      password : '',
      database : 'test_db'
    },
    pool: {min:1 , max: 2}
  },
  developmentPostgres: {
    client: 'pg',
    //local development server, replace url string with local server string
    connection: process.env.DATABASE_URL || '<local development server location string>',
    debug: true, // http://knexjs.org/#Installation-debug
    pool: { min: 1, max: 2 }
  },
  productionPostgres: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  testPostgres: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL || 'postgres://postgres:@localhost/noteful-test',
    pool: {min:1 , max: 2}
  },
  
};
// TEST_DATABASE_URL=postgres://dev:myPrivatePassword@localhost/noteful-test
