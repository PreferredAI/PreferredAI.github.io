# Preferred.AI Website

## Quick Start (Development)

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Creating a Blog Post

### Via GitHub Web Interface (No Installation Required):

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
6. Write your content in Markdown. Upload images to `public/uploads/YYYY/MM/` first if needed.
7. Commit to a **new branch** and create a **Pull Request**

### Interactive Local Setup (Requires Installation):
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
