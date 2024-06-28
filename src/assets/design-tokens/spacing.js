// import { calculateSpaceScale } from "utopia-core";

import { interpolate } from "../../utils/css/interpolate";

/**
 * Define your spacing scale here
 * You can use the `calculateSpaceScale` function from `utopia-core` to generate a scale, visually customizable on https://utopia.fyi/space/calculator/ and copyable to your project in the "PostCSS" tab on the site
 * Or you can write your own scale manually with the `interpolate` function
 */
const spaceBaseSize = 16;
const rem = (px) => `${px / spaceBaseSize}rem`;

export const spacingPx = {
  100: 2,
  200: 10,
  300: 14,
  400: 16,
  500: 18,
  600: 24,
  700: 32,
  800: 44,
  900: 72,
  major: 112,
};

export const spacing = Object.keys(spacingPx).reduce(
  (obj, key) => ({
    ...obj,
    ...{ [key]: rem(spacingPx[key]) },
  }),
  {}
);
/**
 * Example of using `calculateSpaceScale` to generate a scale
 */

// const spaceScale = calculateSpaceScale({
//   minWidth: 320,
//   maxWidth: 1140,
//   minSize: 16,
//   maxSize: 20,
//   positiveSteps: [1.5, 2, 3, 4, 6],
//   negativeSteps: [0.75, 0.5, 0.25],
//   // customSizes: ["m-xl"],
//   prefix: "space",
// });

// export const spacing = [
//   ...spaceScale.sizes,
//   ...spaceScale.oneUpPairs,
//   ...spaceScale.customPairs,
// ].reduce(
//   (obj, item) => ({
//     ...obj,
//     ...{ [item.label]: item.clamp },
//   }),
//   {}
// );
