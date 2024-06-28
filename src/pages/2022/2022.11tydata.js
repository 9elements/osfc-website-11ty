import util from "util";
import Cache from "@11ty/eleventy-cache-assets";

/**
 * Grabs the event data from pretalx
 */
export default async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const schedule = await Cache(
      `https://talks.osfc.io/osfc2022/schedule/export/schedule.json`,
      {
        duration: "1d", // 1 day
        type: "json",
        headers: {
          Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4",
        },
      }
    );

    const speakers2022 = await Cache(
      `https://pretalx.com/api/events/osfc2022/speakers/?format=json&limit=200`,
      {
        duration: "1m", // 1 day
        type: "json",
      }
    );

    speakers2022.results.sort((a, b) => (a.name > b.name ? 1 : -1));

    const talks = await Cache(
      //`https://pretalx.com/api/events/osfc2021/talks/?limit=200`,
      `https://pretalx.com/api/events/osfc2022/submissions/?format=json&limit=200`,
      {
        duration: "1s", // 1 day
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

    const breaks = await Cache(
      `https://pretalx.com/api/events/osfc2022/schedules/latest/?format=json`,
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

    const videos = await Cache(
      `https://cfp.osfc.io/api/events/osfc2022/p/vimeo/`,
      {
        duration: "1d", // 1 day
        type: "json",
        headers: {
          Authorization: "Token 1bfe4598ca6e29bb43e1e09510915432196d76c4",
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
      speakers: speakers2022.results,
      breaks: breaks.breaks,
      videos: newVideos,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
