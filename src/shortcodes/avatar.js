const Cache = require("@11ty/eleventy-cache-assets");
const sharp = require("sharp");
const fs = require("fs");
const fsExtra = require("fs-extra");
const slugify = require("../filters/slugify");
const getSpeakerFilePath = require("../utils/get-speaker-file-path");

const isProduction = process.env.NODE_ENV === "production";

// Generate a unique file name: speaker name (if not available, current date) + random number
// const uniqueFileName = (prefix) =>
//   `${prefix ? slugify(prefix) : Date.now()}-${Math.random()
//     .toFixed(6)
//     .substring(2)}`;

//directory to save generated and processed images to
// const publicDir = "/images/generated";
// const dir = `./dist${publicDir}`;

module.exports = (avatar) => {
  const { name, src, classlist, size, code } = avatar;

  const avatarCounter = Math.floor(Math.random() * 5 + 1);
  let source = `/images/avatar-0${avatarCounter}.webp`;
  let isHidden = false;
  let classes = "";
  let alt = "";

  // if (index === 0) {
  //   fsExtra.emptyDirSync(dir);
  //   console.warn("Emptied the directory");

  // // Create the directory if it doesn't exist
  // if (!fs.existsSync(dir)) {
  //   fs.mkdirSync(dir);
  // }
  // }

  if (src) {
    source = src;

    if (source.includes("https://www.gravatar.com")) {
      source += "?s=400";
    }

    if (name) {
      alt = name;
    }

    source = getSpeakerFilePath(speaker);
  } else {
    isHidden = true;
  }

  if (classlist) {
    classes = " " + classlist;
  }

  return `
    <img
      loading="lazy"
      decoding="async"
      class="avatar${classes}"
      src="${source}"
      alt="${alt}"
      ${isHidden ? 'aria-hidden="true"' : ""}
      ${size && `width="${size}" height="${size}"`}
    />`;
};

// function getLocalImagePath(url, filePrefix) {
//   const fileName = `${uniqueFileName(filePrefix)}.webp`;
//   const finalSize = 400;

//   // fetches the image from the url and saves it to the local directory
//   async function generateImage() {
//     const imageBuffer = await Cache(url, {
//       duration: "1d",
//       type: "buffer",
//     });

//     // resize the image to a smaller size and convert it to webp
//     sharp(imageBuffer)
//       .resize({ width: finalSize, height: finalSize, fit: "cover" })
//       .toBuffer((err, data) => {
//         if (err) {
//           return;
//         }

//         // save the image to the local directory
//         fs.writeFile(`${dir}/${fileName}`, data, (err) => {});
//       });
//   }

//   generateImage();

//   return `${publicDir}/${fileName}`;
// }
