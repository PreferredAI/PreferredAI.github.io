"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { PeopleGroups, Person } from "@/lib/people-schema";

function TeamMemberCard({
  member,
  priority,
  onSelectAlumnus,
}: {
  member: Person;
  priority?: boolean;
  onSelectAlumnus?: (member: Person) => void;
}) {
  const hasAlumniDetails =
    member.placement === "alumni" &&
    Boolean(
      (member.employment && member.employment.length > 0) ||
        member.role ||
        member.title,
    );

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

      {member.role && (
        <span className="inline-flex items-center px-2.5 py-0.5 mt-1.5 rounded-full text-[11px] font-medium bg-muted/80 text-foreground/80 border border-border/70 leading-tight">
          {member.role}
        </span>
      )}

      {member.title && (
        <p className="text-xs text-muted-foreground mt-1.5 mb-2 leading-snug">
          {member.title}
        </p>
      )}

      {(member.url || hasAlumniDetails) && (
        <div className="mt-auto pt-2 flex items-center justify-center gap-2 flex-wrap">
          {hasAlumniDetails && onSelectAlumnus && (
            <button
              type="button"
              onClick={() => onSelectAlumnus(member)}
              aria-haspopup="dialog"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/70 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <span>Career</span>
              <span className="text-[10px] leading-none" aria-hidden="true">
                ⋯
              </span>
            </button>
          )}
          {member.url && (
            <a
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors group/link"
            >
              <span>Website</span>
              <span
                className="text-[10px] font-mono group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function TeamSection({
  members,
  priority = false,
  onSelectAlumnus,
}: {
  members: readonly Person[];
  priority?: boolean;
  onSelectAlumnus?: (member: Person) => void;
}) {
  if (members.length === 1) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-[280px]">
          <TeamMemberCard
            member={members[0]}
            priority={priority}
            onSelectAlumnus={onSelectAlumnus}
          />
        </div>
      </div>
    );
  }

  if (members.length === 2) {
    return (
      <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
        {members.map((member, idx) => (
          <div key={member.slug} className="w-full sm:w-[280px]">
            <TeamMemberCard
              member={member}
              priority={priority && idx === 0}
              onSelectAlumnus={onSelectAlumnus}
            />
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
          <TeamMemberCard
            member={member}
            priority={priority && idx === 0}
            onSelectAlumnus={onSelectAlumnus}
          />
        </div>
      ))}
    </div>
  );
}

function AlumniDetailModal({
  member,
  onClose,
}: {
  member: Person;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const employmentList =
    member.employment && member.employment.length > 0
      ? member.employment
      : member.title
        ? [member.title]
        : [];

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs motion-safe:animate-fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-xl p-5 sm:p-6 text-left motion-safe:animate-slide-up-fade"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close alumni details"
          className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-4 pr-8">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/60">
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0">
            <h3
              id={titleId}
              className="text-base sm:text-lg font-bold text-foreground leading-snug mb-0"
            >
              {member.name}
            </h3>
            {member.role && (
              <p className="text-xs font-medium text-primary mt-0.5">
                {member.role}
              </p>
            )}
            {member.title && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {member.title}
              </p>
            )}
          </div>
        </div>

        {employmentList.length > 0 && (
          <div className="mt-5 pt-4 border-t border-border/60">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-3">
              Career &amp; Employment History
            </h4>
            <ol className="relative border-l border-border/80 ml-2 space-y-3">
              {employmentList.map((entry, idx) => (
                <li key={entry} className="pl-4 relative">
                  <span
                    className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card ${
                      idx === 0 ? "bg-primary" : "bg-muted-foreground/50"
                    }`}
                    aria-hidden="true"
                  />
                  <p
                    className={`text-xs leading-relaxed ${
                      idx === 0
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {entry}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-end gap-2">
          {member.url && (
            <a
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
            >
              <span>Visit Website</span>
              <span className="text-[11px] font-mono" aria-hidden="true">
                ↗
              </span>
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PeopleDirectory({ groups }: { groups: PeopleGroups }) {
  const { professors, staff, students, alumni } = groups;
  const [selectedAlumnus, setSelectedAlumnus] = useState<Person | null>(null);

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
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground/80 mb-0 select-none">
              Alumni
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Listed in reverse chronological order &middot; Select{" "}
              <span className="font-medium text-foreground/80">Career</span> for
              employment history
            </p>
          </div>
          <TeamSection
            members={alumni}
            onSelectAlumnus={(member) => setSelectedAlumnus(member)}
          />
        </div>
      )}

      {selectedAlumnus && (
        <AlumniDetailModal
          member={selectedAlumnus}
          onClose={() => setSelectedAlumnus(null)}
        />
      )}
    </div>
  );
}
