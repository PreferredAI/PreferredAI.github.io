import type { Metadata } from "next";
import PeopleDirectory from "@/components/PeopleDirectory";
import { groupPeople, loadAllPeople } from "@/lib/people";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the Preferred.AI team and alumni",
};

export default function PeoplePage() {
  const groups = groupPeople(loadAllPeople());

  return <PeopleDirectory groups={groups} />;
}
