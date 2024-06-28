import { DateTime } from "luxon";

export const dateFormatFilter = (value, format = "dd.MM.yyyy") => {
  const dateObject = DateTime.fromISO(value);

  return dateObject.toFormat(format);
};
