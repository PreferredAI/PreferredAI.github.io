import type { Metadata } from "next";
import Image from "next/image";
import { groupPeople, loadAllPeople, type Person } from "@/lib/people";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the Preferred.AI team and alumni",
};

function TeamMemberCard({
  member,
  priority,
}: {
  member: Person;
  priority?: boolean;
}) {
  return (
    <div className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
      <div className="relative aspect-square w-32 sm:w-36 overflow-hidden rounded-xl bg-muted mb-3.5 border border-border/60 group-hover:border-primary/30 transition-colors">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 128px, 144px"
          priority={priority}
        />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
        {member.name}
      </h3>
      {member.title && (
        <p className="text-xs text-muted-foreground mt-1 mb-2 leading-tight">
          {member.title}
        </p>
      )}
      {member.url && (
        <a
          href={member.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-1 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors group/link"
        >
          <span>Website</span>
          <span className="text-[10px] font-mono group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform">
            ↗
          </span>
        </a>
      )}
    </div>
  );
}

function TeamSection({
  members,
  priority = false,
}: {
  members: readonly Person[];
  priority?: boolean;
}) {
  if (members.length === 1) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-[280px]">
          <TeamMemberCard member={members[0]} priority={priority} />
        </div>
      </div>
    );
  }

  if (members.length === 2) {
    return (
      <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
        {members.map((member, idx) => (
          <div key={member.slug} className="w-full sm:w-[280px]">
            <TeamMemberCard member={member} priority={priority && idx === 0} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
      {members.map((member, idx) => (
        <div
          key={member.slug}
          className="w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] sm:max-w-[280px]"
        >
          <TeamMemberCard member={member} priority={priority && idx === 0} />
        </div>
      ))}
    </div>
  );
}

export default function PeoplePage() {
  const { professors, staff, students, alumni } = groupPeople(loadAllPeople());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Meet the Team
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Faculty, researchers, students, and alumni at Preferred.AI
        </p>
      </div>

      {/* Faculty */}
      {professors.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground/80 mb-4 select-none">
            Faculty
          </h2>
          <TeamSection members={professors} priority={true} />
        </div>
      )}

      {/* Staff */}
      {staff.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground/80 mb-4 select-none">
            Research Staff
          </h2>
          <TeamSection members={staff} />
        </div>
      )}

      {/* Students */}
      {students.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground/80 mb-4 select-none">
            PhD Candidates &amp; Students
          </h2>
          <TeamSection members={students} />
        </div>
      )}

      <hr className="my-10 border-t border-border/60" />

      {/* Alumni */}
      {alumni.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground/80 mb-4 select-none">
            Alumni
          </h2>
          <TeamSection members={alumni} />
        </div>
      )}
    </div>
  );
}
