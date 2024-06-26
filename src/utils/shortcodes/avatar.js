export const avatarShortcode = (avatar) => {
  const avatarCounter = Math.floor(Math.random() * 5 + 1);
  let source = "/assets/images/avatar-0" + avatarCounter + ".webp";
  let hidden = "";
  let size = "";
  let classes = "";
  let alt = "alt = ''";
  if (avatar.src) {
    source = avatar.src;
    if (source.includes("https://www.gravatar.com")) {
      source += "?s=400";
    }

    if (avatar.name) {
      alt = `alt="${avatar.name}"`;
    }
  } else {
    hidden = `aria-hidden="true"`;
  }
  if (avatar.size) {
    size = `width="${avatar.size}" height="${avatar.size}"`;
  }
  if (avatar.classlist) {
    classes = " " + avatar.classlist;
  }

  return `<img loading="lazy" decoding="async" class="avatar${classes}" src="${source}" ${alt} ${hidden} ${size} />
  `;
};
