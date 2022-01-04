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

const dir = "./dist/images/generated";

const getLocalImagePath = (url, filePrefix) => {
  const fileName = `${uniqueFileName(filePrefix)}.webp`;
  const finalSize = 400;

  const generateImage = async () => {
    const imageBuffer = await Cache(url, {
      duration: "1d",
      type: "buffer",
    });

    sharp(imageBuffer)
      .resize({ width: finalSize, height: finalSize, fit: "cover" })
      .toBuffer((err, data, info) => {
        if (err) {
          return;
        }

        fs.writeFile(`${dir}/${fileName}`, data, (err) => {});
      });
  };

  generateImage();

  return `/images/generated/${fileName}`;
};

//

module.exports = (avatar) => {
  const avatarCounter = Math.floor(Math.random() * 5 + 1);
  let source = "/images/avatar-0" + avatarCounter + ".webp";
  let hidden = "";
  let size = "";
  let classes = "";
  let alt = "alt = ''";

  if (avatar.src) {
    source = avatar.src;
    if (source.includes("https://www.gravatar.com")) {
      source += "?s=";
      source += 400;
    }

    if (avatar.name) {
      alt = "alt = '" + avatar.name + "'";
    }

    // if (isProduction) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fsExtra.emptyDirSync(dir);
    source = getLocalImagePath(source, avatar.name);
    // }
  } else {
    hidden = "aria-hidden='true'";
  }

  if (avatar.size) {
    size = "width='" + avatar.size + "' height='" + avatar.size + "'";
  }

  if (avatar.classlist) {
    classes = " " + avatar.classlist;
  }

  return `<img loading="lazy" decoding="async" class="avatar${classes}" src="${source}" ${alt} ${hidden} ${size}>`;
};
