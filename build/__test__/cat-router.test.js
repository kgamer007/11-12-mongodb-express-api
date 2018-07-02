'use strict';

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _cat = require('../model/cat');

var _cat2 = _interopRequireDefault(_cat);

var _server = require('../lib/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT + '/api/cats';

// this will be a helper function mock out resources to create test items that will actually be in the Mongo database

var createCatMockPromise = function createCatMockPromise() {
  return new _cat2.default({
    title: 'CATS',
    weight: 20,
    age: 6,
    color: _faker2.default.lorem.words(1)
  }).save();
  // .save is a built-in method from mongoose to save/post 
  // a new resource to our actual Mongo database and it returns a promise
};

beforeAll(_server.startServer);
afterAll(_server.stopServer);

// ".remove" is a built-in mongoose schema method 
// that we use to clean up our test database entirely 
// of all the mocks we created so we can start fresh with every test block
afterEach(function () {
  return _cat2.default.remove({});
});

describe('POST requests to /api/cats', function () {
  test('POST 200 for successful creation of cat', function () {
    var mockCatToPost = {
      title: 'CATS',
      weight: 43,
      age: 2,
      color: _faker2.default.lorem.words(1)
    };
    return _superagent2.default.post(apiUrl).send(mockCatToPost).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.title).toEqual(mockCatToPost.title);
      expect(response.body.age).toEqual(mockCatToPost.age);
      expect(response.body.weight).toEqual(mockCatToPost.weight);
      expect(response.body.color).toEqual(mockCatToPost.color);
      expect(response.body._id).toBeTruthy();
      expect(response.body.createdOn).toBeTruthy();
    }).catch(function (err) {
      throw err;
    });
  });

  test('POST 400 for not sending in a required TITLE property', function () {
    var mockCatToPost = {
      color: _faker2.default.lorem.words(50)
    };
    return _superagent2.default.post(apiUrl).send(mockCatToPost).then(function (response) {
      throw response;
    }).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });
});

describe('GET requests to /api/cats', function () {
  test('200 GET for succesful fetching of a cat', function () {
    var mockCatForGet = void 0;
    return createCatMockPromise().then(function (cat) {
      mockCatForGet = cat;
      // I can return this to the next then block because superagent requests are also promisfied
      return _superagent2.default.get(apiUrl + '/' + mockCatForGet._id);
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.title).toEqual(mockCatForGet.title);
      expect(response.body.content).toEqual(mockCatForGet.content);
    }).catch(function (err) {
      throw err;
    });
  });

  test('404 GET: no cat with this id', function () {
    return _superagent2.default.get(apiUrl + '/THISISABADID').then(function (response) {
      throw response;
    }).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});

describe('PUT request to /api/cats', function () {
  test('200 PUT for successful update of a resource', function () {
    return createCatMockPromise().then(function (newCat) {
      return _superagent2.default.put(apiUrl + '/' + newCat._id).send({
        title: 'updated title',
        age: 4,
        weight: 7,
        color: 'updated color'
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual('updated title');
        expect(response.body.age).toEqual(4);
        expect(response.body.weight).toEqual(7);
        expect(response.body.color).toEqual('updated color');
        expect(response.body._id.toString()).toEqual(newCat._id.toString());
      }).catch(function (err) {
        throw err;
      });
    }).catch(function (err) {
      throw err;
    });
  });
});

describe('DELETE requests to api/cats', function () {
  test('204 DELETE for successful deleting of cat', function () {
    var mockCatForDelete = void 0;
    return createCatMockPromise().then(function (cat) {
      mockCatForDelete = cat;
      return _superagent2.default.delete(apiUrl + '/' + mockCatForDelete._id);
    }).then(function (response) {
      expect(response.status).toEqual(204);
    }).catch();
  });

  test('400 DELETE: no cat with this id', function () {
    return _superagent2.default.delete(apiUrl + '/THISISABADID').then(function (response) {
      throw response;
    }).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });
});