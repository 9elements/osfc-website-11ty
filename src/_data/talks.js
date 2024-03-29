const util = require("util");
const Cache = require("@11ty/eleventy-cache-assets");

const EVENT = "osfc2021";

/**
 * Grabs the event data from pretalx
 */
module.exports = async () => {
  //console.log("talks.js");
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const response = await Cache(
      `https://pretalx.com/api/events/${EVENT}/talks`,
      {
        duration: "1d", // 1 day
        type: "json",
        headers: {
          Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4",
        },
      }
    );
    // console.log(util.inspect(response.results, { depth: 1000, colors: true }));
    //console.log(response);
    return response.results;
  } catch (error) {
    console.log(error);
    return [];
  }
};
