import Cache from "@11ty/eleventy-cache-assets";

/**
 * Grabs the event data from pretalx
 */
export default async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const schedule = await Cache(
      `https://pretalx.com/osfc2018/schedule/export/schedule.json`,
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

    const talks = await Cache(
      `https://pretalx.com/api/events/osfc2018/submissions/?format=json&limit=200`,
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

    let speakers = await Cache(
      `https://pretalx.com/api/events/osfc2018/speakers/?format=json&limit=200`,
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

    const videos = await Cache(
      `https://cfp.osfc.io/api/events/osfc2018/p/vimeo/`,
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

    const newVideos = videos.results.map((video) => {
      return {
        ...video,
        vimeo_id: video.vimeo_link.substring(
          video.vimeo_link.lastIndexOf("/") + 1
        ),
      };
    });

    return {
      schedule: schedule.schedule.conference,
      talks: confirmedTalks,
      speakers: speakers.results,
      videos: newVideos,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
