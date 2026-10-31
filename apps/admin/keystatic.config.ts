import { collection, config, fields } from "@keystatic/core";

const isGitHubStorage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "github" ||
  Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const OPTIONAL_ALUMNI_SORT_REGEX = /^(?:\d{4}-(0[1-9]|1[0-2]))?$/;

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

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeAssetFilename(originalFilename: string): string {
  const extensionIndex = originalFilename.lastIndexOf(".");
  const hasExtension = extensionIndex > 0;
  const basename = hasExtension
    ? originalFilename.slice(0, extensionIndex)
    : originalFilename;
  const extension = hasExtension
    ? originalFilename.slice(extensionIndex).toLowerCase()
    : "";
  const safeBasename = slugify(basename);

  return `${safeBasename || "image"}${extension}`;
}

export default config({
  storage: isGitHubStorage
    ? {
        kind: "github",
        repo: "PreferredAI/PreferredAI.github.io",
        branchPrefix: "keystatic/",
      }
    : {
        kind: "local",
      },
  ui: {
    brand: { name: "Preferred.AI Publisher" },
    navigation: ["posts", "people"],
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "date", "author"],
      previewUrl: "https://preferred.ai/blog/{slug}",
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: { isRequired: true },
          },
          slug: {
            label: "URL-safe post slug",
            description:
              "Auto-generated from the title. Lowercase letters, numbers, and single hyphens only.",
            generate: slugify,
            validation: {
              pattern: {
                regex: SLUG_REGEX,
                message:
                  "Use lowercase letters, numbers, and single hyphens only.",
              },
            },
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
            "Required for all new posts. Choose or drop an image — Keystatic stores it in public/uploads/<post-slug>/cover.<ext>.",
          directory: "public/uploads",
          publicPath: "/uploads/",
        }),
        featuredImage: fields.text({
          label: "Legacy image path (leave empty for new posts)",
          description:
            "Older migrated posts use an /uploads/YYYY/MM/... path. Leave empty for new posts and upload a Featured image above.",
        }),
        categories: fields.multiselect({
          label: "Categories",
          description:
            "Required — select at least one category that applies to this post.",
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
            "Use the image toolbar button, paste, or drag and drop. Add meaningful alt text when prompted. Write inline math as $...$ and display math as $$...$$.",
          extension: "md",
          options: {
            image: {
              directory: "public/uploads",
              publicPath: "/uploads/",
              transformFilename: sanitizeAssetFilename,
            },
          },
        }),
      },
    }),
    people: collection({
      label: "People",
      slugField: "name",
      path: "content/people/*",
      format: "json",
      entryLayout: "form",
      columns: ["name", "placement", "title"],
      previewUrl: "https://preferred.ai/people",
      schema: {
        name: fields.slug({
          name: {
            label: "Name",
            validation: { isRequired: true },
          },
          slug: {
            label: "URL-safe slug",
            description:
              "Lowercase letters, numbers, and hyphens. This also names the profile photo folder.",
            generate: slugify,
            validation: {
              pattern: {
                regex: SLUG_REGEX,
                message:
                  "Use lowercase letters, numbers, and single hyphens only.",
              },
            },
          },
        }),
        placement: fields.select({
          label: "Placement",
          description: "Controls the section and ordering on the People page.",
          options: [
            { label: "Professor", value: "professor" },
            { label: "Research Staff", value: "research-staff" },
            { label: "PhD Candidate", value: "phd-candidate" },
            { label: "PhD Co-supervisee", value: "phd-co-supervisee" },
            { label: "Alumni", value: "alumni" },
          ],
          defaultValue: "phd-candidate",
        }),
        photo: fields.image({
          label: "Profile photo",
          description:
            "Choose or drop a JPG, PNG, or WebP image. Keystatic stores it in public/team/members/<person-slug>/photo.<ext>.",
          directory: "public/team/members",
          publicPath: "/team/members/",
          validation: { isRequired: true },
        }),
        title: fields.text({
          label: "Position or title",
          description:
            "Optional, including for alumni without a current title.",
        }),
        role: fields.text({
          label: "Group role & tenure / graduation date",
          description:
            'Optional. E.g. "PhD (May 2026)" or "Research Scientist (Oct 2022 – Aug 2025)".',
        }),
        alumniSort: fields.text({
          label: "Alumni sort key (YYYY-MM)",
          description:
            "Optional (for Alumni). Used to sort Alumni in reverse chronological order (e.g. 2026-05).",
          validation: {
            pattern: {
              regex: OPTIONAL_ALUMNI_SORT_REGEX,
              message:
                "Use YYYY-MM with a two-digit month (e.g. 2026-05), or leave empty.",
            },
          },
        }),
        employment: fields.array(fields.text({ label: "Employment entry" }), {
          label: "Employment history",
          description:
            "Optional chronological list of current and past employment roles.",
          itemLabel: (props) => props.value,
        }),
        url: fields.url({
          label: "Personal or professional URL",
          description: "Optional. Include https:// or http://.",
        }),
      },
    }),
  },
});
