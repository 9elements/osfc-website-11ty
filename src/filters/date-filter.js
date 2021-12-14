const { DateTime } = require("luxon");

module.exports = (
  value,
  month = "short",
  weekday = "long",
  day = "2-digit"
) => {
  const dateObject = DateTime.fromISO(value);
  return `${dateObject.toLocaleString({
    weekday: weekday,
    month: month,
    day: day,
  })}`;
};
