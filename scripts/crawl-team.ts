import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { TEAM_PHOTOS, type TeamPhoto } from "../src/data/teamPhotos";

// =============================================================================
// CONFIGURATION
// =============================================================================

const GROUP_URL = "https://www.hadylauw.com/group";
const OUTPUT_PATH = path.join(process.cwd(), "src", "data", "teamPhotos.ts");
const TEAM_DIR = path.join(process.cwd(), "public", "team", "activities");
const USER_AGENT = "Mozilla/5.0 (compatible; TeamPhotosCrawler/1.0)";

// =============================================================================
// HELPERS
// =============================================================================

function normalizeDateStr(dateStr: string): string {
  const clean = dateStr.trim().toLowerCase();
  const match = clean.match(/^([a-z]+)\s+(\d{4})/);
  if (!match) return dateStr.trim();
  const month = match[1];
  const year = match[2];

  const monthMap: Record<string, string> = {
    jan: "january",
    feb: "february",
    mar: "march",
    apr: "april",
    may: "may",
    jun: "june",
    jul: "july",
    aug: "august",
    sep: "september",
    sept: "september",
    oct: "october",
    nov: "november",
    dec: "december",
    january: "january",
    february: "february",
    march: "march",
    april: "april",
    june: "june",
    july: "july",
    august: "august",
    october: "october",
    november: "november",
    december: "december",
  };

  const fullMonth = monthMap[month] || month;
  const capitalizedMonth =
    fullMonth.charAt(0).toUpperCase() + fullMonth.slice(1);
  return `${capitalizedMonth} ${year}`;
}

function getYearMonth(dateStr: string): string | null {
  const normalized = normalizeDateStr(dateStr);
  const match = normalized.match(/^([A-Za-z]+)\s+(\d{4})/);
  if (!match) return null;
  const monthName = match[1].toLowerCase();
  const year = match[2];
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const monthIdx = months.indexOf(monthName);
  if (monthIdx === -1) return null;
  const monthNum = String(monthIdx + 1).padStart(2, "0");
  return `${year}-${monthNum}`;
}

function isSamePhoto(
  p1: { date: string; location: string },
  p2: { date: string; location: string },
) {
  return (
    normalizeDateStr(p1.date) === normalizeDateStr(p2.date) &&
    p1.location.trim().toLowerCase() === p2.location.trim().toLowerCase()
  );
}

async function downloadImage(url: string, destPath: string) {
  console.log(`Downloading ${url} -> ${destPath}`);
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to download image: ${response.status} ${response.statusText}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Ensure directory exists
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buffer);
}

// =============================================================================
// MAIN CRAWLER LOGIC
// =============================================================================

async function main() {
  try {
    console.log(`Fetching group page from ${GROUP_URL}...`);
    const response = await fetch(GROUP_URL, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch group page: ${response.status} ${response.statusText}`,
      );
    }
    const html = await response.text();
    console.log(`Fetched ${html.length} bytes of HTML.`);

    const dom = new JSDOM(html);
    const document = dom.window.document;
    const imgs = Array.from(document.querySelectorAll("img"));
    console.log(`Found ${imgs.length} images on page.`);

    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
      "jan",
      "feb",
      "mar",
      "apr",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    interface CrawledPhoto {
      src: string;
      date: string;
      location: string;
    }

    const crawledPhotos: CrawledPhoto[] = [];

    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      const src = img.getAttribute("src") || "";
      if (!src) continue;

      // Find ancestor Kzv0Me wrapper
      let current: HTMLElement | null = img as HTMLElement;
      let imageWrapper: HTMLElement | null = null;
      while (current && current.tagName !== "BODY") {
        if (current.classList.contains("Kzv0Me")) {
          imageWrapper = current;
          break;
        }
        current = current.parentElement;
      }

      if (!imageWrapper) continue;
      const parent = imageWrapper.parentElement;
      if (!parent) continue;

      // Find text elements within the parent container
      const siblings = Array.from(parent.children) as HTMLElement[];
      let dateAndLocation = "";

      for (const sib of siblings) {
        if (sib === imageWrapper) continue;
        const text = sib.textContent?.trim() || "";
        if (!text) continue;

        const lower = text.toLowerCase();
        const hasMonth = monthNames.some((m) => lower.startsWith(m));

        if (hasMonth) {
          dateAndLocation = text;
          break; // Stop at first text sibling containing a date
        }
      }

      if (dateAndLocation) {
        let date = "";
        let location = "";
        const commaIndex = dateAndLocation.indexOf(",");
        if (commaIndex !== -1) {
          date = dateAndLocation.substring(0, commaIndex).trim();
          location = dateAndLocation.substring(commaIndex + 1).trim();
        } else {
          date = dateAndLocation.trim();
        }

        // Normalize date format
        date = normalizeDateStr(date);

        crawledPhotos.push({
          src,
          date,
          location,
        });
      }
    }

    console.log(
      `Parsed ${crawledPhotos.length} valid team photos with metadata.`,
    );

    // Find the new photos by checking from top (latest) to bottom (oldest)
    const newPhotosToProcess: CrawledPhoto[] = [];
    let _stopCrawling = false;

    for (const photo of crawledPhotos) {
      // Check if photo is already in the database
      const alreadyExists = TEAM_PHOTOS.some((existing) =>
        isSamePhoto(existing, photo),
      );

      if (alreadyExists) {
        console.log(
          `Reached already-existing photo: "${photo.date}" at "${photo.location}". Stopping crawl.`,
        );
        _stopCrawling = true;
        break;
      }

      console.log(`Found NEW photo: "${photo.date}" at "${photo.location}".`);
      newPhotosToProcess.push(photo);
    }

    if (newPhotosToProcess.length === 0) {
      console.log("No new photos found. Everything is up to date.");
      return;
    }

    console.log(`Processing ${newPhotosToProcess.length} new photos...`);

    // Group new photos by YYYY-MM to determine naming
    const groupedNew: Record<string, CrawledPhoto[]> = {};
    for (const photo of newPhotosToProcess) {
      const ym = getYearMonth(photo.date);
      if (!ym) {
        console.error(`Could not parse year/month from date: ${photo.date}`);
        continue;
      }
      if (!groupedNew[ym]) groupedNew[ym] = [];
      groupedNew[ym].push(photo);
    }

    const newTeamPhotos: TeamPhoto[] = [];

    // Assign URLs and download images
    for (const ym of Object.keys(groupedNew)) {
      // Group photos sorted from oldest to newest (reverse DOM order)
      const groupPhotos = groupedNew[ym].reverse();

      // Check existing photos for this month
      const existingInMonth = TEAM_PHOTOS.filter((p) => {
        const pYm = getYearMonth(p.date);
        return pYm === ym;
      });

      const existingCount = existingInMonth.length;

      if (existingCount === 0 && groupPhotos.length === 1) {
        // Simple case: no existing photos in month, only 1 new photo
        const photo = groupPhotos[0];
        const filename = `${ym}.jpg`;
        const url = `/team/activities/${filename}`;
        const destPath = path.join(TEAM_DIR, filename);

        await downloadImage(photo.src, destPath);
        newTeamPhotos.push({
          url,
          date: photo.date,
          location: photo.location,
        });
      } else {
        // Multi-photo case: determine suffixes
        // Find existing max suffix
        let maxSuffix = 0;
        for (const existing of existingInMonth) {
          // Extract suffix from url like /team/YYYY-MM.X.jpg or /team/YYYY-MM.jpg
          const basename = path.basename(existing.url, ".jpg"); // e.g. "2025-02.2" or "2025-07"
          const parts = basename.split(".");
          if (parts.length > 1) {
            const suffixNum = Number.parseInt(parts[parts.length - 1], 10);
            if (!Number.isNaN(suffixNum) && suffixNum > maxSuffix) {
              maxSuffix = suffixNum;
            }
          } else {
            // "2025-07" without suffix implies suffix 1
            if (maxSuffix < 1) maxSuffix = 1;
          }
        }

        for (let j = 0; j < groupPhotos.length; j++) {
          const photo = groupPhotos[j];
          const suffix = maxSuffix + 1 + j;
          const filename = `${ym}.${suffix}.jpg`;
          const url = `/team/activities/${filename}`;
          const destPath = path.join(TEAM_DIR, filename);

          await downloadImage(photo.src, destPath);
          newTeamPhotos.push({
            url,
            date: photo.date,
            location: photo.location,
          });
        }
      }
    }

    // Combine new photos with existing ones
    // Since newTeamPhotos contains photos processed oldest to newest per month,
    // we should make sure they are ordered latest to oldest globally.
    // The original order of newPhotosToProcess is latest to oldest (DOM order).
    // Let's sort the final combined list or align them by placing new photos in their correct position.
    // Since all new photos are newer than all existing photos (otherwise we wouldn't have stopped at the first match),
    // we can simply prepended all new photos (in their original DOM order, which is latest to oldest) to the existing photos!
    const finalNewPhotosOrdered = newPhotosToProcess.map((photo) => {
      const assigned = newTeamPhotos.find(
        (p) => p.date === photo.date && p.location === photo.location,
      );
      if (!assigned) {
        throw new Error(
          `Failed to match assigned URL for ${photo.date} - ${photo.location}`,
        );
      }
      return assigned;
    });

    const combinedPhotos = [...finalNewPhotosOrdered, ...TEAM_PHOTOS];

    // Write updated src/data/teamPhotos.ts
    let tsContent = `export interface TeamPhoto {
  url: string;
  date: string;
  location: string;
}

export const TEAM_PHOTOS: TeamPhoto[] = [\n`;

    for (const photo of combinedPhotos) {
      tsContent += "  {\n";
      tsContent += `    url: ${JSON.stringify(photo.url)},\n`;
      tsContent += `    date: ${JSON.stringify(photo.date)},\n`;
      tsContent += `    location: ${JSON.stringify(photo.location)},\n`;
      tsContent += "  },\n";
    }
    tsContent += "];\n";

    fs.writeFileSync(OUTPUT_PATH, tsContent, "utf8");
    console.log(
      `Successfully wrote ${combinedPhotos.length} photos to ${OUTPUT_PATH}`,
    );
  } catch (error) {
    console.error("Error crawling team photos:", error);
    process.exit(1);
  }
}

main();
