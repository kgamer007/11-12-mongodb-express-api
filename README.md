# Lab 11-12 MongoDB Express API

## Travis Badge


## My api includes cats, here are there stats
```
Dinosaur {
  _id: a unique id that is created on instantiation
  name: string (required)
  species: string (optional)
  eatsMeat: boolean (optional)
  eatsPlants: boolean (optional)
}
```

## API Endpoints
POST api/dinosaur
```
  // example post request body
  request.body: {
    name: 'Little Foot',
    species: 'Long Neck',
    eatsMeat: false,
    eatsPlants: true,
}
```

GET api/dinosaur?id={dino_id}
```
// example endpoint to get dinosaur # 123
api/dinosaur?id=123
```

DELETE api/dinosaur?id={dino_id}
```
// example endpoint to delete dinosaur # 123
api/dinosaur?id=123
```

PUT api/dinosaurs?id={dino_id}
```
// example endpoint to delete dinosaur # 123
api/dinosaur?id=123
```