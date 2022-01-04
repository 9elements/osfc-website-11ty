const Cache = require("@11ty/eleventy-cache-assets");
const sharp = require("sharp");
const fs = require("fs");
const fsExtra = require("fs-extra");
const slugify = require("../filters/slugify");

const isProduction = process.env.NODE_ENV === "production";

const uniqueFileName = (prefix) =>
  `${prefix ? slugify(prefix) : Date.now()}-${Math.random()
    .toFixed(6)
    .substring(2)}`;

//directory to save generated and processed images
const dir = "./dist/images/generated";

module.exports = (avatar) => {
  const avatarCounter = Math.floor(Math.random() * 5 + 1);
  let source = "/images/avatar-0" + avatarCounter + ".webp";
  let isHidden = false;
  let classes = "";
  let alt = "";

  if (avatar.src) {
    source = avatar.src;

    source.includes("https://www.gravatar.com") && (source += "?s=400");

    if (avatar.name) {
      alt = avatar.name;
    }

    if (isProduction) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fsExtra.emptyDirSync(dir);
      source = getLocalImagePath(source, avatar.name);
    }
  } else {
    isHidden = true;
  }

  if (avatar.classlist) {
    classes = " " + avatar.classlist;
  }

  return `
    <img
      loading="lazy"
      decoding="async"
      class="avatar${classes}"
      src="${source}"
      alt="${alt}"
      ${isHidden ? 'aria-hidden="true"' : ""}
      ${avatar.size && `width="${avatar.size}" height="${avatar.size}"`}
    />`;
};

function getLocalImagePath(url, filePrefix) {
  const fileName = `${uniqueFileName(filePrefix)}.webp`;
  const finalSize = 400;

  // fetches the image from the url and saves it to the local directory
  async function generateImage() {
    const imageBuffer = await Cache(url, {
      duration: "1d",
      type: "buffer",
    });

    // resize the image to a smaller size and convert it to webp
    sharp(imageBuffer)
      .resize({ width: finalSize, height: finalSize, fit: "cover" })
      .toBuffer((err, data) => {
        if (err) {
          return;
        }

        // save the image to the local directory
        fs.writeFile(`${dir}/${fileName}`, data, (err) => {});
      });
  }

  generateImage();

  return `/images/generated/${fileName}`;
}
