# 11ty Boilerplate

## Get started

Ensure you have **[Node.js](https://nodejs.org/) version 20 or higher** installed. This is required to properly run the project.

Create an `.env` file in the root of the project and set the `LOCALE` variable, which is necessary for the date filter functionality. For example, you would add `LOCALE=en-US` to your `.env` file.

With your `.env` file configured, proceed with setting up the project:

1. Install dependencies with `npm install`.
2. Start the development server with `npm run start`.

## Production build

For production builds, execute `npm run production`, which includes:

- Minification of HTML.
- CSS purge (all CSS is purged and then added inline).

To test the production build locally, run `npm run start-production`. This sets `NODE_ENV=production` and allows you to test HTML minification and CSS purging on your development server.

<hr />

## CSS and Styling

For CSS, we use [PostCSS](https://postcss.org/) with a custom configuration that includes Tailwind CSS and a few other plugins. All CSS files reside in the `src/assets/css` directory. The main CSS file is `global.css`, which orchestrates the inclusion of all our styles.

PostCSS allows us to use modern CSS features like nesting and to write future-proof CSS. It also enables us to use a variety of plugins to optimize our styles. In the end, all CSS is transformed to vanilla CSS that is compatible with the browsers defined in our `browserslist` object in the `package.json` file.

### Architecture

Inside the `blocks`, `layout` and `utilites` folders, you can place your globally available classes.
All those are automatically imported into `global.css` via `@import-glob`, as long they reside there and start with an underscore. The CSS you write is sorted via Cascade Layers. This way, utilities may easily override layout styles, but block/component styles have the last word.

### Utility classes & design tokens

For generating basic utility classes, we utilize [Tailwind](https://tailwindcss.com/) in stripped down way. Basically, every utility is disabled, and we only enable the ones we need. By default, these are text & background colors, font family, font sizes, font weights, line height and stacks.

### Creating new utilities

> **As an example, we will create a new utility class for letter-spacing.**

#### 1. Create a new file in `assets/design-tokens` called `letter-spacing.js`.

#### 2. Add your key-value pairs to the file.

You may also import and use js functions like `interpolate` or `calculateTypeScale` from `utopia-core`

```js
export const letterSpacing = {
  tight: "-0.05em",
  normal: "0",
  wide: "0.05em",
};
```

#### 3. Import your object in `tailwind.config.js` and apply it to the `letterSpacing` key in the `theme` object.:

New design tokens need to be applied to Tailwind's reserved keys, you can look up the key in the [Tailwind CSS documentation](https://tailwindcss.com/docs/theme).

```js
import { letterSpacing } from "./src/design-tokens/letter-spacing.js";

export default {
  ...
  theme: {
    ...
    letterSpacing: letterSpacing
  }
}
```

#### 4. Enable the utility in `tailwind.config.js` by adding it to the `corePlugins` array:

```js
export default {
  ...
  corePlugins: [
    ...
    "letterSpacing"
  ]
}
```

#### 5. Generate CSS Custom Properties from your design tokens. (Optional, but recommended)

This way, you can also use your design tokens without using utility classes.

In the plugins array of `tailwind.config.js`, add the following to `groups` array the first `plugin` function:

```js
const groups = [
  ...,
  { key: "letterSpacing", prefix: "tracking" }
];
```

The `key` property is the key of the Tailwind theme object, and the `prefix` property is any string you want to prefix your Custom Properties with:

```css
/* Output */
:root {
  --tracking-tight: -0.05em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
}
```

### Using media queries

For media queries, we use [custom media queries](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media) that are defined in `src/assets/css/_media.css`.

```css
/* src/assets/css/_media.css */
@custom-media --sm (width >= 25em);
@custom-media --md (width >= 40em);
```

You can use these media queries in your CSS like this:

```css
.my-class {
  color: red;

  @media (--sm) {
    color: blue;
  }
}
```

### CSS Purge Safelist

In production mode, all CSS is purged to remove any unused classes. If however, there are specific classes that should not be purged during the production build process, like dynamically added classes, they can be added to a safelist. To manage this safelist, edit the file `utils/transforms/css-purge-inline.js`.

<hr />

## Client-side JavaScript

All JavaScript files reside in the `src/assets/scripts` directory.
For Client-side Javascript bundling, we use [esbuild](https://esbuild.github.io/). This allows us to install and use npm packages in our client-side JavaScript files:

```js
// Import functions from npm packages
import { myFunction } from "my-npm-package";

// Import functions from other files
import { myOtherFunction } from "./my-other-file.js";

// Import other files as whole
import "other-directory/my-other-file.js";
```

For embedding JavaScript from the directory in your Nunjucks templates, use the following shortcode:

```twig
{% script src="my-file.js" %}
{% script src="other-directory/my-file.js" %}
```

## Global utilites (filters, shortcodes, etc.)

We have a few global utilities like nunjucks filters, or global filters or shortcodes. They are all located in the `src/utils` directory.

For example, to use the `readableDate` filter in your Nunjucks templates:

```twig
{{ sampleDate | readableDate({ month: "short", day: "numeric" }) }}
```

Ensure that `LOCALE` is defined in your `.env` file to display dates in the correct language.

<hr />

## SVG Icons

SVG icons should be placed in the `src/icons` directory. A single combined icon file will be generated from these icons, allowing you to reference them easily throughout your project. We have implemented a shortcode for embedding these SVG icons that requires the `icon` property. The `alt` text and `width` attributes are optional but recommended for accessibility and layout purposes.

Here's how to use the shortcode to insert an SVG icon:

```twig
{% icon icon="github", alt="Github", width="2rem" %}
```

This shortcode will insert the GitHub icon with an alternative text "Github" and a width of 2 rem.

<hr />

## Webfonts

For webfonts, a different approach is taken:

- Place font files in the `src/fonts` folder.
- Include font-face declarations and preloading instructions in the `font.css` file, which is also located in the `src/fonts` folder.

This separation ensures that font styling is managed independently from other styles, optimizing loading times and maintainability.

<hr />

## How to archive a year

1. Copy `archive.md` from the previous year inside `src/pages/{year}`
2. Inside `src/_data/years.json`, add the year to the array of `years` and increment `currentYear` by one
3. Inside `src/_data/navigation.json`, adjust the year inside the `url` path of the link to the archive. You can update/remove the other nav items as you like.
