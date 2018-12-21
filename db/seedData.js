'use strict';
let knex = require('../knex');
let util = require('util');
let exec = util.promisify(require('child_process').exec());
//let exec = Promise.resolve(require('child_process').exec);

module.exports = function(file){
    return exec(`mysql test_db < ${file}`)
   // return exec(`psql -f ${file} -d postgres://postgres:@localhost/noteful-test`);
};