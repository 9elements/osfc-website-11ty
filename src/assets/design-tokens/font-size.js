// import { calculateTypeScale } from "utopia-core";
import { interpolate } from "../../utils/css/interpolate";
import { spacing, spacingPx } from "./spacing";

/**
 * Define your font-size scale here
 * You can use the `calculateTypeScale` function from `utopia-core` to generate a scale, visually customizable on https://utopia.fyi/type/calculator/ and copyable to your project in the "PostCSS" tab on the site
 */
export const fontSize = {
  ...spacing,
  "200-300": interpolate({ min: spacingPx[200], max: spacingPx[300] }),
  "300-400": interpolate({ min: spacingPx[300], max: spacingPx[400] }),
  "400-500": interpolate({ min: spacingPx[400], max: spacingPx[500] }),
  "500-600": interpolate({ min: spacingPx[500], max: spacingPx[600] }),
  "600-700": interpolate({ min: spacingPx[600], max: spacingPx[700] }),
  "700-800": interpolate({ min: spacingPx[700], max: spacingPx[800] }),
  "800-900": interpolate({ min: spacingPx[800], max: spacingPx[900] }),
  "800-major": interpolate({ min: spacingPx[800], max: spacingPx.major }),
};

/**
 * Example of using `calculateTypeScale` to generate a scale
 */

// calculateTypeScale({
//   minWidth: 320,
//   maxWidth: 1140,
//   minFontSize: 16,
//   maxFontSize: 20,
//   minTypeScale: 1.2,
//   maxTypeScale: 1.25,
//   positiveSteps: 5,
//   negativeSteps: 2,
//   prefix: "step",
// }).reduce(
//   (obj, item) => ({
//     ...obj,
//     ...{ [`step-${item.step}`]: item.clamp },
//   }),
//   {}
// );
