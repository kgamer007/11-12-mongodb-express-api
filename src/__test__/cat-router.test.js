'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Cat from '../model/cat';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/cats`;

// this will be a helper function mock out resources to create test items that will actually be in the Mongo database

const createCatMockPromise = () => {
  return new Cat({
    title: 'CATS',
    weight: 20,
    age: 6,
    color: faker.lorem.words(1),
  }).save();
  // .save is a built-in method from mongoose to save/post 
  // a new resource to our actual Mongo database and it returns a promise
};

beforeAll(startServer);
afterAll(stopServer);

// ".remove" is a built-in mongoose schema method 
// that we use to clean up our test database entirely 
// of all the mocks we created so we can start fresh with every test block
afterEach(() => Cat.remove({}));

describe('POST requests to /api/cats', () => {
  test('POST 200 for successful creation of cat', () => {
    const mockCatToPost = {
      title: 'CATS',
      weight: 43,
      age: 2,
      color: faker.lorem.words(1),
    };
    return superagent.post(apiUrl)
      .send(mockCatToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(mockCatToPost.title);
        expect(response.body.age).toEqual(mockCatToPost.age);
        expect(response.body.weight).toEqual(mockCatToPost.weight);
        expect(response.body.color).toEqual(mockCatToPost.color);
        expect(response.body._id).toBeTruthy();
        expect(response.body.createdOn).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });

  test('POST 400 for not sending in a required TITLE property', () => {
    const mockCatToPost = {
      color: faker.lorem.words(50),
    };
    return superagent.post(apiUrl)
      .send(mockCatToPost)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });
});

describe('GET requests to /api/cats', () => {
  test('200 GET for succesful fetching of a cat', () => {
    let mockCatForGet;
    return createCatMockPromise()
      .then((cat) => {
        mockCatForGet = cat;
        // I can return this to the next then block because superagent requests are also promisfied
        return superagent.get(`${apiUrl}/${mockCatForGet._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(mockCatForGet.title);
        expect(response.body.content).toEqual(mockCatForGet.content);
      })
      .catch((err) => {
        throw err;
      });
  });

  test('404 GET: no cat with this id', () => {
    return superagent.get(`${apiUrl}/THISISABADID`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});

describe('PUT request to /api/cats', () => {
  test('200 PUT for successful update of a resource', () => {
    return createCatMockPromise()
      .then((newCat) => {
        return superagent.put(`${apiUrl}/${newCat._id}`)
          .send({ 
            title: 'updated title', 
            age: 4,
            weight: 7,
            color: 'updated color',
          })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('updated title');
            expect(response.body.age).toEqual(4);
            expect(response.body.weight).toEqual(7);
            expect(response.body.color).toEqual('updated color');
            expect(response.body._id.toString()).toEqual(newCat._id.toString());
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  });
});

describe('DELETE requests to api/cats', () => {
  test('204 DELETE for successful deleting of cat', () => {
    let mockCatForDelete;
    return createCatMockPromise()
      .then((cat) => {
        mockCatForDelete = cat;
        return superagent.delete(`${apiUrl}/${mockCatForDelete._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(204);
      })
      .catch();
  });

  test('400 DELETE: no cat with this id', () => {
    return superagent.delete(`${apiUrl}/THISISABADID`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });
});
