import Cache from "@11ty/eleventy-cache-assets";

/**
 * Grabs the event data from pretalx
 */
export default async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const schedule = await Cache(
      `https://pretalx.com/osfc2019/schedule/export/schedule.json`,
      {
        duration: "1d", // 1 day
        type: "json",
        fetchOptions: {
          headers: {
            Authorization:
              "Token 9m8nf121ftqh1fv8xdsi17zraw31rxa1u3kczju822jtm4ul0ipvjbgfuyl8vm4l",
          },
        },
      },
    );

    const talks = await Cache(
      `https://pretalx.com/api/events/osfc2019/submissions/?format=json&limit=200&expand=speakers,slots,slots.room,resources`,
      {
        duration: "1d", // 1 day
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
      (talk) => talk.state === "confirmed",
      // (talk) => talk.state === "confirmed" && talk.is_featured
    );

    let speakers = await Cache(
      `https://pretalx.com/api/events/osfc2019/speakers/?format=json&limit=200`,
      {
        duration: "1d", // 1 day
        type: "json",
        fetchOptions: {
          headers: {
            Authorization:
              "Token 9m8nf121ftqh1fv8xdsi17zraw31rxa1u3kczju822jtm4ul0ipvjbgfuyl8vm4l",
          },
        },
      },
    );

    speakers.results.sort((a, b) => (a.name > b.name ? 1 : -1));

    const videos = await Cache(
      `https://cfp.osfc.io/api/events/osfc2019/p/vimeo/`,
      {
        duration: "1d", // 1 day
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
      speakers: speakers.results,
      videos: newVideos,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
