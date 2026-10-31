import type { Metadata } from "next";
import generatedPeople from "../../../../../src/data/generated-people.json";
import generatedPosts from "../../../../../src/data/generated-posts.json";
import type { PersonSortEntry, PostSortEntry } from "../../lib/collection-sort";
import KeystaticApp from "./keystatic";
import KeystaticWorkflowAssistant from "./workflow-assistant";

const isGitHubStorage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "github" ||
  Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);

const initialPosts: PostSortEntry[] = generatedPosts.posts.map((post) => ({
  slug: post.slug,
  date: post.date,
}));

const initialPeople: PersonSortEntry[] = generatedPeople.map((person) => ({
  slug: person.slug,
  name: person.name,
  placement: person.placement,
  ...("alumniSort" in person && typeof person.alumniSort === "string"
    ? { alumniSort: person.alumniSort }
    : {}),
}));

export const metadata: Metadata = {
  title: "Publisher",
  robots: { index: false, follow: false, nocache: true },
};

export default function Layout() {
  return (
    <>
      <KeystaticApp initialPosts={initialPosts} initialPeople={initialPeople} />
      {isGitHubStorage ? <KeystaticWorkflowAssistant /> : null}
    </>
  );
}
