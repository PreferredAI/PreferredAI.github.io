import { collection, config, fields } from "@keystatic/core";

const isGitHubStorage =
  process.env.KEYSTATIC_STORAGE_KIND === "github" ||
  Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID);

const categoryOptions = [
  "Announcement",
  "Defense",
  "Education",
  "Presentation",
  "Publication",
  "Social",
  "Travel",
  "Video",
].map((category) => ({ label: category, value: category }));

function sanitizeAssetFilename(originalFilename: string): string {
  const extensionIndex = originalFilename.lastIndexOf(".");
  const hasExtension = extensionIndex > 0;
  const basename = hasExtension
    ? originalFilename.slice(0, extensionIndex)
    : originalFilename;
  const extension = hasExtension
    ? originalFilename.slice(extensionIndex).toLowerCase()
    : "";
  const safeBasename = basename
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeBasename || "image"}${extension}`;
}

export default config({
  storage: isGitHubStorage
    ? {
        kind: "github",
        repo: "PreferredAI/PreferredAI.github.io",
      }
    : {
        kind: "local",
      },
  ui: {
    brand: { name: "Preferred.AI Publisher" },
    navigation: ["posts"],
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "date", "author"],
      previewUrl: "/blog/{slug}",
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: { isRequired: true },
          },
        }),
        date: fields.date({
          label: "Publish date",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        author: fields.text({
          label: "Author",
          defaultValue: "Preferred.AI",
          validation: { isRequired: true },
        }),
        excerpt: fields.text({
          label: "Excerpt",
          multiline: true,
          description:
            "A one or two sentence summary used in post listings and as the default SEO description.",
          validation: { isRequired: true },
        }),
        cover: fields.image({
          label: "Featured image",
          description:
            "Choose or drop an image. Keystatic stores it in public/uploads/<post-slug>/cover.<ext>.",
          directory: "public/uploads",
          publicPath: "/uploads",
        }),
        featuredImage: fields.text({
          label: "Existing featured image path (legacy)",
          description:
            "Existing posts may use an /uploads/YYYY/MM/... path. Leave this empty for new posts and use the image picker above.",
        }),
        categories: fields.multiselect({
          label: "Categories",
          description: "Choose every category that applies.",
          options: categoryOptions,
          defaultValue: ["Education"],
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          description: "Optional keywords for this post.",
          itemLabel: (props) => props.value,
        }),
        seoTitle: fields.text({
          label: "SEO Title",
          description: "Optional. Defaults to the post title when left empty.",
        }),
        seoDescription: fields.text({
          label: "SEO Description",
          multiline: true,
          description: "Optional. Defaults to the excerpt when left empty.",
        }),
        content: fields.markdoc({
          label: "Content",
          description:
            "Use the image toolbar button, paste, or drag and drop. Add meaningful alt text when prompted.",
          extension: "md",
          options: {
            image: {
              directory: "public/uploads",
              publicPath: "/uploads",
              transformFilename: sanitizeAssetFilename,
            },
          },
        }),
      },
    }),
  },
});
