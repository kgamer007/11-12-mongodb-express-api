'use strict';

import mongoose from 'mongoose';

const catSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    minlength: 0,
  },
  weight: {
    type: Number,
  },
  color: {
    type: String,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
});

// Ran into a bug coding this, followed instructions on this stackoverflow page:
// https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles
// the first arg of mongoose.model is the name of your collection
const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('cats', catSchema, 'cats', skipInit);
