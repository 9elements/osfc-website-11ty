const { DateTime } = require("luxon");
require("dotenv").config();

module.exports = (value, format = "dd.MM.yyyy") => {
  const dateObject = DateTime.fromISO(value);

  return dateObject.toFormat(format);
};
