const markdownIt = require("markdown-it")({
  html: false,
  breaks: true,
  linkify: true,
});

module.exports = function markdown(value) {
  return markdownIt.render(value);
};
