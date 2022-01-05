const slugify = require("../filters/slugify");

module.exports = (speaker, year) =>
  `/images/generated/speakers/${slugify(speaker.name)}-${code}.webp`;
