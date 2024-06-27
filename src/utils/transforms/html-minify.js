import htmlmin from "html-minifier";

export const htmlMinify = (value, outputPath) => {
  if (outputPath && outputPath.endsWith(".njk")) {
    return htmlmin.minify(value, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJs: true,
    });
  }

  return value;
};
