# Preferred.AI website

## Local setup

Use Node.js 22 or newer and pnpm:

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Write a blog post manually

Create a lowercase, URL-safe Markdown file in `content/posts/`, then put its
images in `public/uploads/`. A minimal post looks like this:

```markdown
---
title: My New Post
date: 2026-08-29
author: Preferred.AI
excerpt: A short summary shown on the blog index.
cover: /uploads/my-new-post/cover.jpg
categories:
  - Education
tags: []
---

Write the post here.
```

Valid categories are `Announcement`, `Defense`, `Education`, `Presentation`,
`Publication`, `Social`, `Travel`, and `Video`. The reusable starter is
[`.github/BLOG_POST_TEMPLATE.md`](.github/BLOG_POST_TEMPLATE.md).

`pnpm dev` generates the content and image indexes when it starts. After
editing Markdown or media while the server is running, refresh them in another
terminal:

```bash
pnpm prepare:site
```

Restart `pnpm dev` if the page does not update.

## Publish on `admin.preferred.ai` (Keystatic)

Sign in with GitHub at <https://admin.preferred.ai/keystatic> and use the
**Keystatic Workflow** quick-actions bar in the bottom-right corner:

1. Click **+ New Blog Post** or **+ Edit People Info** to create a fresh,
   auto-named `keystatic/*` branch directly from `main` (avoiding outdated
   unpublished branches). If you use Keystatic's built-in **New branch** dialog,
   a timestamped branch name is also pre-filled automatically.
2. Write the post or update the People entry and click **Save**.
3. GitHub Actions runs a single `Test website build` check:
   - **Blog-only changes** (`content/posts/**`, `public/uploads/**`)
     automatically open a pull request (without reviewer notifications) and
     auto-merge into `main` as soon as the build passes.
   - **People or mixed changes** (`content/people/**`, `public/team/members/**`)
     open a pull request after the build passes, request **1 maintainer
     approval** (`@manhkhanhad`), and auto-merge once approved.

See [`docs/publishing-operations.md`](docs/publishing-operations.md) for full
workflow and maintainer details.

## Write with Keystatic locally

Keystatic provides a form-based alternative to editing Markdown:

```bash
pnpm --filter @preferredai/admin dev
```

Open <http://localhost:3000/keystatic>. The local admin app links directly to
this repository's `content/posts`, `content/people`, `public/uploads`, and
`public/team/members` directories. Its edits are ordinary local files that can
be reviewed with Git. Stop the website dev server first because both commands
use port 3000 by default.

## Local checks

```bash
pnpm check
pnpm build
pnpm --filter @preferredai/admin typecheck
```
