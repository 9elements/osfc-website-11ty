const Cache = require("@11ty/eleventy-cache-assets");

const EVENT = "osfc2021";

/**
 * Grabs the event data from pretalx
 */
module.exports = async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const response = await Cache(
      `https://talks.osfc.io/osfc2021/schedule/export/schedule.json`,
      {
        duration: "1d", // 1 day
        type: "json",
        headers: {
          Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4",
        },
      }
    );
    //console.log(util.inspect(response.schedule, { depth: 1000, colors: true }));
    return response.schedule;
  } catch (error) {
    console.log(error);
    return [];
  }
};
