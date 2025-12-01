import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TEAM_DATA, TeamMember } from "@/data/team";

export const metadata: Metadata = {
  title: "Team - Preferred.AI",
  description: "Meet the Preferred.AI team and alumni",
};

const professor = TEAM_DATA.professor;
const staff = TEAM_DATA.staff;

// Sort students: PhD Candidates first (alphabetically), then PhD co-supervisees (alphabetically)
const students: TeamMember[] = [...TEAM_DATA.students].sort((a, b) => {
  const isACand = a.title.includes("PhD Candidate");
  const isBCand = b.title.includes("PhD Candidate");

  // If both are same type, sort alphabetically by name
  if (isACand === isBCand) {
    return a.name.localeCompare(b.name);
  }

  // PhD Candidates come before co-supervisees
  return isACand ? -1 : 1;
});

// Sort alumni alphabetically by name
const alumni: TeamMember[] = [...TEAM_DATA.alumni].sort((a, b) =>
  a.name.localeCompare(b.name)
);

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Link href={member.url} className="group mb-4 block">
        <div className="relative aspect-square w-48 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            sizes="192px"
          />
        </div>
      </Link>
      <h3 className="mb-1 text-lg font-semibold">
        <Link href={member.url} className="hover:text-[#b91c1c]">
          {member.name}
        </Link>
      </h3>
      {member.title && (
        <p className="mb-2 text-sm text-gray-600">
          <Link href={member.url} className="hover:text-[#b91c1c]">
            {member.title}
          </Link>
        </p>
      )}
      {member.link && (
        <a
          href={member.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#b91c1c] hover:underline"
        >
          {member.link}
        </a>
      )}
    </div>
  );
}

function TeamSection({ members }: { members: readonly TeamMember[] }) {
  // Check if last row has only 1 person (odd number of members)
  const hasOddMember = members.length % 2 === 1;

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      {members.map((member, index) => {
        const isLastAndOdd = hasOddMember && index === members.length - 1;
        return (
          <div
            key={member.name}
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
  return (
    <div>
      <h1 className="mb-12 text-center text-3xl font-bold uppercase tracking-wide text-gray-800">
        Meet the Team
      </h1>

      {/* Professor */}
      <div className="mb-12 flex justify-center">
        {professor.map((member) => (
          <TeamMemberCard key={member.name} member={member} />
        ))}
      </div>

      {/* Staff */}
      <h2 className="mb-8 text-center text-xl font-semibold uppercase tracking-wide text-gray-700">
        Research Staffs
      </h2>
      <div className="mb-12">
        <TeamSection members={staff} />
      </div>

      {/* Students */}
      <h2 className="mb-8 text-center text-xl font-semibold uppercase tracking-wide text-gray-700">
        Students
      </h2>
      <div className="mb-16">
        <TeamSection members={students} />
      </div>

      <hr className="my-12 border-t-2 border-gray-300" />

      <h2 className="mb-12 text-center text-2xl font-bold uppercase tracking-wide text-gray-800">
        Alumni
      </h2>

      <TeamSection members={alumni} />
    </div>
  );
}
