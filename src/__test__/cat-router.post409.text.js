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
};

beforeAll(startServer);
afterAll(stopServer);

afterEach(() => Cat.remove({}));

describe('POST requests to /api/cats', () => {
  test('POST 409 for duplicate key', () => {
    return createCatMockPromise()
      .then((newCat) => {
        return superagent.post(apiUrl)
          .send({ title: newCat.title })
          .then((response) => {
            throw response;
          })
          .catch((err) => {
            expect(err.status).toEqual(409);
          });
      })
      .catch((err) => {
        throw err;
      });
  });
});
