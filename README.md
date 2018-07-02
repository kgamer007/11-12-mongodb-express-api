# Lab 11-12 MongoDB Express API

## Deployment
https://express-middleware-11-12.herokuapp.com/

## Travis Badge
[![Build Status](https://travis-ci.org/kgamer007/11-12-mongodb-express-api.svg?branch=master)](https://travis-ci.org/kgamer007/11-12-mongodb-express-api)

## My api includes cats, here are there stats
```
  _id: a unique id that is created on instantiation
  color: string (optional)
  weight: string (optional)
  age: string (optional)
}
```

## API Endpoints
POST api/cat
    name: 'anything',
    color: 'blue',
    weight: 'some number',
    age: '10'

GET api/cat?id={cat_id}

DELETE api/cat?id={cat_id}

PUT api/cat?id={cat_id}
