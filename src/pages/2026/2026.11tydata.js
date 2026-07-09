// @ts-check
import Cache from "@11ty/eleventy-cache-assets";

/**
 * OSFC 2026 event data from Pretalx.
 *
 * Pre-schedule phase: the full schedule is not published yet, so we surface the
 * "featured" talks (is_featured) as a teaser. Talks and speakers are fetched
 * independently of the schedule/breaks/videos, and those schedule-dependent
 * pieces are guarded so a missing (404) schedule export cannot empty the talk
 * list. When the schedule is live:
 *   1. set "hasSchedule": true in 2026.json,
 *   2. add schedule.md / talks.md (copy from a previous year),
 *   3. widen the talk filter (e.g. state === "confirmed").
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
    // Featured talks only, until the full schedule is published. Guard against a
    // talk that is still flagged featured but has since been pulled.
    const HIDDEN_STATES = ["withdrawn", "canceled", "cancelled", "rejected", "deleted"];
    talks = submissions
      .filter((talk) => talk.is_featured && !HIDDEN_STATES.includes(talk.state))
      .sort((a, b) => (a.title > b.title ? 1 : -1));

    const speakerData = await Cache(
      `${BASE}/${EVENT}/speakers/?format=json&limit=200`,
      jsonAuth("1m")
    );

    // Only include speakers who actually have a featured talk.
    const featuredSpeakerCodes = new Set(
      talks.flatMap((talk) => (talk.speakers || []).map((speaker) => speaker.code))
    );
    speakers = (speakerData.results || [])
      .filter((speaker) => speaker.name && featuredSpeakerCodes.has(speaker.code))
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  } catch (error) {
    console.error("[osfc-2026] could not load talks/speakers:", error.message);
  }

  // Schedule-dependent data — guarded so its absence never empties the talk list.
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
    breaks = breakData.breaks;
  } catch (error) {
    console.warn("[osfc-2026] schedule not published yet — schedule/breaks skipped.");
  }

  return { talks, speakers, schedule, breaks, videos };
};
