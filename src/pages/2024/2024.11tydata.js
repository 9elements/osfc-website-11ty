import Cache from "@11ty/eleventy-cache-assets";
import fs from "fs";

/**
 * Grabs the event data from pretalx
 */
export default async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const schedule = await Cache(
      `https://talks.osfc.io/osfc-2024/schedule/export/schedule.json`,
      {
        duration: "1d",
        type: "json",
        fetchOptions: {
          headers: {
            Authorization: "Token 50d2d1e3a6a1bc93d32195a72ec656c3e8597cc4",
          },
        },
      }
    );

    const speakers2024 = await Cache(
      `https://pretalx.com/api/events/osfc-2024/speakers/?format=json&limit=200`,
      {
        duration: "1m",
        type: "json",
        fetchOptions: {
          headers: {
            Authorization: "Token 50d2d1e3a6a1bc93d32195a72ec656c3e8597cc4",
          },
        },
      }
    );

    speakers2024.results.sort((a, b) => (a.name > b.name ? 1 : -1));

    const talks = await Cache(
      `https://pretalx.com/api/events/osfc-2024/submissions/?format=json&limit=200`,
      {
        duration: "1m",
        type: "json",
        fetchOptions: {
          headers: {
            Authorization: "Token 50d2d1e3a6a1bc93d32195a72ec656c3e8597cc4",
          },
        },
      }
    );

    const confirmedTalks = talks.results.filter(
      // strip out duplicate talks and only show confirmed talks
      (talk, i, arr) =>
        talk.state === "confirmed" &&
        arr.findIndex((t) => t.code === talk.code) === i
    );

    const breaks = await Cache(
      `https://pretalx.com/api/events/osfc-2024/schedules/latest/?format=json`,
      {
        duration: "1d",
        type: "json",
        fetchOptions: {
          headers: {
            Authorization: "Token 50d2d1e3a6a1bc93d32195a72ec656c3e8597cc4",
          },
        },
      }
    );

    const videos = await Cache(
      `https://cfp.osfc.io/api/events/osfc-2024/p/vimeo/`,
      {
        duration: "1d",
        type: "json",
        fetchOptions: {
          headers: {
            Authorization: "Token 50d2d1e3a6a1bc93d32195a72ec656c3e8597cc4",
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
      speakers: speakers2024.results,
      breaks: breaks.breaks,
      videos: newVideos,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
