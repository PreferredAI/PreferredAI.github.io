# Preferred.AI Website

## Quick Start (Development)

### Option 1: GitHub Codespaces (No Local Setup!)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/PreferredAI/PreferredAI.github.io)

1. Click the button above (or go to repo → **Code** → **Codespaces** → **Create codespace on main**)
2. Wait ~2-3 minutes for the environment to set up
3. Run the dev server:
   ```bash
   pnpm dev
   ```
4. A preview window will automatically open
5. Edit files in `content/posts/` and see live changes!
6. Commit and push when done

> **Free Tier Limits:**
> - **GitHub Free:** 120 core-hours/month (~60 hrs on 2-core machine)
> - **GitHub Pro:** 180 core-hours/month (~90 hrs on 2-core machine)
> - Auto-stops after 30 min idle (just close the tab when done!)
> - Check usage: [github.com/settings/billing](https://github.com/settings/billing)

### Option 2: Local Development

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Creating a Blog Post

### Admin UI (Recommended)

1. Open `/admin` (it redirects to Keystatic's required `/keystatic` route).
2. Open **Posts** and choose **Create post**.
3. Enter the title first. It becomes the post slug and its image-folder name.
4. Choose or drop a featured image into **Featured image**.
5. In **Content**, use the image toolbar button, paste an image, or drag and drop it into the editor.
6. Add useful alt text, preview the post, and save.

New images are committed with the post and organized automatically:

```text
content/posts/my-new-post.md
public/uploads/my-new-post/cover.jpg
public/uploads/my-new-post/diagram-one.png
```

Existing posts keep their legacy `/uploads/YYYY/MM/...` image paths. The **Existing featured image path (legacy)** field is only for those posts; leave it empty when creating a new post.

For local authoring, run `pnpm dev` and visit [http://localhost:3000/admin](http://localhost:3000/admin).

### Online Admin Setup (No Local `pnpm dev`)

Keystatic writes Markdown and images back to GitHub through server-side API routes. A static Cloudflare Pages export cannot run the admin API, so the hosted editor is deployed as a full-stack Next.js Worker through OpenNext. Set:

```dotenv
KEYSTATIC_STORAGE_KIND=github
NEXT_OUTPUT_MODE=server
KEYSTATIC_GITHUB_CLIENT_ID=...
KEYSTATIC_GITHUB_CLIENT_SECRET=...
KEYSTATIC_SECRET=...
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=...
```

Copy `.env.example` as a checklist. The GitHub App values can be generated from Keystatic's setup screen. Give the app access only to `PreferredAI/PreferredAI.github.io`; authors must have repository write access. A repository administrator can normally install Keystatic's repository-scoped app unless the organization has restricted installations to owners.

Run `pnpm build:worker` to produce the Cloudflare-compatible server build and `pnpm preview:worker` to test it locally. Keystatic requires server-side routes; a static export cannot provide its API or GitHub OAuth callbacks.

The `test-keystatic` branch deploys to the separate `preferredai-keystatic` Worker through `.github/workflows/deploy-keystatic-test.yml`. This leaves the existing Pages deployment and `preferred.ai` unchanged during testing.

The test workflow uses a separate `CLOUDFLARE_WORKERS_API_TOKEN` Actions secret. Do not replace the existing `CLOUDFLARE_API_TOKEN`, which remains scoped to the production Pages workflow.

Do not merge the Worker deployment into the production workflow or move the custom domain until the temporary Worker passes a complete GitHub login, edit, image upload, save, and rebuild test.

### Via GitHub Codespaces (Cloud IDE - Preview Available)

1. Open the project in Codespaces (see above)
2. Create a new file in `content/posts/` named `your-post-title.md`
3. Copy content from `.github/BLOG_POST_TEMPLATE.md`
4. Edit your post and preview live at port 3000
5. Commit and push

### Via GitHub Web Interface (No Installation Required - No Preview)

1. Copy content from `.github/BLOG_POST_TEMPLATE.md`
2. Go to `content/posts/` on GitHub
3. Click **"Add file"** → **"Create new file"**
4. Name it: `your-post-title.md` (lowercase, hyphens)
5. Paste the content from `.github/BLOG_POST_TEMPLATE.md`. Frontmatter should look like this:
   ```yaml
   ---
   title: "Your Post Title"
   date: "2025-12-02"  # YYYY-MM-DD
   author: "Your Name"
   excerpt: "Brief summary (1-2 sentences)"
   featuredImage: "/uploads/2025/12/image.jpg"
   categories: ["Education"]  # "Presentation, "Travel, "Education", "Announcement", "Video", "Defense", "Publication", "Social"
   tags: []
   seoTitle: "Your Post Title - Preferred.AI"
   seoDescription: "Brief summary for SEO"
   ---
   ```
6. Write your content in Markdown. Upload images to `public/uploads/YYYY/MM/` first if needed. (The Admin UI above handles this automatically for new posts.)
7. Commit to a **new branch** and create a **Pull Request**

### Local Development (Requires Installation Locally - Preview Available)
1. Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.
2. Clone the repository:
    ```bash
    git clone https://github.com/PreferredAI/PreferredAI.github.io.git
    cd PreferredAI.github.io
    ```

3. Install dependencies:
    ```bash
    pnpm install
    ```
4. Create a new Markdown file in `content/posts/` using the template from `.github/BLOG_POST_TEMPLATE.md`.
5. Start the development server:
   ```bash
   pnpm dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) to preview your post.
7. Once satisfied, commit your changes to a new branch and push to GitHub. Create a Pull Request for review if needed.

## Common Maintainance Tasks

### Update Team Members
- Edit name, image (path), title, link in `src/data/team.tsx`
- Upload corresponding images to `public/uploads/YYYY/MM/`

### Update Team Photos Slideshow
- Edit photo details (path, date, location) in `src/data/teamPhotos.ts`
- Upload corresponding images to `public/team/`
