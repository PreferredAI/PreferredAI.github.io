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
- `editorial-publish`: the automation GitHub App ID and private key;
- `content-preview`: the automation App credentials plus the Pages account ID
  and token.

The workflows expect the automation credentials as
`PREFERREDAI_AUTOMATION_APP_ID` and
`PREFERREDAI_AUTOMATION_APP_PRIVATE_KEY`. Install that App only on this
repository and grant Actions read, Contents read/write, and Pull requests
read/write. Each workflow requests only the permissions needed by its job.

## Keystatic publication flow

The admin Worker stores changes in `PreferredAI/PreferredAI.github.io` on
branches beginning with `keystatic/`.

1. A branch update triggers the trusted publisher workflow.
2. The publisher creates or reuses a pull request and rejects automatic
   publishing if the complete diff includes paths outside the four editorial
   directories.
3. The pull request validates Markdown, People data, media references, the
   static export, and the admin Worker without deployment secrets.
4. A trusted workflow downloads the static artifact without executing it,
   reclassifies the complete diff, and deploys it to the Pages branch
   `content-pr-<number>`.
5. After Access protection and `noindex` are verified, the workflow comments
   the preview URL and enables squash auto-merge for the exact branch head.
6. The merge advances `main`, which triggers the normal Pages production
   deployment. It does not trigger an admin Worker deployment.

Protect `main`, require pull requests and the validation checks, and allow the
automation App to create pull requests and enable auto-merge. Keep Pages preview
deployments behind Cloudflare Access.

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
malformed JSON, missing-media, and out-of-policy pull requests. Successful
previews must require Access, contain `noindex`, use `content-pr-<number>`, and
leave the production alias unchanged.

For production, verify `/`, blog pagination, People, category pages, feeds,
sitemap, robots, 404 responses, `/_next/**`, uploads, and team media. The export
must remain below 20,000 files and 25 MiB per file and must not contain a Worker
bundle or Pages Functions.

After rapid consecutive merges, confirm an older run cannot overwrite a newer
production revision. Test rollback by manually running the Pages workflow with
an exact earlier `site_ref`.
