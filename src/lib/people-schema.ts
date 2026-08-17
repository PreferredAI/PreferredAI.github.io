export const PEOPLE_PLACEMENTS = [
  "professor",
  "research-staff",
  "phd-candidate",
  "phd-co-supervisee",
  "alumni",
] as const;

export type PeoplePlacement = (typeof PEOPLE_PLACEMENTS)[number];

export interface Person {
  slug: string;
  name: string;
  placement: PeoplePlacement;
  photo: string;
  title: string;
  url?: string;
}

export interface PeopleGroups {
  professors: Person[];
  staff: Person[];
  students: Person[];
  alumni: Person[];
}

const placementOrder = new Map(
  PEOPLE_PLACEMENTS.map((placement, index) => [placement, index]),
);

export function comparePeople(a: Person, b: Person): number {
  const placementDifference =
    (placementOrder.get(a.placement) ?? Number.MAX_SAFE_INTEGER) -
    (placementOrder.get(b.placement) ?? Number.MAX_SAFE_INTEGER);
  if (placementDifference !== 0) return placementDifference;

  return (
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }) ||
    a.slug.localeCompare(b.slug, "en")
  );
}

export function groupPeople(people: readonly Person[]): PeopleGroups {
  const groups: PeopleGroups = {
    professors: [],
    staff: [],
    students: [],
    alumni: [],
  };

  for (const person of [...people].sort(comparePeople)) {
    switch (person.placement) {
      case "professor":
        groups.professors.push(person);
        break;
      case "research-staff":
        groups.staff.push(person);
        break;
      case "phd-candidate":
      case "phd-co-supervisee":
        groups.students.push(person);
        break;
      case "alumni":
        groups.alumni.push(person);
        break;
    }
  }

  return groups;
}
