import type { Metadata } from "next";
import Image from "next/image";
import { groupPeople, loadAllPeople, type Person } from "@/lib/people";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the Preferred.AI team and alumni",
};

function TeamMemberCard({ member }: { member: Person }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="group mb-4 block">
        <div className="relative aspect-square w-48 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover"
            sizes="192px"
          />
        </div>
      </div>
      <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
      {member.title && (
        <p className="mb-2 text-sm text-muted-foreground">{member.title}</p>
      )}
      {member.url && (
        <a
          href={member.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          {member.url.replace(/\/$/, "")}
        </a>
      )}
    </div>
  );
}

function TeamSection({ members }: { members: readonly Person[] }) {
  // Check if last row has only 1 person (odd number of members)
  const hasOddMember = members.length % 2 === 1;

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      {members.map((member, index) => {
        const isLastAndOdd = hasOddMember && index === members.length - 1;
        return (
          <div
            key={member.slug}
            className={
              isLastAndOdd ? "sm:col-span-2 sm:flex sm:justify-center" : ""
            }
          >
            <TeamMemberCard member={member} />
          </div>
        );
      })}
    </div>
  );
}

export default function PeoplePage() {
  const { professors, staff, students, alumni } = groupPeople(loadAllPeople());

  return (
    <div>
      <h1 className="mb-12 text-center text-3xl font-bold uppercase tracking-wide text-foreground">
        Meet the Team
      </h1>

      {/* Professors */}
      <div className="mb-12 flex justify-center">
        {professors.map((member) => (
          <TeamMemberCard key={member.slug} member={member} />
        ))}
      </div>

      {/* Staff */}
      <h2 className="mb-8 text-center text-xl font-semibold uppercase tracking-wide text-foreground">
        Research Staff
      </h2>
      <div className="mb-12">
        <TeamSection members={staff} />
      </div>

      {/* Students */}
      <h2 className="mb-8 text-center text-xl font-semibold uppercase tracking-wide text-foreground">
        Students
      </h2>
      <div className="mb-16">
        <TeamSection members={students} />
      </div>

      <hr className="my-12 border-t-2 border-border/60" />

      <h2 className="mb-12 text-center text-2xl font-bold uppercase tracking-wide text-foreground">
        Alumni
      </h2>

      <TeamSection members={alumni} />
    </div>
  );
}
