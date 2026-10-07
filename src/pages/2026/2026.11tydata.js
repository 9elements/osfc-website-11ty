// @ts-check
import Cache from "@11ty/eleventy-cache-assets";
import { fetchAllPages } from "../../utils/build/fetch-all-pages.js";

/**
 * OSFC 2026 event data from Pretalx.
 *
 * Talks are the confirmed submissions — the published schedule export contains
 * exactly these. Talks/speakers are fetched independently of the schedule and
 * those pieces are guarded so a transient failure can't empty the talk list.
 * Note: this instance's schedules/latest endpoint no longer returns a `breaks`
 * array, so breaks default to [] (the schedule grid renders talks without break
 * rows). Videos are the recordings linked in Pretalx's Vimeo plugin.
 */

const EVENT = "osfc-2026";
const BASE = "https://talks.osfc.io/api/events";
const SCHEDULE_EXPORT = `https://talks.osfc.io/${EVENT}/schedule/export/schedule.json`;

// Pretalx API token with read access to osfc-2026 (checked in, as in prior years).
const TOKEN = "wauehwu6exc0rp3unk6yd6hublaqj87mz7v6yzdoksc4t3woe4efi4r79kn5qb1o";

const jsonAuth = (duration) => ({
  duration,
  type: "json",
  fetchOptions: { headers: { Authorization: `Token ${TOKEN}` } },
});

/** Page through the paginated submissions endpoint. */
async function fetchAllSubmissions() {
  const all = await fetchAllPages(
    `${BASE}/${EVENT}/submissions/?format=json&limit=200&expand=speakers,slots,slots.room,resources`,
    jsonAuth("1m")
  );
  // De-dupe by code (defensive against overlapping pages).
  return Array.from(all.reduce((m, t) => m.set(t.code, t), new Map()).values());
}

/** Approximates the `slugify` filter used for the speaker page permalinks. */
const slugKey = (name) =>
  name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Merge speakers that would share a page (same name, separate Pretalx
 * accounts) — otherwise the build fails on a duplicate permalink.
 */
function mergeSpeakersByName(speakers) {
  const merged = new Map();
  for (const speaker of speakers) {
    const key = slugKey(speaker.name);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, speaker);
      continue;
    }
    merged.set(key, {
      ...existing,
      biography:
        (speaker.biography || "").length > (existing.biography || "").length
          ? speaker.biography
          : existing.biography,
      avatar_url: existing.avatar_url || speaker.avatar_url,
      submissions: [...new Set([...existing.submissions, ...speaker.submissions])],
    });
  }
  return Array.from(merged.values());
}

export default async () => {
  let talks = [];
  let speakers = [];

  try {
    const submissions = await fetchAllSubmissions();
    // Confirmed talks — the published schedule export contains exactly these.
    talks = submissions
      .filter((talk) => talk.state === "confirmed")
      .sort((a, b) => (a.title > b.title ? 1 : -1));

    const speakerData = await fetchAllPages(
      `${BASE}/${EVENT}/speakers/?format=json&limit=200`,
      jsonAuth("1m")
    );

    // Only include speakers who have a confirmed talk.
    const talkSpeakerCodes = new Set(
      talks.flatMap((talk) => (talk.speakers || []).map((speaker) => speaker.code))
    );
    speakers = mergeSpeakersByName(
      speakerData.filter(
        (speaker) => speaker.name && talkSpeakerCodes.has(speaker.code)
      )
    ).sort((a, b) => (a.name > b.name ? 1 : -1));
  } catch (error) {
    console.error("[osfc-2026] could not load talks/speakers:", error.message);
  }

  // Schedule-dependent data — guarded so a transient failure never empties the
  // talk list. breaks default to [] (endpoint no longer exposes a breaks array).
  let schedule = { days: [], rooms: [] };
  let breaks = [];
  let videos = [];

  try {
    const scheduleData = await Cache(SCHEDULE_EXPORT, jsonAuth("1d"));
    schedule = scheduleData.schedule.conference;
    const breakData = await Cache(
      `${BASE}/${EVENT}/schedules/latest/?format=json`,
      jsonAuth("1d")
    );
    breaks = breakData.breaks || [];
  } catch (error) {
    console.warn("[osfc-2026] schedule/breaks fetch failed:", error.message);
  }

  try {
    const videoData = await Cache(`${BASE}/${EVENT}/p/vimeo/`, jsonAuth("1d"));
    videos = (videoData.results || [])
      .filter((video) => video.vimeo_link)
      .map((video) => ({
        ...video,
        vimeo_id: video.vimeo_link.substring(
          video.vimeo_link.lastIndexOf("/") + 1
        ),
      }));
  } catch (error) {
    console.warn("[osfc-2026] video fetch failed:", error.message);
  }

  return { talks, speakers, schedule, breaks, videos };
};
