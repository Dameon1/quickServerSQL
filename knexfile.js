'use strict';
//This file is setup to use MySQL and can be swapped out with the PostgrSQL
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
  production: {
    client: 'mysql',
    connection: process.env.DATABASE_URL
  },
  /* If you want to create a test database use this in */
  // test: {
  //   client: 'mysql',
  //   connection: process.env.TEST_DATABASE_URL || {
  //     host : '127.0.0.1',
  //     user : 'root',
  //     password : '',
  //     database : 'test_db'
  //   },
  //   pool: {min:1 , max: 2}
  // },

  /* If you want to use PostgreSQL then uncomment this portion out */

  // development: {
  //   client: 'pg',
  //   //local development server, replace url string with local server string
  //   connection: process.env.DATABASE_URL || '<local development server location string>',
  //   debug: true, // http://knexjs.org/#Installation-debug
  //   pool: { min: 1, max: 2 }
  // },
  // production: {
  //   client: 'pg',
  //   connection: process.env.DATABASE_URL
  // },
  // test: {
  //   client: 'pg',
  //   connection: process.env.TEST_DATABASE_URL || '<local development server location string>',
  //   pool: {min:1 , max: 2}
  // },
  

// TEST_DATABASE_URL=postgres://dev:myPrivatePassword@localhost/noteful-test
};