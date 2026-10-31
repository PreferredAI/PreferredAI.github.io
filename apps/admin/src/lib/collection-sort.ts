export interface PostSortEntry {
  slug: string;
  date: string;
}

export interface PersonSortEntry {
  slug: string;
  name: string;
  placement: string;
  alumniSort?: string;
}

const PLACEMENT_ORDER = new Map<string, number>([
  ["professor", 0],
  ["research-staff", 1],
  ["phd-candidate", 2],
  ["phd-co-supervisee", 3],
  ["alumni", 4],
]);

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const FRONTMATTER_BLOCK_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const FRONTMATTER_DATE_PATTERN =
  /^date:\s*['"]?(\d{4}-\d{2}-\d{2})(?:T[^\s'"]*)?['"]?\s*$/m;

export function comparePostSortEntries(
  a: PostSortEntry,
  b: PostSortEntry,
): number {
  const validA = ISO_DATE_PATTERN.test(a.date);
  const validB = ISO_DATE_PATTERN.test(b.date);

  if (validA && validB && a.date !== b.date) {
    // Newest YYYY-MM-DD first
    return b.date.localeCompare(a.date, "en");
  }
  if (validA !== validB) {
    return validA ? -1 : 1;
  }

  return a.slug.localeCompare(b.slug, "en");
}

export function comparePeopleSortEntries(
  a: PersonSortEntry,
  b: PersonSortEntry,
): number {
  const placementDiff =
    (PLACEMENT_ORDER.get(a.placement) ?? Number.MAX_SAFE_INTEGER) -
    (PLACEMENT_ORDER.get(b.placement) ?? Number.MAX_SAFE_INTEGER);
  if (placementDiff !== 0) {
    return placementDiff;
  }

  if (a.placement === "alumni" && b.placement === "alumni") {
    const sortA = a.alumniSort?.trim() ?? "";
    const sortB = b.alumniSort?.trim() ?? "";
    if (sortA !== sortB) {
      if (!sortA) return 1;
      if (!sortB) return -1;
      // Newest YYYY-MM first
      return sortB.localeCompare(sortA, "en");
    }
  }

  return (
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }) ||
    a.slug.localeCompare(b.slug, "en")
  );
}

export function buildPostSortRanks(
  entries: readonly PostSortEntry[],
): Map<string, number> {
  const sorted = [...entries].sort(comparePostSortEntries);
  return new Map(sorted.map((entry, index) => [entry.slug, index]));
}

export function buildPeopleSortRanks(
  entries: readonly PersonSortEntry[],
): Map<string, number> {
  const sorted = [...entries].sort(comparePeopleSortEntries);
  return new Map(sorted.map((entry, index) => [entry.slug, index]));
}

export function parsePostMarkdownSortEntry(
  slug: string,
  markdown: string,
): PostSortEntry {
  const blockMatch = markdown.match(FRONTMATTER_BLOCK_PATTERN);
  const dateMatch = blockMatch?.[1]?.match(FRONTMATTER_DATE_PATTERN);
  return {
    slug,
    date: dateMatch?.[1] ?? "",
  };
}

export function parsePersonJsonSortEntry(
  slug: string,
  rawJson: string,
): PersonSortEntry | null {
  try {
    const parsed = JSON.parse(rawJson) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const name =
      typeof parsed.name === "string" && parsed.name.trim().length > 0
        ? parsed.name.trim()
        : slug;
    const placement =
      typeof parsed.placement === "string" ? parsed.placement.trim() : "";
    const alumniSort =
      typeof parsed.alumniSort === "string" &&
      parsed.alumniSort.trim().length > 0
        ? parsed.alumniSort.trim()
        : undefined;
    return { slug, name, placement, alumniSort };
  } catch {
    return null;
  }
}

export function ranksEqual(
  a: ReadonlyMap<string, number>,
  b: ReadonlyMap<string, number>,
): boolean {
  if (a.size !== b.size) return false;
  for (const [key, val] of a) {
    if (b.get(key) !== val) return false;
  }
  return true;
}
