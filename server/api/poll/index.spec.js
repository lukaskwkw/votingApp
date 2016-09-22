'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var pollCtrlStub = {
  index: 'pollCtrl.index',
  show: 'pollCtrl.show',
  create: 'pollCtrl.create',
  upsert: 'pollCtrl.upsert',
  patch: 'pollCtrl.patch',
  destroy: 'pollCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var pollIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './poll.controller': pollCtrlStub
});

describe('Poll API Router:', function() {
  it('should return an express router instance', function() {
    pollIndex.should.equal(routerStub);
  });

  describe('GET /api/polls', function() {
    it('should route to poll.controller.index', function() {
      routerStub.get
        .withArgs('/', 'pollCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/polls/:id', function() {
    it('should route to poll.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'pollCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/polls', function() {
    it('should route to poll.controller.create', function() {
      routerStub.post
        .withArgs('/', 'pollCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/polls/:id', function() {
    it('should route to poll.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'pollCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/polls/:id', function() {
    it('should route to poll.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'pollCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/polls/:id', function() {
    it('should route to poll.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'pollCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
