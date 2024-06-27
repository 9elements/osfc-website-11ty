import Cache from "@11ty/eleventy-cache-assets";

const EVENT = "osfc-2024";

/**
 * Grabs the event data from pretalx
 */
export default async () => {
  //console.log("talks.js");
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const response = await Cache(
      `https://pretalx.com/api/events/${EVENT}/submissions/?state=accepted&state=confirmed&is_featured=true`,
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

    return response.results;
  } catch (error) {
    console.log(error);
    return [];
  }
};
