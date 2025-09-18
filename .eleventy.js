// @ts-check

// Filters
import { markdownFilter } from "./src/utils/filters/markdown.js";
import { readableDateFilter } from "./src/utils/filters/readable-date.js";
import { toISODate } from "./src/utils/filters/to-iso-date.js";
import { dateFormatFilter } from "./src/utils/filters/date-format.js";

// Plugins
import fs from "node:fs";
import svgSprite from "eleventy-plugin-svg-sprite";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

// Transforms
import { purgeCSS } from "./src/utils/transforms/css-purge-inline.js";
import { htmlMinify } from "./src/utils/transforms/html-minify.js";

// Shortcodes
import { iconShortcode } from "./src/utils/shortcodes/icon.js";
import { scriptShortcode } from "./src/utils/shortcodes/script.js";
import { avatarShortcode } from "./src/utils/shortcodes/avatar.js";

// Other
import buildSystem from "@cagov/11ty-build-system";
import { globPlugin } from "esbuild-plugin-glob";
import path from "path";

// Get the current directory
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a helpful production flag
const isProduction = process.env.NODE_ENV === "production";

/** @param {import("./node_modules/@11ty/eleventy/src/UserConfig.js").default} config */
export default function EleventyConfig(config) {
  const cssDir = path.join(__dirname, "/dist/assets/css/");
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, {
      recursive: true,
    });
  }

  config.setServerOptions({
    watch: ["dist/assets/css/**/*.css"],
  });

  // config.addWatchTarget("./dist/assets/css/");

  // Set directories to pass through to the dist folder
  config.addPassthroughCopy("./src/assets/images/");
  config.addPassthroughCopy("./src/assets/video/");
  config.addPassthroughCopy("./src/assets/fonts/");

  // Add filters
  config.addFilter("readableDate", readableDateFilter);
  config.addFilter("toISODate", toISODate);
  config.addFilter("dateFormat", dateFormatFilter);
  config.addFilter("markdownFilter", markdownFilter);
  config.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  // Add Shortcodes
  config.addShortcode("icon", iconShortcode);
  config.addShortcode("script", scriptShortcode);
  config.addShortcode("avatar", avatarShortcode);

  // Plugins
  config.addPlugin(svgSprite, {
    path: "./src/assets/icons", // relative path to SVG directory
    outputFilepath: "./dist/assets/icons.svg",
  });

  config.addPlugin(eleventyImageTransformPlugin, {
    // which file extensions to process
    extensions: "html",

    outputDir: "./dist/assets/images/",
    urlPath: "/assets/images/",

    // Add any other Image utility options here:

    // optional, output image formats
    formats: ["webp"],

    // optional, output image widths
    widths: ["auto"],
    sizes: "(max-width: 600px) 100vw, 50vw", // Responsive sizes

    // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  });

  config.addPlugin(buildSystem, {
    processors: {
      esbuild: {
        watch: ["src/assets/scripts/**/*"],
        options: {
          entryPoints: [path.resolve(__dirname, "src/assets/scripts/**/*")],
          bundle: true,
          minify: isProduction,
          outdir: "dist/assets/scripts",
          splitting: true,
          format: "esm",
          plugins: [globPlugin()],
        },
      },
      postcss: {
        file: "postcss.config.cjs",
        watch: [
          "src/assets/css/**/*",
          "src/assets/design-tokens/**/*",
          "tailwind.config.js",
          "node_modules/tailwindcss/*.css",
          "src/**/*.njk",
        ],
      },
    },
  });

  // Only minify HTML if we are in production because it slows builds _right_ down
  if (isProduction) {
    config.addTransform("htmlmin", htmlMinify);
    config.addTransform("purgeCSS", purgeCSS);
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
}
