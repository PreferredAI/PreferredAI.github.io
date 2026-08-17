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

console.log(`People content check passed (${people.length} valid profiles).`);
