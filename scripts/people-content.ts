import fs from "node:fs";
import path from "node:path";
import {
  comparePeople,
  PEOPLE_PLACEMENTS,
  type PeoplePlacement,
  type Person,
} from "../src/lib/people-schema";

const PEOPLE_DIRECTORY = path.join(process.cwd(), "content", "people");
const PUBLIC_DIRECTORY = path.join(process.cwd(), "public");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SUPPORTED_EXTENSIONS = new Set([".jpeg", ".jpg", ".png", ".webp"]);
const ALLOWED_KEYS = new Set(["name", "placement", "photo", "title", "url"]);
const ALLOWED_URL_PROTOCOLS = new Set(["http:", "https:"]);

type StoredPerson = Omit<Person, "slug" | "title" | "url"> & {
  title?: string | null;
  url?: string | null;
};

function assertObject(
  value: unknown,
  filename: string,
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${filename}: expected a JSON object`);
  }
}

function readRequiredString(
  record: Record<string, unknown>,
  key: keyof StoredPerson,
  filename: string,
): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${filename}: ${key} must be a non-empty string`);
  }
  if (value !== value.trim()) {
    throw new Error(`${filename}: ${key} must not have surrounding whitespace`);
  }
  return value;
}

function readOptionalString(
  record: Record<string, unknown>,
  key: "title" | "url",
  filename: string,
): string | undefined {
  const value = record[key];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    throw new Error(`${filename}: ${key} must be a string when provided`);
  }
  if (value !== value.trim()) {
    throw new Error(`${filename}: ${key} must not have surrounding whitespace`);
  }
  return value;
}

function validateUrl(url: string, filename: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${filename}: url is invalid`);
  }
  if (!ALLOWED_URL_PROTOCOLS.has(parsed.protocol)) {
    throw new Error(`${filename}: url must use http:// or https://`);
  }
  if (parsed.username || parsed.password) {
    throw new Error(`${filename}: url must not contain credentials`);
  }
}

function detectImageType(header: Buffer): string | null {
  if (
    header.length >= 3 &&
    header[0] === 0xff &&
    header[1] === 0xd8 &&
    header[2] === 0xff
  ) {
    return "jpeg";
  }
  if (
    header
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "png";
  }
  if (
    header.subarray(0, 4).toString("ascii") === "RIFF" &&
    header.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

function validatePhoto(photo: string, slug: string, filename: string): void {
  const extension = path.posix.extname(photo).toLowerCase();
  const expectedPrefix = `/team/members/${slug}/photo`;
  if (
    !SUPPORTED_EXTENSIONS.has(extension) ||
    photo !== `${expectedPrefix}${extension}`
  ) {
    throw new Error(
      `${filename}: photo must be ${expectedPrefix}.<jpeg|jpg|png|webp>`,
    );
  }

  const imagePath = path.join(PUBLIC_DIRECTORY, photo.slice(1));
  if (!fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) {
    throw new Error(`${filename}: profile photo does not exist at ${photo}`);
  }

  const detectedType = detectImageType(
    fs.readFileSync(imagePath).subarray(0, 12),
  );
  const expectedType =
    extension === ".jpg" || extension === ".jpeg" ? "jpeg" : extension.slice(1);
  if (detectedType !== expectedType) {
    throw new Error(
      `${filename}: photo extension ${extension} does not match its file contents`,
    );
  }
}

function parsePerson(filename: string): Person {
  const slug = filename.replace(/\.json$/, "");
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`${filename}: filename must be a URL-safe lowercase slug`);
  }

  const fullPath = path.join(PEOPLE_DIRECTORY, filename);
  let value: unknown;
  try {
    value = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    throw new Error(`${filename}: invalid JSON`, { cause: error });
  }
  assertObject(value, filename);

  const unexpectedKeys = Object.keys(value).filter(
    (key) => !ALLOWED_KEYS.has(key),
  );
  if (unexpectedKeys.length > 0) {
    throw new Error(
      `${filename}: unexpected field(s): ${unexpectedKeys.join(", ")}`,
    );
  }

  const name = readRequiredString(value, "name", filename);
  const placement = readRequiredString(value, "placement", filename);
  if (!(PEOPLE_PLACEMENTS as readonly string[]).includes(placement)) {
    throw new Error(
      `${filename}: placement must be one of ${PEOPLE_PLACEMENTS.join(", ")}`,
    );
  }
  const photo = readRequiredString(value, "photo", filename);
  validatePhoto(photo, slug, filename);

  const title = readOptionalString(value, "title", filename) ?? "";
  const url = readOptionalString(value, "url", filename);
  if (url) validateUrl(url, filename);

  return {
    slug,
    name,
    placement: placement as PeoplePlacement,
    photo,
    title,
    ...(url ? { url } : {}),
  };
}

export function buildPeopleIndex(): Person[] {
  if (!fs.existsSync(PEOPLE_DIRECTORY)) {
    throw new Error(`Missing People collection directory: ${PEOPLE_DIRECTORY}`);
  }

  const filenames = fs
    .readdirSync(PEOPLE_DIRECTORY)
    .filter((filename) => filename.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b, "en"));
  if (filenames.length === 0) {
    throw new Error("People collection must contain at least one profile");
  }

  const seenSlugs = new Set<string>();
  const people = filenames.map((filename) => {
    const normalizedSlug = filename.replace(/\.json$/, "").toLowerCase();
    if (seenSlugs.has(normalizedSlug)) {
      throw new Error(`Duplicate People slug: ${normalizedSlug}`);
    }
    seenSlugs.add(normalizedSlug);
    return parsePerson(filename);
  });

  return people.sort(comparePeople);
}
