"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const REPO_OWNER = "PreferredAI";
const REPO_NAME = "PreferredAI.github.io";
const DEFAULT_BRANCH = "main";
const BRANCH_PREFIX = "keystatic/";

interface BranchStatus {
  aheadBy: number;
  behindBy: number;
  hasPeopleChanges: boolean;
  isBlogOnly: boolean;
  prNumber: number | null;
  prUrl: string | null;
}

interface ParsedRoute {
  branch: string | null;
  collection: "posts" | "people" | null;
  itemSlug: string | null;
  isCreate: boolean;
}

function readAccessTokenCookie(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const raw of cookies) {
    const trimmed = raw.trim();
    if (trimmed.startsWith("keystatic-gh-access-token=")) {
      const value = trimmed.slice("keystatic-gh-access-token=".length);
      return value ? decodeURIComponent(value) : null;
    }
  }
  return null;
}

function sanitizeSegment(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shortRandomId(): string {
  return Math.random().toString(36).slice(2, 6);
}

function parseKeystaticPathname(pathname: string): ParsedRoute {
  const match = pathname.match(/^\/keystatic\/branch\/([^/]+)(?:\/(.*))?$/);
  if (!match) {
    return {
      branch: null,
      collection: null,
      itemSlug: null,
      isCreate: false,
    };
  }
  const branch = decodeURIComponent(match[1]);
  const rest = match[2] ?? "";
  const colMatch = rest.match(
    /^collection\/(posts|people)(?:\/(create|item\/([^/]+)))?/,
  );
  if (!colMatch) {
    return {
      branch,
      collection: null,
      itemSlug: null,
      isCreate: false,
    };
  }
  const collection = colMatch[1] as "posts" | "people";
  const isCreate = colMatch[2] === "create";
  const itemSlug = colMatch[3] ? decodeURIComponent(colMatch[3]) : null;
  return { branch, collection, itemSlug, isCreate };
}

function suggestDialogBranchSuffix(
  route: ParsedRoute,
  username: string | null,
): string {
  const date = todayIsoDate();
  const suffix = shortRandomId();
  const userPart = username ? sanitizeSegment(username) : suffix;

  if (route.collection === "people") {
    const target = route.itemSlug ? sanitizeSegment(route.itemSlug) : userPart;
    return `people-${target || "update"}-${date}-${suffix}`;
  }
  if (route.collection === "posts") {
    const target = route.itemSlug ? sanitizeSegment(route.itemSlug) : userPart;
    return `post-${target || "draft"}-${date}-${suffix}`;
  }
  return `edit-${userPart}-${date}-${suffix}`;
}

function setReactInputValue(input: HTMLInputElement, value: string): void {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  );
  if (descriptor?.set) {
    descriptor.set.call(input, value);
  } else {
    input.value = value;
  }
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

async function githubFetch(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
}

export default function KeystaticWorkflowAssistant() {
  const [token, setToken] = useState<string | null>(null);
  const [pathname, setPathname] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const [status, setStatus] = useState<BranchStatus | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const syncLocationAndCookie = () => {
      setToken(readAccessTokenCookie());
      setPathname(window.location.pathname);
    };
    syncLocationAndCookie();
    window.addEventListener("popstate", syncLocationAndCookie);
    const timer = window.setInterval(syncLocationAndCookie, 700);
    return () => {
      window.removeEventListener("popstate", syncLocationAndCookie);
      window.clearInterval(timer);
    };
  }, []);

  const route = useMemo(() => parseKeystaticPathname(pathname), [pathname]);

  useEffect(() => {
    if (!token) {
      setUsername(null);
      return;
    }
    let cancelled = false;
    githubFetch("/user", token)
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { login?: string };
        if (!cancelled && data.login) {
          setUsername(data.login);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Auto-fill Keystatic's native "New branch" modal when opened with an empty input
  useEffect(() => {
    if (!token || typeof document === "undefined") return;

    const tryAutoFillDialog = () => {
      const dialogs = document.querySelectorAll<HTMLElement>('[role="dialog"]');
      for (const dialog of dialogs) {
        const heading = dialog.querySelector("h1, h2, h3");
        const headingText = heading?.textContent?.trim().toLowerCase() ?? "";
        if (headingText !== "new branch") continue;

        const input = dialog.querySelector<HTMLInputElement>(
          'input[type="text"], input:not([type])',
        );
        if (!input || input.dataset.ksAutoNamed === "true") continue;
        input.dataset.ksAutoNamed = "true";

        if (input.value.trim() === "") {
          const currentRoute = parseKeystaticPathname(window.location.pathname);
          const suggested = suggestDialogBranchSuffix(currentRoute, username);
          window.requestAnimationFrame(() => {
            if (input.value.trim() === "") {
              setReactInputValue(input, suggested);
              input.select();
            }
          });
        }
      }
    };

    const observer = new MutationObserver(tryAutoFillDialog);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [token, username]);

  const currentBranch = route.branch;
  const isKeystaticBranch = Boolean(currentBranch?.startsWith(BRANCH_PREFIX));

  const fetchBranchStatus = useCallback(
    async (isCancelled?: () => boolean) => {
      if (!token || !currentBranch || !isKeystaticBranch) {
        setStatus(null);
        return;
      }
      try {
        const encodedBranchRef = currentBranch
          .split("/")
          .map(encodeURIComponent)
          .join("/");
        const [compareRes, prsRes] = await Promise.all([
          githubFetch(
            `/repos/${REPO_OWNER}/${REPO_NAME}/compare/${DEFAULT_BRANCH}...${encodedBranchRef}`,
            token,
          ),
          githubFetch(
            `/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=open&base=${DEFAULT_BRANCH}&head=${encodeURIComponent(`${REPO_OWNER}:${currentBranch}`)}`,
            token,
          ),
        ]);
        if (!compareRes.ok || isCancelled?.()) return;
        const compareData = (await compareRes.json()) as {
          ahead_by?: number;
          behind_by?: number;
          files?: Array<{ filename?: string }>;
        };
        const files = compareData.files ?? [];
        const hasPeopleChanges = files.some(
          (f) =>
            f.filename?.startsWith("content/people/") ||
            f.filename?.startsWith("public/team/members/"),
        );
        const allEditorial =
          files.length > 0 &&
          files.every(
            (f) =>
              f.filename?.startsWith("content/posts/") ||
              f.filename?.startsWith("public/uploads/") ||
              f.filename?.startsWith("content/people/") ||
              f.filename?.startsWith("public/team/members/"),
          );

        let prNumber: number | null = null;
        let prUrl: string | null = null;
        if (prsRes.ok) {
          const prs = (await prsRes.json()) as Array<{
            number?: number;
            html_url?: string;
          }>;
          if (prs[0]?.number && prs[0]?.html_url) {
            prNumber = prs[0].number;
            prUrl = prs[0].html_url;
          }
        }

        if (!isCancelled?.()) {
          setStatus({
            aheadBy: compareData.ahead_by ?? 0,
            behindBy: compareData.behind_by ?? 0,
            hasPeopleChanges,
            isBlogOnly: allEditorial && !hasPeopleChanges,
            prNumber,
            prUrl,
          });
        }
      } catch {
        // Ignore transient network errors in status polling
      }
    },
    [token, currentBranch, isKeystaticBranch],
  );

  // Fetch branch comparison & open PR status when on a keystatic/* branch
  useEffect(() => {
    if (!token || !currentBranch || !isKeystaticBranch) {
      setStatus(null);
      return;
    }
    let cancelled = false;
    const checkCancelled = () => cancelled;

    void fetchBranchStatus(checkCancelled);
    // Re-check once after 12s if branch has commits but PR is still being created by CI
    const followUp = window.setTimeout(() => {
      void fetchBranchStatus(checkCancelled);
    }, 12000);

    return () => {
      cancelled = true;
      window.clearTimeout(followUp);
    };
  }, [token, currentBranch, isKeystaticBranch, fetchBranchStatus]);

  const createFreshBranchAndNavigate = useCallback(
    async (kind: "posts" | "people") => {
      if (!token) return;
      setBusyAction(kind);
      setErrorMsg(null);
      try {
        const refRes = await githubFetch(
          `/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${DEFAULT_BRANCH}`,
          token,
        );
        if (!refRes.ok) {
          throw new Error("Could not read latest main branch from GitHub.");
        }
        const refData = (await refRes.json()) as {
          object?: { sha?: string };
        };
        const sha = refData.object?.sha;
        if (!sha) {
          throw new Error("Missing main commit SHA from GitHub.");
        }

        const date = todayIsoDate();
        const rand = shortRandomId();
        const userPart = username ? sanitizeSegment(username) : rand;
        const personSlug =
          kind === "people" && route.collection === "people" && route.itemSlug
            ? sanitizeSegment(route.itemSlug)
            : null;

        const suffix =
          kind === "posts"
            ? `post-${date}-${userPart}-${rand}`
            : personSlug
              ? `people-${personSlug}-${date}-${rand}`
              : `people-${date}-${userPart}-${rand}`;
        const fullBranch = `${BRANCH_PREFIX}${suffix}`;

        const createRes = await githubFetch(
          `/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`,
          token,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ref: `refs/heads/${fullBranch}`,
              sha,
            }),
          },
        );
        if (!createRes.ok) {
          throw new Error("Failed to create editorial branch on GitHub.");
        }

        const encodedBranch = encodeURIComponent(fullBranch);
        const destination =
          kind === "posts"
            ? `/keystatic/branch/${encodedBranch}/collection/posts/create`
            : route.collection === "people" && route.itemSlug
              ? `/keystatic/branch/${encodedBranch}/collection/people/item/${encodeURIComponent(route.itemSlug)}`
              : `/keystatic/branch/${encodedBranch}/collection/people`;

        window.location.assign(destination);
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : "Could not create branch.",
        );
        setBusyAction(null);
      }
    },
    [token, username, route.collection, route.itemSlug],
  );

  const syncBranchWithMain = useCallback(async () => {
    if (!token || !currentBranch) return;
    setBusyAction("sync");
    setErrorMsg(null);
    try {
      const mergeRes = await githubFetch(
        `/repos/${REPO_OWNER}/${REPO_NAME}/merges`,
        token,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base: currentBranch,
            head: DEFAULT_BRANCH,
            commit_message: `chore: sync ${currentBranch} with ${DEFAULT_BRANCH}`,
          }),
        },
      );
      if (mergeRes.status === 409) {
        setErrorMsg(
          "Merge conflict with main — open the PR on GitHub or start a fresh branch.",
        );
        setBusyAction(null);
        return;
      }
      if (!mergeRes.ok && mergeRes.status !== 204) {
        throw new Error("Could not sync branch with main.");
      }
      window.location.reload();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Sync failed.");
      setBusyAction(null);
    }
  }, [token, currentBranch]);

  if (!token || !currentBranch) {
    return null;
  }

  if (collapsed) {
    return (
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 9999,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: "#18181b",
            color: "#fafafa",
            border: "1px solid #3f3f46",
            borderRadius: 999,
            padding: "7px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
          }}
        >
          Quick Publish ▴
        </button>
      </div>
    );
  }

  const isMain = currentBranch === DEFAULT_BRANCH;
  const peopleButtonLabel =
    route.collection === "people" && route.itemSlug
      ? `+ Edit "${route.itemSlug}"`
      : "+ Edit People Info";
  const actionsHref = `https://github.com/${REPO_OWNER}/${REPO_NAME}/actions?query=${encodeURIComponent(`branch:${currentBranch}`)}`;

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        maxWidth: 440,
        background: "#18181b",
        color: "#f4f4f5",
        border: "1px solid #3f3f46",
        borderRadius: 12,
        padding: "10px 12px",
        fontSize: 12,
        lineHeight: 1.4,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.28)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isMain ? "#f59e0b" : "#10b981",
            }}
          />
          <strong style={{ fontSize: 12 }}>
            {isMain ? "main (read-only)" : currentBranch}
          </strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {isKeystaticBranch && (
            <button
              onClick={() => {
                void fetchBranchStatus();
              }}
              title="Refresh branch & PR status"
              style={{
                background: "transparent",
                color: "#a1a1aa",
                border: "none",
                cursor: "pointer",
                padding: "2px 5px",
                fontSize: 13,
              }}
            >
              ↻
            </button>
          )}
          <button
            onClick={() => setCollapsed(true)}
            title="Minimize helper"
            style={{
              background: "transparent",
              color: "#a1a1aa",
              border: "none",
              cursor: "pointer",
              padding: "2px 5px",
              fontSize: 12,
            }}
          >
            ▾
          </button>
        </div>
      </div>

      {isMain && (
        <div style={{ color: "#d4d4d8", marginBottom: 8 }}>
          Start a fresh auto-named branch from latest <code>main</code>:
        </div>
      )}

      {!isMain && status && status.behindBy > 0 && status.aheadBy === 0 && (
        <div
          style={{
            background: "#451a03",
            border: "1px solid #92400e",
            color: "#fde68a",
            borderRadius: 8,
            padding: "6px 8px",
            marginBottom: 8,
          }}
        >
          This old branch has <strong>0 unpublished edits</strong> and is{" "}
          <strong>{status.behindBy} commits behind main</strong>. Start a fresh
          branch below before editing.
        </div>
      )}

      {!isMain && status && status.behindBy > 0 && status.aheadBy > 0 && (
        <div
          style={{
            background: "#451a03",
            border: "1px solid #92400e",
            color: "#fde68a",
            borderRadius: 8,
            padding: "6px 8px",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span>
            Draft is <strong>{status.behindBy} commits behind main</strong>.
          </span>
          <button
            disabled={busyAction !== null}
            onClick={() => void syncBranchWithMain()}
            style={{
              background: "#d97706",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 11,
              fontWeight: 600,
              cursor: busyAction ? "wait" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {busyAction === "sync" ? "Syncing..." : "Sync with main"}
          </button>
        </div>
      )}

      {!isMain && status && status.aheadBy > 0 && (
        <div
          style={{
            background: "#27272a",
            borderRadius: 8,
            padding: "6px 8px",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span style={{ color: "#d4d4d8" }}>
            {status.isBlogOnly
              ? "Blog post: auto-merges once build passes"
              : status.hasPeopleChanges
                ? "People edit: requests review after build, then auto-merges"
                : `${status.aheadBy} saved commit(s)`}
          </span>
          {status.prUrl && status.prNumber ? (
            <a
              href={status.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#2563eb",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              PR #{status.prNumber} ↗
            </a>
          ) : (
            <a
              href={actionsHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#3f3f46",
                color: "#fafafa",
                textDecoration: "none",
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              View Build ↗
            </a>
          )}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <button
          disabled={busyAction !== null}
          onClick={() => void createFreshBranchAndNavigate("posts")}
          style={{
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: 7,
            padding: "6px 10px",
            fontSize: 12,
            fontWeight: 600,
            cursor: busyAction ? "wait" : "pointer",
          }}
        >
          {busyAction === "posts" ? "Creating branch..." : "+ New Blog Post"}
        </button>
        <button
          disabled={busyAction !== null}
          onClick={() => void createFreshBranchAndNavigate("people")}
          style={{
            background: "#3f3f46",
            color: "#fafafa",
            border: "1px solid #52525b",
            borderRadius: 7,
            padding: "6px 10px",
            fontSize: 12,
            fontWeight: 600,
            cursor: busyAction ? "wait" : "pointer",
          }}
        >
          {busyAction === "people" ? "Creating branch..." : peopleButtonLabel}
        </button>
      </div>

      {errorMsg && (
        <div style={{ color: "#fca5a5", marginTop: 6, fontSize: 11 }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
