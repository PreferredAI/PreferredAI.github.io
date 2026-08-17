# Preferred.AI Website

The public site and the Keystatic editor are deployed together as a Next.js application on Cloudflare Workers. Editors can publish blog posts and team-member profiles from [preferred.ai/keystatic](https://preferred.ai/keystatic); GitHub pull requests provide validation, approvals, and an audit trail.

## Local development

Install Node.js 22 or newer and pnpm, then run:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the website or [http://localhost:3000/keystatic](http://localhost:3000/keystatic) for the local editor. Local Keystatic writes directly to the working tree, so review the changed files before committing them.

Useful checks before opening a pull request:

```bash
pnpm check
pnpm build:worker
```

`pnpm check` runs linting, type checking, Markdown security checks, People-content validation, and publishing-policy tests. The Worker build also regenerates the blog and People aggregate data used in production.

## Browser publishing with Keystatic

Go to [preferred.ai/keystatic](https://preferred.ai/keystatic) and sign in with GitHub. Saving an entry creates or updates a branch whose name begins with `keystatic/`. The publishing automation then:

1. Creates or reuses a pull request for the complete branch diff.
2. Classifies every changed path as blog, People, mixed editorial, or non-editorial.
3. Runs `Test Build`, including content validation, dependency audit, image optimization, and the full Cloudflare Worker build.
4. Enables squash auto-merge only when the diff is limited to approved editorial paths.
5. Deploys the production Worker after the pull request merges into `main`.

### Write a blog post

1. Open **Posts** and choose **Create post**.
2. Enter the title first; it becomes the post slug and image-folder name.
3. Choose or drop a featured image into **Featured image**.
4. Write the post in **Content**. Use the image toolbar, paste an image, or drag and drop it into the editor.
5. Add useful alt text, preview the post, and save.

New posts and images are stored together:

```text
content/posts/my-new-post.md
public/uploads/my-new-post/cover.jpg
public/uploads/my-new-post/diagram-one.png
```

Existing posts may keep their legacy `/uploads/YYYY/MM/...` paths. Leave **Existing featured image path (legacy)** empty for a new post.

A blog-only pull request merges automatically after all required checks pass; it does not need a peer approval.

### Update Team Members

1. Open **People**, then create or select a profile.
2. Enter the person's name and confirm the URL-safe slug. The slug also names the managed photo directory.
3. Choose **Professor**, **Research Staff**, **PhD Candidate**, **PhD Co-supervisee**, or **Alumni**.
4. Upload or replace the profile photo and optionally add a title and personal or professional URL.
5. Preview `/people`, then save.

Each profile and its photo are stored under the same slug:

```text
content/people/jane-doe.json
public/team/members/jane-doe/photo.jpg
```

Delete profiles and replace photos through Keystatic so the record and managed image stay in sync.

A People pull request currently merges automatically after all required checks pass, without a peer approval. Mixed blog-and-People changes follow the same check-only editorial policy.

### Publishing policy

| Complete pull-request diff                    | Merge requirement                                  |
| --------------------------------------------- | -------------------------------------------------- |
| `content/posts/**`, `public/uploads/**`       | Required checks                                    |
| `content/people/**`, `public/team/members/**` | Required checks                                    |
| A mixture of the two editorial groups         | Required checks                                    |
| Any other path                                | Editorial auto-merge is disabled and need approval |

The classifier evaluates the complete diff, so adding a code or configuration file to an editorial branch cannot bypass technical review.

## Local authoring fallback

The local Keystatic editor is the preferred fallback when the hosted editor is unavailable: run `pnpm dev`, edit at [http://localhost:3000/keystatic](http://localhost:3000/keystatic), preview the result, and commit the generated content and images to a new branch.

Blog posts can also be edited directly in `content/posts/` using [.github/BLOG_POST_TEMPLATE.md](.github/BLOG_POST_TEMPLATE.md). Put their images in `public/uploads/`, preview locally, run the checks above, and open a pull request. People records should be changed through Keystatic because it keeps their JSON and managed photos aligned.

## Hosted Keystatic configuration

Keystatic needs server-side API routes and GitHub OAuth, so production must use the full-stack Worker build rather than a static export. Configure these GitHub Actions variables and secrets:

```dotenv
NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github
KEYSTATIC_GITHUB_CLIENT_ID=...
KEYSTATIC_GITHUB_CLIENT_SECRET=...
KEYSTATIC_SECRET=...
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=...
```

Use `.env.example` as the local checklist. Give the GitHub App access only to `PreferredAI/PreferredAI.github.io`; browser editors must have repository write access.

For initial GitHub App setup, run:

```bash
NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github pnpm dev
```

Then open [http://127.0.0.1:3000/keystatic/setup](http://127.0.0.1:3000/keystatic/setup). The storage-kind value is public configuration; the client secret and `KEYSTATIC_SECRET` must remain secret.
