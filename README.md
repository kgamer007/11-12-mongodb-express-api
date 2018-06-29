# Lab 11-12 MongoDB Express API

## Travis Badge


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
