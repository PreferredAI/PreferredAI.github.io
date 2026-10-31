# Publishing operations

## Repository boundaries

`PreferredAI/PreferredAI.github.io` contains both deployables and all published
editorial source:

- the root Next.js application is a static export;
- `apps/admin` is the server-rendered Keystatic application;
- posts and People records live in `content/posts` and `content/people`;
- editorial media lives in `public/uploads` and `public/team/members`.

The root application and `apps/admin` share dependency versions through the
pnpm workspace, but they have independent builds and deployments.

## Production deployments

`.github/workflows/nextjs.yml` validates and exports the root application, then
deploys `out/` to the Cloudflare Pages project `preferredai`. A push to `main`
that only changes `apps/admin` does not run this workflow. Manual runs accept an
exact `site_ref` for rollback.

`.github/workflows/deploy-admin.yml` builds only `apps/admin` with OpenNext and
deploys the `preferredai-admin` Worker. It runs when the admin application,
workspace manifests, lockfile, or its own workflow changes. Editorial-only
merges do not redeploy the Worker.

Use these protected GitHub environments:

- `website-production`: `CLOUDFLARE_ACCOUNT_ID` and a Pages API token restricted
  to the `preferredai` project;
- `admin-production`: `CLOUDFLARE_ACCOUNT_ID` and a Workers API token restricted
  to the `preferredai-admin` Worker;
- `editorial-publish`: `DEPLOY_KEY` (and optional automation GitHub App ID and
  private key; falls back to `GITHUB_TOKEN` + `DEPLOY_KEY` when unset).

If an optional automation GitHub App is configured (`PREFERREDAI_AUTOMATION_APP_ID`
and `PREFERREDAI_AUTOMATION_APP_PRIVATE_KEY`), install that App only on this
repository and grant Actions read, Checks read, Contents read/write, and Pull
requests read/write. When unset, `.github/workflows/publish-keystatic.yml`
operates natively using `GITHUB_TOKEN` for pull request management and
`DEPLOY_KEY` (a bypass actor on `main`) for branch rebasing and verified
fast-forward merges. Each workflow requests only the permissions needed by its
job.

## Keystatic publication flow

The admin Worker (`https://admin.preferred.ai/keystatic`) stores changes in
`PreferredAI/PreferredAI.github.io` on branches beginning with `keystatic/`.
Editors can click **+ New Blog Post** or **+ Edit People Info** in the bottom-right
**Keystatic Workflow** bar to create a fresh auto-named branch directly from the
latest `main` HEAD (e.g. `keystatic/post-2026-10-31-a1b2` or
`keystatic/people-alex-2026-10-31-c3d4`), check branch freshness, sync behind
branches, and jump directly to the build or open pull request.

1. Pushing a commit to a non-`main` branch triggers **one** `Test website build`
   run (`.github/workflows/test-build.yml`), which validates dependency audits,
   Markdown, People data, media references, the full static export, and the
   admin Worker without deployment secrets. Newly created empty branches (`0`
   commits ahead of `main`) exit cleanly in seconds without running a full build
   or opening a pull request.
2. Once `Test website build` succeeds on a `keystatic/*` push,
   `Publish Keystatic Changes` (`.github/workflows/publish-keystatic.yml`) runs:
   - If an eligible editorial branch (`content/posts/**`, `public/uploads/**`,
     `content/people/**`, `public/team/members/**`) has fallen behind `main`, it
     automatically rebases the branch onto `origin/main` using `DEPLOY_KEY` so
     `Test website build` re-verifies the rebased commit (or posts a single
     conflict notice on the PR if manual resolution is needed).
3. Once up to date with `main` and green on `Test website build`, the publisher
   creates or updates the pull request (`Keystatic (Blog): <slug>` or
   `Keystatic (People): <slug>`) and applies a quiet, low-noise approval policy:
   - **Blog-only edits** (`content/posts/**`, `public/uploads/**`): Opens the PR
     for history with **no reviewer ping**, immediately fast-forward merges the
     verified commit onto `main` via `DEPLOY_KEY`, and deletes the `keystatic/*`
     branch.
   - **People or mixed edits** (`content/people/**`, `public/team/members/**`):
     Opens the PR and requests **1 maintainer approval** (`@manhkhanhad` via
     `.github/CODEOWNERS`) **only after** `Test website build` has passed.
   - **Non-editorial edits**: Excluded from automatic merging; require manual
     maintainer review.
4. When a maintainer (`admin`, `maintain`, or `write` permission) submits an
   **Approve** review on an open `keystatic/*` PR, the `merge-on-approval` job in
   `.github/workflows/publish-keystatic.yml` verifies passing `audit` + `build`
   checks and editorial path eligibility, fast-forward merges onto `main` via
   `DEPLOY_KEY` (rebasing first if `main` moved ahead cleanly), and deletes the
   merged `keystatic/*` branch.
5. Advancing `main` via `DEPLOY_KEY` natively triggers
   `.github/workflows/nextjs.yml` to deploy the static website to Cloudflare
   Pages without redeploying the admin Worker.
6. `.github/workflows/scheduled-maintenance.yml` runs dependency maintenance
   exclusively on `main` and automatically prunes abandoned `keystatic/*`
   branches that have `0` commits ahead of `main`, no open pull request, and no
   activity for over 7 days.

Protect `main` with the repository ruleset (`id: 20780485`), requiring pull
requests, linear history, and the `audit` + `build` status checks.

## Maintainer handover & operations

- **Organization & GitHub App ownership**: The `PreferredAI` GitHub Organization
  owns both `PreferredAI/PreferredAI.github.io` and the `preferredai-keystatic`
  GitHub App (`https://github.com/organizations/PreferredAI/settings/apps/preferredai-keystatic`),
  so individual maintainer departures do not break Keystatic OAuth or branch
  access. `hadylauw` holds Organization `Owner` and Repository `admin`.
- **Day-to-day maintainer (`@manhkhanhad`)**:
  - Holds Repository `maintain` permission, Cloudflare team access, `.github/CODEOWNERS`
    ownership (People records, workflows, `apps/admin`), and bypass eligibility
    on the `main` branch ruleset (`id: 20780485`).
  - Reviews and merges People/mixed editorial PRs and code/infrastructure PRs.
  - Note: Repository `maintain` covers all routine editorial, branch, PR, and
    Actions operations. Repository `admin` (via `hadylauw`) is only required if
    rotating GitHub Actions repository secrets (`DEPLOY_KEY`, Cloudflare tokens,
    or Keystatic OAuth secrets) or editing repository rulesets.
- **Completing transition cleanup**: Once handover from `@hieuddo` is finalized,
  a repository admin can remove `@hieuddo` (`actor_id: 26546698`) from the
  `bypass_actors` list on ruleset `20780485` (`Settings -> Rules -> Rulesets -> main`)
  and downgrade or remove repository collaborator access as appropriate.

## Cloudflare and GitHub OAuth

- Attach the public site domains to the Pages project `preferredai`.
- Deploy `apps/admin/wrangler.jsonc`, which binds `admin.preferred.ai` as the
  `preferredai-admin` Worker custom domain and disables its `workers.dev`
  hostname.
- Set the Worker secrets `KEYSTATIC_GITHUB_CLIENT_ID`,
  `KEYSTATIC_GITHUB_CLIENT_SECRET`, and `KEYSTATIC_SECRET` outside the
  repository.
- Set the Keystatic GitHub App callback to
  `https://admin.preferred.ai/api/keystatic/github/oauth/callback`.
- Restrict the Keystatic GitHub App to this repository and verify that users
  without repository write access cannot save edits.

## Acceptance checks

Test blog-only, People-only, mixed, renamed, deleted, malicious Markdown,
malformed JSON, missing-media, and out-of-policy pull requests. Verify that
blog-only edits create a pull request without reviewer pings and auto-merge
after `Test website build` succeeds, while People edits request 1 maintainer
review after `Test website build` succeeds and auto-merge upon approval.

For production, verify `/`, blog pagination, People, category pages, feeds,
sitemap, robots, 404 responses, `/_next/**`, uploads, and team media. The export
must remain below 20,000 files and 25 MiB per file and must not contain a Worker
bundle or Pages Functions.

After rapid consecutive merges, confirm an older run cannot overwrite a newer
production revision. Test rollback by manually running the Pages workflow with
an exact earlier `site_ref`.
