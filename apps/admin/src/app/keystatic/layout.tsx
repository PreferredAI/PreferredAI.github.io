import type { Metadata } from "next";
import KeystaticApp from "./keystatic";
import KeystaticWorkflowAssistant from "./workflow-assistant";

const isGitHubStorage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "github" ||
  Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);

export const metadata: Metadata = {
  title: "Publisher",
  robots: { index: false, follow: false, nocache: true },
};

export default function Layout() {
  return (
    <>
      <KeystaticApp />
      {isGitHubStorage ? <KeystaticWorkflowAssistant /> : null}
    </>
  );
}
