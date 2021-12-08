const Cache = require("@11ty/eleventy-cache-assets");

/**
 * Grabs the event data from pretalx
 */
module.exports = async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const schedule = await Cache(
      `https://cfp.osfc.io/osfc2020/schedule/export/schedule.json`,
      {
        duration: "1d", // 1 day
        type: "json",
        headers: {
          Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4",
        },
      }
    );

    const talks = await Cache(`https://pretalx.com/api/events/osfc2020/talks`, {
      duration: "1d", // 1 day
      type: "json",
      headers: {
        Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4",
      },
    });

    return {
      schedule: schedule.schedule.conference,
      talks: talks.results,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
