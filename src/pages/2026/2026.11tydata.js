// @ts-check
import Cache from "@11ty/eleventy-cache-assets";

/**
 * OSFC 2026 event data from Pretalx.
 *
 * Talks are the confirmed submissions — the published schedule export contains
 * exactly these. Talks/speakers are fetched independently of the schedule and
 * those pieces are guarded so a transient failure can't empty the talk list.
 * Note: this instance's schedules/latest endpoint no longer returns a `breaks`
 * array, so breaks default to [] (the schedule grid renders talks without break
 * rows); videos appear post-conference.
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
  const all = [];
  let url = `${BASE}/${EVENT}/submissions/?format=json&limit=200&expand=speakers,slots,slots.room,resources`;
  while (url) {
    const page = await Cache(url, jsonAuth("1m"));
    all.push(...(page.results || []));
    url = page.next;
  }
  // De-dupe by code (defensive against overlapping pages).
  return Array.from(all.reduce((m, t) => m.set(t.code, t), new Map()).values());
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

    const speakerData = await Cache(
      `${BASE}/${EVENT}/speakers/?format=json&limit=200`,
      jsonAuth("1m")
    );

    // Only include speakers who have a confirmed talk.
    const talkSpeakerCodes = new Set(
      talks.flatMap((talk) => (talk.speakers || []).map((speaker) => speaker.code))
    );
    speakers = (speakerData.results || [])
      .filter((speaker) => speaker.name && talkSpeakerCodes.has(speaker.code))
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  } catch (error) {
    console.error("[osfc-2026] could not load talks/speakers:", error.message);
  }

  // Schedule-dependent data — guarded so a transient failure never empties the
  // talk list. breaks default to [] (endpoint no longer exposes a breaks array).
  let schedule = { days: [], rooms: [] };
  let breaks = [];
  const videos = [];

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

  return { talks, speakers, schedule, breaks, videos };
};
