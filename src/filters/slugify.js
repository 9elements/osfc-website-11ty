const string = require("string");

module.exports = function (input) {
  if (!input) return false;
  else return string(input).slugify().toString();
};
