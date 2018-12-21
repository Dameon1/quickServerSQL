'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');
const seedData = require('../db/seedData');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Noteful App', function () {

  beforeEach(function () {
    return seedData('./db/noteful.sql');
  });

  after(function () {
    //return knex.destroy(); // destroy the connection
  });

  

  describe('GET /api/tags', function () {
    it('should return the default of 3 tags ', function () {
      let count;
      return knex.count()
        .from('tags')
        .then(([result]) => {
          count = result['count(*)'];
          return chai.request(app).get('/api/tags');
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(count);
        });
    });

    it('should return a list with the correct right fields', function () {
    
      let res;
      return chai.request(app)
        .get('/api/tags')
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(3);
        
          res.body.forEach(function (item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'name');
          }); 
          return knex('tags').select();
        }).then(function(data) {
          expect(res.body[0].id).to.equal(data[0].id);
        });
          
    });


    it('should return correct search results for a valid query', function () {
      let res;
      return chai.request(app).get('/api/tags?searchTerm=firstTag')
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          //expect(res.body[0]).to.have.length(1);
          expect(res.body[0]).to.be.an('object');
          return knex.select().from('tags').where('name', 'like', '%firstTag%');
        })
        .then(data => {
          expect(res.body[0].id).to.equal(data[0].id);
        });
    });

    it('should return an empty array for an incorrect query', function () {
    
      return chai.request(app)
        .get('/api/tags?searchTerm=Not%20a%20Valid%20Search')
        .then(function (res) {
        
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          //expect(res.body).to.have.length(0);
          return knex.select().from('tags').where('name', 'like','Not%20a%20Valid%20Search');
        }).then(function(data){
          expect(data).to.have.length(0);
        });
    });

  });

  describe('GET /api/tags/:id', function () {
 
    it('should return correct tags', function () {

      const dataPromise = knex.first()
        .from('tags')
        .where('id', 1);

      const apiPromise = chai.request(app)
        .get('/api/tags/1');

      return Promise.all([dataPromise, apiPromise])
        .then(function ([data, res]) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'name');
          expect(res.body.id).to.equal(1);
          //expect(res.body.name).to.equal(data.name);
          return knex('tags').select().where({id:1})
            .then(function(results){
              expect(results).to.have.length(1);
            });
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      return chai.request(app)
        .get('/DOES/NOT/EXIST')
        .then(res => {
          expect(res).to.have.status(404);
          return knex('tags').select().where({id:999})
            .then(function(results){
              expect(results).to.have.length(0);
            });
        });
    });

  });

  describe('POST /api/tags', function () {

    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'name':'me'
      };
      let body;
      return chai.request(app)
        .post('/api/tags')
        .send(newItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('id', 'name');
          return knex.select().from('tags').where('id', body.id);
        })
        .then(([data]) => {
          expect(body.name).to.equal(data.name);
          expect(body.id).to.equal(data.id);
        });
    });

    it('should return an error when missing "name" field', function () {
      const newItem = {
        'foo': 'bar'
      };
    
      return chai.request(app)
        .post('/api/tags')
        .send(newItem)
        .then(res => {
        
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `name` in request body');
          return knex('tags').select().where({id : 1012})
            .then(function(results){
              expect(results).to.have.length(0);
            });
        });
   
    });

  });

  describe('PUT /api/tags/:id', function () {

    it('should update the tag', function () {
      const updateItem = {
        'name':'dogs'
      };
      return chai.request(app)
        .put('/api/tags/1')
        .send(updateItem)
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.include.keys('id', 'name');
          expect(res.body[0].id).to.equal(1);
          expect(res.body[0].name).to.equal(updateItem.name);
          expect(res.body.content).to.equal(updateItem.content);
          return knex('tags').select().where({id:1})
            .then(function(results){
              expect(results).to.have.length(1);
            });
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      const updateItem = {
        'title': 'What about dogs?!',
        'content': 'woof woof'
      };
      return chai.request(app)
        .put('/DOES/NOT/EXIST')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(404);
          return knex('tags').select().where({id:999})
            .then(function(results){
              expect(results).to.have.length(0);
            });
        });
    });

    it('should return an error when missing "name" field', function () {
      const updateItem = {
        'foo': 'bar'
      };
      return chai.request(app)
        .put('/api/tags/1')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `name` in request body');
          return knex('tags').select().where({id:1999})
            .then(function(results){
              expect(results).to.have.length(0);
            });
        });
    });

  });

  describe('DELETE  /api/tags/:id', function () {

    it('should delete an item by id', function () {
      return chai.request(app)
        .delete('/api/tags/1005')
        .then(function (res) {
          expect(res).to.have.status(204);
          return knex('tags').select().where({id:1005})
            .then(function(results){
              expect(results).to.have.length(0);
            });
        });
    });

  });

});
