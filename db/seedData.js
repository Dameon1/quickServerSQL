'use strict';
let knex = require('../knex');
let util = require('util');
let exec = util.promisify(require('child_process').exec);

module.exports = function(file){
    return exec(`mysql test_db < ${file}`)
   
    // For PostgreSQL
   // return exec(`psql -f ${file} -d postgres://postgres:@localhost/test_db`);
};