import Cache from "@11ty/eleventy-cache-assets";

/**
 * Grabs the event data from pretalx
 */
export default async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const schedule = await Cache(
      `https://talks.osfc.io/osfc-2025/schedule/export/schedule.json`,
      {
        duration: "1d",
        type: "json",
        fetchOptions: {
          headers: {
            Authorization:
              "Token 9m8nf121ftqh1fv8xdsi17zraw31rxa1u3kczju822jtm4ul0ipvjbgfuyl8vm4l",
          },
        },
      },
    );

    const speakers2025 = await Cache(
      `https://pretalx.com/api/events/osfc-2025/speakers/?format=json&limit=200`,
      {
        duration: "1m",
        type: "json",
      },
    );

    const sortedSpeakers = speakers2025.results.sort((a, b) =>
      a.name > b.name ? 1 : -1,
    );

    const talks = await Cache(
      `https://pretalx.com/api/events/osfc-2025/submissions/?format=json&limit=200&expand=speakers,slots,slots.room`,
      {
        duration: "1m",
        type: "json",
        fetchOptions: {
          headers: {
            Authorization:
              "Token 9m8nf121ftqh1fv8xdsi17zraw31rxa1u3kczju822jtm4ul0ipvjbgfuyl8vm4l",
          },
        },
      },
    );

    const confirmedTalks = talks.results.filter(
      // strip out duplicate talks and only show confirmed talks
      (talk, i, arr) =>
        talk.state === "confirmed" &&
        arr.findIndex((t) => t.code === talk.code) === i,
    );

    const breaks = await Cache(
      `https://pretalx.com/api/events/osfc-2025/schedules/latest/?format=json`,
      {
        duration: "1d",
        type: "json",
        fetchOptions: {
          headers: {
            Authorization:
              "Token 9m8nf121ftqh1fv8xdsi17zraw31rxa1u3kczju822jtm4ul0ipvjbgfuyl8vm4l",
          },
        },
      },
    );

    const videos = await Cache(
      `https://cfp.osfc.io/api/events/osfc-2025/p/vimeo/`,
      {
        duration: "1d",
        type: "json",
        fetchOptions: {
          headers: {
            Authorization:
              "Token 9m8nf121ftqh1fv8xdsi17zraw31rxa1u3kczju822jtm4ul0ipvjbgfuyl8vm4l",
          },
        },
      },
    );

    const newVideos = videos.results.map((video) => {
      return {
        ...video,
        vimeo_id: video.vimeo_link.substring(
          video.vimeo_link.lastIndexOf("/") + 1,
        ),
      };
    });

    return {
      schedule: schedule.schedule.conference,
      talks: confirmedTalks,
      speakers: sortedSpeakers,
      breaks: breaks.breaks,
      videos: newVideos,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
