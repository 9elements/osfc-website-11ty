import Cache from "@11ty/eleventy-cache-assets";

/**
 * Fetch every page of a paginated Pretalx list endpoint and return all results.
 *
 * Pretalx returns at most 50 items per page, whatever `limit` says, so a single
 * request silently drops everything after the first page.
 *
 * @param {string} url first page of the list endpoint
 * @param {object} options options passed to eleventy-cache-assets for each page
 */
export async function fetchAllPages(url, options) {
  const results = [];
  let next = url;
  while (next) {
    const page = await Cache(next, options);
    results.push(...(page.results || []));
    next = page.next;
  }
  return results;
}
