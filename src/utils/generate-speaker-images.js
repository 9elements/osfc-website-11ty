const Cache = require("@11ty/eleventy-cache-assets");
const sharp = require("sharp");
const fs = require("fs");
const fsExtra = require("fs-extra");
const slugify = require("../filters/slugify");

module.exports = (speakers, year, size = 400) => {
  if (!year) {
    throw new Error(
      "Please provide a year in the `generateSpeakerImages` function as a second argument"
    );
  }

  const publicDir = `/images/generated/speakers`;
  const dir = `./dist${publicDir}`;

  // Create the directory if it doesn't exist and empty it
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fsExtra.emptyDirSync(dir);

  speakers.forEach(async ({ code, name, avatar }) => {
    const fileName = `${slugify(name)}-${code}.webp`;

    console.log(avatar);

    const imageBuffer = await Cache(avatar, {
      duration: "1d",
      type: "buffer",
    });

    // Image Processing
    sharp(imageBuffer)
      .resize({ width: size, height: size, fit: "cover" })
      .toBuffer((err, data) => {
        if (err) {
          return;
        }

        // save the image to the local directory
        fs.writeFile(`${dir}/${fileName}`, data, (err) => {});
      });
  });
};
