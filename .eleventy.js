//const sortByDisplayOrder = require("./src/utils/sort-by-display-order.js");

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");
const markdownFilter = require("./src/filters/markdown-filter.js");
const slugify = require("./src/filters/slugify.js");

// Transforms
const htmlMinTransform = require("./src/transforms/html-min-transform.js");
//const imagemin = require("gulp-imagemin");

// Create a helpful production flag
const isProduction = process.env.NODE_ENV === "production";

module.exports = (config) => {
  // Set directories to pass through to the dist folder
  config.addPassthroughCopy("./src/images/");
  config.addPassthroughCopy("./src/scripts/");
  config.addPassthroughCopy("./src/fonts/");

  // Add filters
  config.addFilter("dateFilter", dateFilter);
  config.addFilter("w3DateFilter", w3DateFilter);
  config.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });
  config.addFilter("markdownFilter", markdownFilter);
  config.addFilter("slugify", slugify);

  // Shortcodes
  config.addShortcode("a11yIcon", function (a11yIcon) {
    let width = "width='30'";
    let height = "height='30'";
    if (a11yIcon.width) {
      width = "width='" + a11yIcon.width + "'";
      height = "height='" + a11yIcon.width + "'";
    }
    return `<svg class="${a11yIcon.class}" ${width} ${height} aria-hidden="true" focusable="false"><use xlink:href="/icons/icons.svg#${a11yIcon.icon}"/><span class="sr-only">${a11yIcon.alt}</span></svg>
    `;
  });

  config.addShortcode("avatar", require("./src/shortcodes/avatar.js"));

  // Only minify HTML if we are in production because it slows builds _right_ down
  if (isProduction) {
    config.addTransform("htmlmin", htmlMinTransform);
  }

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
