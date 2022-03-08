const EleventyFetch = require("@11ty/eleventy-fetch");

/**
 * Grabs the event data from pretalx
 */
module.exports = async () => {
  try {
    const talks = await EleventyFetch(
      `https://pretalx.com/api/events/osfc2019/submissions/?limit=200`,
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

    return {
      pureTalks: talks,
      talks: talks.results,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
