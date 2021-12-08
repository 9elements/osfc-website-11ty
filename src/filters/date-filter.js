const { DateTime } = require("luxon");

module.exports = (value) => {
  const dateObject = DateTime.fromISO(value);
  return `${dateObject.toLocaleString({
    weekday: "long",
    month: "short",
    day: "2-digit",
  })}`;
};
