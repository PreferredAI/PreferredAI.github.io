import fs from "node:fs";
import path from "node:path";
import generatedPeople from "@/data/generated-people.json";
import { type Person, comparePeople } from "./people-schema";

const peopleDirectory = path.join(process.cwd(), "content", "people");

interface StoredPerson {
  name: string;
  placement: Person["placement"];
  photo: string;
  title?: string | null;
  url?: string | null;
}

function loadPeopleFromDisk(): Person[] | null {
  try {
    if (!fs.existsSync?.(peopleDirectory)) return null;

    const filenames = fs
      .readdirSync(peopleDirectory)
      .filter((filename) => filename.endsWith(".json"));
    if (filenames.length === 0) return null;

    return filenames
      .map((filename) => {
        const stored = JSON.parse(
          fs.readFileSync(path.join(peopleDirectory, filename), "utf8"),
        ) as StoredPerson;
        const slug = filename.replace(/\.json$/, "");

        return {
          slug,
          name: stored.name,
          placement: stored.placement,
          photo: stored.photo,
          title: stored.title ?? "",
          ...(stored.url ? { url: stored.url } : {}),
        };
      })
      .sort(comparePeople);
  } catch {
    // Cloudflare Workers do not have the repository content directory on disk.
    return null;
  }
}

export function loadAllPeople(): Person[] {
  const diskPeople = loadPeopleFromDisk();
  if (diskPeople) return diskPeople;

  return [...(generatedPeople as Person[])].sort(comparePeople);
}

export type { PeopleGroups, PeoplePlacement, Person } from "./people-schema";
export { groupPeople } from "./people-schema";
