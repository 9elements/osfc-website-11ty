const EleventyFetch = require("@11ty/eleventy-fetch");

/**
 * Grabs the event data from pretalx
 */
module.exports = async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    // const schedule = await Cache(
    //   `https://cfp.osfc.io/osfc2019/schedule/export/schedule.json`,
    //   {
    //     duration: "1d", // 1 day
    //     type: "json",
    //     headers: {
    //       Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4",
    //     },
    //   }
    // );

    const talks = await EleventyFetch(
      `https://pretalx.com/api/events/osfc2019/submissions/`,
      {
        duration: "1d", // 1 day
        type: "json",
        fetchOptions: {
          headers: {
            Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4",
          },
        },
      }
    );
    //console.log("Hier: " + talks.results);

    return {
      talks: talks.results,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
