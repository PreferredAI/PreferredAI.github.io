"use client";

import type { Config } from "@keystatic/core";
import { Keystatic } from "@keystatic/core/ui";
import { createElement, useEffect, useMemo, useState } from "react";
import {
  type CollectionSortRanks,
  createKeystaticConfig,
} from "../../../keystatic.config";
import {
  buildPeopleSortRanks,
  buildPostSortRanks,
  type PersonSortEntry,
  type PostSortEntry,
  parsePersonJsonSortEntry,
  parsePostMarkdownSortEntry,
  ranksEqual,
} from "../../lib/collection-sort";

const REPO_OWNER = "PreferredAI";
const REPO_NAME = "PreferredAI.github.io";
const ACCESS_TOKEN_COOKIE = "keystatic-gh-access-token";

const appSlug = {
  envName: "NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG",
  value: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
};

const GITHUB_SORT_QUERY = `
  query KeystaticCollectionSort(
    $owner: String!
    $name: String!
    $postsExpr: String!
    $peopleExpr: String!
  ) {
    repository(owner: $owner, name: $name) {
      posts: object(expression: $postsExpr) {
        ... on Tree {
          entries {
            name
            object {
              ... on Blob {
                text
              }
            }
          }
        }
      }
      people: object(expression: $peopleExpr) {
        ... on Tree {
          entries {
            name
            object {
              ... on Blob {
                text
              }
            }
          }
        }
      }
    }
  }
`;

const localBlobTextCache = new Map<string, string>();

interface GraphQlTreeEntry {
  name?: string;
  object?: {
    text?: string | null;
  } | null;
}

interface GraphQlSortResponse {
  data?: {
    repository?: {
      posts?: { entries?: GraphQlTreeEntry[] } | null;
      people?: { entries?: GraphQlTreeEntry[] } | null;
    } | null;
  };
}

interface LocalTreeEntry {
  path: string;
  mode: string;
  sha: string;
}

function readAccessTokenCookie(): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${ACCESS_TOKEN_COOKIE}=`)) {
      const raw = trimmed.slice(ACCESS_TOKEN_COOKIE.length + 1);
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return null;
}

function parseCollectionListRoute(pathname: string): {
  mode: "github" | "local";
  branch: string;
  collection: string;
} | null {
  const ghMatch = pathname.match(
    /^\/keystatic\/branch\/([^/]+)\/collection\/(posts|people)\/?$/,
  );
  if (ghMatch) {
    let branch = ghMatch[1];
    try {
      branch = decodeURIComponent(branch);
    } catch {
      // Keep raw segment if malformed
    }
    return { mode: "github", branch, collection: ghMatch[2] };
  }

  const localMatch = pathname.match(
    /^\/keystatic\/collection\/(posts|people)\/?$/,
  );
  if (localMatch) {
    return { mode: "local", branch: "local", collection: localMatch[1] };
  }

  return null;
}

async function fetchGitHubSortRanks(
  branch: string,
  token: string,
): Promise<CollectionSortRanks | null> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GITHUB_SORT_QUERY,
      variables: {
        owner: REPO_OWNER,
        name: REPO_NAME,
        postsExpr: `refs/heads/${branch}:content/posts`,
        peopleExpr: `refs/heads/${branch}:content/people`,
      },
    }),
  });
  if (!response.ok) return null;

  const payload = (await response.json()) as GraphQlSortResponse;
  const repo = payload.data?.repository;
  if (!repo) return null;

  const posts: PostSortEntry[] = [];
  for (const entry of repo.posts?.entries ?? []) {
    if (
      !entry.name?.endsWith(".md") ||
      typeof entry.object?.text !== "string"
    ) {
      continue;
    }
    const slug = entry.name.slice(0, -3);
    posts.push(parsePostMarkdownSortEntry(slug, entry.object.text));
  }

  const people: PersonSortEntry[] = [];
  for (const entry of repo.people?.entries ?? []) {
    if (
      !entry.name?.endsWith(".json") ||
      typeof entry.object?.text !== "string"
    ) {
      continue;
    }
    const slug = entry.name.slice(0, -5);
    const parsed = parsePersonJsonSortEntry(slug, entry.object.text);
    if (parsed) {
      people.push(parsed);
    }
  }

  return {
    posts: buildPostSortRanks(posts),
    people: buildPeopleSortRanks(people),
  };
}

async function fetchLocalBlobText(entry: LocalTreeEntry): Promise<string> {
  const cached = localBlobTextCache.get(entry.sha);
  if (cached !== undefined) return cached;

  const response = await fetch(
    `/api/keystatic/blob/${entry.sha}/${entry.path}`,
    {
      headers: { "no-cors": "1" },
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to read local blob ${entry.path}`);
  }
  const text = await response.text();
  localBlobTextCache.set(entry.sha, text);
  return text;
}

async function fetchLocalSortRanks(): Promise<CollectionSortRanks | null> {
  const treeRes = await fetch("/api/keystatic/tree", {
    headers: { "no-cors": "1" },
  });
  if (!treeRes.ok) return null;

  const entries = (await treeRes.json()) as LocalTreeEntry[];
  if (!Array.isArray(entries)) return null;

  const postFiles = entries.filter(
    (entry) =>
      entry.path.startsWith("content/posts/") &&
      entry.path.endsWith(".md") &&
      !entry.path.slice("content/posts/".length).includes("/"),
  );
  const peopleFiles = entries.filter(
    (entry) =>
      entry.path.startsWith("content/people/") &&
      entry.path.endsWith(".json") &&
      !entry.path.slice("content/people/".length).includes("/"),
  );

  const [posts, peopleRaw] = await Promise.all([
    Promise.all(
      postFiles.map(async (entry) => {
        const slug = entry.path.slice("content/posts/".length, -3);
        const markdown = await fetchLocalBlobText(entry);
        return parsePostMarkdownSortEntry(slug, markdown);
      }),
    ),
    Promise.all(
      peopleFiles.map(async (entry) => {
        const slug = entry.path.slice("content/people/".length, -5);
        const json = await fetchLocalBlobText(entry);
        return parsePersonJsonSortEntry(slug, json);
      }),
    ),
  ]);

  const people = peopleRaw.filter(
    (person): person is PersonSortEntry => person !== null,
  );

  return {
    posts: buildPostSortRanks(posts),
    people: buildPeopleSortRanks(people),
  };
}

export interface KeystaticAppProps {
  initialPosts: readonly PostSortEntry[];
  initialPeople: readonly PersonSortEntry[];
}

export default function KeystaticApp({
  initialPosts,
  initialPeople,
}: KeystaticAppProps) {
  const [sortRanks, setSortRanks] = useState<CollectionSortRanks>(() => ({
    posts: buildPostSortRanks(initialPosts),
    people: buildPeopleSortRanks(initialPeople),
  }));
  const [pathname, setPathname] = useState<string>("");

  useEffect(() => {
    const syncPathname = () => {
      setPathname(window.location.pathname);
    };
    syncPathname();
    window.addEventListener("popstate", syncPathname);
    const interval = window.setInterval(syncPathname, 600);
    return () => {
      window.removeEventListener("popstate", syncPathname);
      window.clearInterval(interval);
    };
  }, []);

  const listRoute = useMemo(
    () => parseCollectionListRoute(pathname),
    [pathname],
  );
  const listMode = listRoute?.mode ?? null;
  const listBranch = listRoute?.branch ?? null;
  const listCollection = listRoute?.collection ?? null;

  useEffect(() => {
    if (!listMode || !listBranch || !listCollection) {
      return;
    }

    let cancelled = false;
    const refreshRanks = async () => {
      try {
        let nextRanks: CollectionSortRanks | null = null;
        if (listMode === "github") {
          const token = readAccessTokenCookie();
          if (!token) return;
          nextRanks = await fetchGitHubSortRanks(listBranch, token);
        } else {
          nextRanks = await fetchLocalSortRanks();
        }
        if (!nextRanks || cancelled) return;
        const resolved = nextRanks;

        setSortRanks((prev) => {
          if (
            ranksEqual(prev.posts, resolved.posts) &&
            ranksEqual(prev.people, resolved.people)
          ) {
            return prev;
          }
          return resolved;
        });
      } catch {
        // Keep seeded/previous sort order on transient errors
      }
    };

    void refreshRanks();
    return () => {
      cancelled = true;
    };
  }, [listMode, listBranch, listCollection]);

  const liveConfig = useMemo(
    () => createKeystaticConfig(sortRanks) as unknown as Config,
    [sortRanks],
  );

  return createElement(Keystatic, {
    config: liveConfig,
    appSlug,
  });
}
