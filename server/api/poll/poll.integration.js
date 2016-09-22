'use strict';

var app = require('../..');
import request from 'supertest';
import data from './fixtures/poll.data.js';

var newPoll;

describe('Poll API:', function() {
  describe('GET /api/polls', function() {
    var polls;

    beforeEach(function(done) {
      request(app)
        .get('/api/polls')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          polls = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      polls.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/polls', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/polls')
        .send(data[0])
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPoll = res.body;
          done();
        });
    });

    it('should respond with the newly created poll', function() {
      newPoll.category.should.equal('Tech');
      newPoll.question.should.equal('What is your favorite digital camera brand?');
    });
  });

  describe('GET /api/polls/:id', function() {
    var poll;

    beforeEach(function(done) {
      request(app)
        .get(`/api/polls/${newPoll._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          poll = res.body;
          done();
        });
    });

    afterEach(function() {
      poll = {};
    });

    it('should respond with the requested poll', function() {
      poll.category.should.equal('Tech');
      poll.question.should.equal('What is your favorite digital camera brand?');
    });
  });

  describe('PUT /api/polls/:id', function() {
    var updatedPoll;

    beforeEach(function(done) {
      request(app)
        .put(`/api/polls/${newPoll._id}`)
        .send(data[1])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPoll = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPoll = {};
    });

    it('should respond with the original poll', function() {
      updatedPoll.category.should.equal('Tech');
      updatedPoll.question.should.equal('What is your favorite digital camera brand?');
    });

    it('should respond with the updated poll on a subsequent GET', function(done) {
      request(app)
        .get(`/api/polls/${newPoll._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let poll = res.body;

          poll.category.should.equal('Live');
          poll.question.should.equal('What\'s your favorite coffee drink?');

          done();
        });
    });
  });

  describe('PATCH /api/polls/:id', function() {
    var patchedPoll;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/polls/${newPoll._id}`)
        .send([{
          op: 'replace',
          path: '/question',
          value: 'Patched Poll'
        }, {
          op: 'replace',
          path: '/choices/0',
          value: {
            text: 'Patched!!!',
            votes: [{
              userId: '000000000'
            }, {
              userId: '000000000'
            }, {
              userId: '000000000'
            }]
          }
        }])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPoll = res.body;
          console.log(patchedPoll);
          done();
        });
    });

    afterEach(function() {
      patchedPoll = {};
    });

    it('should respond with the patched poll', function() {
      patchedPoll.question.should.equal('Patched Poll');
      patchedPoll.choices[0].text.should.equal('Patched!!!');
    });
  });

  describe('DELETE /api/polls/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/polls/${newPoll._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when poll does not exist', function(done) {
      request(app)
        .delete(`/api/polls/${newPoll._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
