'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var catSchema = _mongoose2.default.Schema({
  title: {
    type: String,
    unique: true
  },
  age: {
    type: Number,
    minlength: 0
  },
  weight: {
    type: Number
  },
  color: {
    type: String,
    unique: true
  },
  createdOn: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});

// Ran into a bug coding this, followed instructions on this stackoverflow page:
// https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles
// the first arg of mongoose.model is the name of your collection
var skipInit = process.env.NODE_ENV === 'development';
exports.default = _mongoose2.default.model('cats', catSchema, 'cats', skipInit);