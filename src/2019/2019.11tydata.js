const EleventyFetch = require("@11ty/eleventy-fetch");

/**
 * Grabs the event data from pretalx
 */
module.exports = async () => {
  try {
    const schedule = EleventyFetch(
      `https://pretalx.com/osfc2019/schedule/export/schedule.json`,
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
    const talks = await EleventyFetch(
      `https://pretalx.com/api/events/osfc2019/submissions/?format=json&limit=200`,
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

    const confirmedTalks = talks.results.filter(
      (talk) => talk.state === "confirmed"
      // (talk) => talk.state === "confirmed" && talk.is_featured
    );

    let speakers = await EleventyFetch(
      `https://pretalx.com/api/events/osfc2019/speakers/?format=json&limit=200`,
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

    speakers.results.sort((a, b) => (a.name > b.name ? 1 : -1));

    // const videos = await EleventyFetch(
    //   `https://cfp.osfc.io/api/events/osfc2019/p/vimeo/`,
    //   {
    //     duration: "1d", // 1 day
    //     type: "json",
    //     fetchOptions: {
    //       headers: {
    //         Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4",
    //       },
    //     },
    //   }
    // );

    // const newVideos = videos.results.map((video) => {
    //   return {
    //     ...video,
    //     vimeo_id: video.vimeo_link.substring(
    //       video.vimeo_link.lastIndexOf("/") + 1
    //     ),
    //   };
    // });

    return {
      schedule: schedule.conference,
      talks: confirmedTalks,
      speakers: speakers.results,
      // videos: newVideos,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
