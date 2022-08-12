const util = require("util");
const Cache = require("@11ty/eleventy-cache-assets");

/**
 * Grabs the event data from pretalx
 */
module.exports = async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const schedule = await Cache(
      `https://talks.osfc.io/osfc2022/schedule/export/schedule.json`,
      {
        duration: "1d", // 1 day
        type: "json",
        headers: {
          Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4"
        }
      }
    );

    const talks = await Cache(
      //`https://pretalx.com/api/events/osfc2021/talks/?limit=200`,
      `https://pretalx.com/api/events/osfc2022/submissions/?format=json&limit=200`,
      {
        duration: "1s", // 1 day
        type: "json",
        fetchOptions: {
          headers: {
            Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4"
          }
        }
      }
    );

    const confirmedTalks = talks.results.filter(
      (talk) => talk.state === "confirmed"
      // (talk) => talk.state === "confirmed" && talk.is_featured
    );

    const speakers = await Cache(
      `https://talks.osfc.io/api/events/osfc2022/speakers/?limit=200`,
      {
        duration: "1d", // 1 day
        type: "json",
        fetchOptions: {
          headers: {
            Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4"
          }
        }
      }
    );

    speakers.results.sort((a, b) => (a.name > b.name ? 1 : -1));

    // const videos = await Cache(`https://cfp.osfc.io/api/events/osfc2021/p/vimeo/`, {
    //   duration: "1d", // 1 day
    //   type: "json",
    //   headers: {
    //     Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4"
    //   }
    // });

    // const newVideos = videos.results.map((video) => {
    //   return {
    //     ...video,
    //     vimeo_id: video.vimeo_link.substring(video.vimeo_link.lastIndexOf("/") + 1)
    //   };
    // });

    return {
      schedule: schedule.schedule.conference,
      talks: confirmedTalks,
      speakers: speakers.results
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
