import assert from "node:assert/strict";
import { buildPeopleIndex } from "./people-content";

const people = buildPeopleIndex();
const expectedStudentPlacements = ["phd-candidate", "phd-co-supervisee"];
const studentPlacements = people
  .filter((person) => expectedStudentPlacements.includes(person.placement))
  .map((person) => person.placement);

const firstCoSupervisee = studentPlacements.indexOf("phd-co-supervisee");
if (firstCoSupervisee !== -1) {
  assert.ok(
    studentPlacements
      .slice(firstCoSupervisee)
      .every((placement) => placement === "phd-co-supervisee"),
    "PhD candidates must sort before co-supervisees",
  );
}

const alumniSortKeys = people
  .filter((person) => person.placement === "alumni" && person.alumniSort)
  .map((person) => person.alumniSort as string);

for (let i = 1; i < alumniSortKeys.length; i++) {
  assert.ok(
    alumniSortKeys[i - 1] >= alumniSortKeys[i],
    `Alumni must sort in reverse chronological order (${alumniSortKeys[i - 1]} before ${alumniSortKeys[i]})`,
  );
}

console.log(`People content check passed (${people.length} valid profiles).`);
