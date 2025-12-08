import fs from 'fs';
import path from 'path';

// =============================================================================
// CONFIGURATION (Hyper-parameters) - Edit these values to customize the crawler behavior
// =============================================================================

/** Source URL for publications page */
const PUBLICATIONS_URL = 'https://www.hadylauw.com/publications';

/** Output path for generated TypeScript file */
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'publications.ts');

/** User agent string for HTTP requests */
const USER_AGENT = 'Mozilla/5.0 (compatible; PublicationsCrawler/1.0)';

/** Minimum year to include publications from (inclusive). Set to null to include all years. */
const YEAR_LIMIT: number | null = 2014;

// -----------------------------------------------------------------------------
// Content Length Thresholds
// -----------------------------------------------------------------------------

/** Minimum characters for a list item to be considered a publication */
const MIN_LI_CONTENT_LENGTH = 50;

/** Minimum characters for cleaned text to be a valid publication */
const MIN_PUBLICATION_TEXT_LENGTH = 30;

/** Minimum characters for a valid publication title */
const MIN_TITLE_LENGTH = 10;

/** Minimum link text length to be considered a title link */
const MIN_TITLE_LINK_TEXT_LENGTH = 15;

// -----------------------------------------------------------------------------
// Paper PDF Host Domains - URLs containing these are likely paper links
// -----------------------------------------------------------------------------

const PAPER_HOST_DOMAINS = [
  'dropbox',
  'arxiv',
  '.pdf',
  'doi.org',
  'acm.org',
  'ieee',
  'jmlr',
  'jair',
  'openproceedings',
  'direct.mit.edu',
  'rdcu.be',
  'kdd.org',
] as const;

// -----------------------------------------------------------------------------
// Venue Indicators - Terms that signal the start of venue information
// -----------------------------------------------------------------------------

const VENUE_INDICATORS = [
  // General publication types
  'Conference', 'Journal', 'Proceedings', 'Workshop', 'Symposium', 'Transactions',

  // Major CS organizations and conferences
  'ACM', 'IEEE', 'AAAI', 'IJCAI', 'KDD', 'WWW', 'WSDM', 'CIKM', 'SIGIR', 'ICML',
  'NeurIPS', 'ICLR', 'EMNLP', 'ACL', 'ECIR', 'UAI', 'ICDM', 'SDM', 'RecSys',
  'ECML', 'AIED', 'EDBT', 'ICDE', 'BigData', 'Multimedia', 'VLDB', 'COLING',
  'DEXA', 'PAKDD',

  // Journals
  'JMLR', 'JAIR', 'DAMI', 'TIST', 'TKDE', 'TKDD', 'TOIS', 'TWEB', 'TNNLS',
  'Machine Learning', 'Internet Computing', 'Computational Linguistics',

  // Other indicators
  'Encyclopedia', 'SIGKDD Explorations',
  'Neural Information Processing', 'International Conference', 'Annual Meeting',

  // Volume/page indicators
  'Vol.', 'vol.', 'pp.',

  // Month abbreviations (for journal publications)
  'Jan ', 'Feb ', 'Mar ', 'Apr ', 'May ', 'Jun ',
  'Jul ', 'Aug ', 'Sep ', 'Oct ', 'Nov ', 'Dec ',
] as const;

// -----------------------------------------------------------------------------
// Award Patterns - Maps search text to award display info
// -----------------------------------------------------------------------------

interface AwardConfig {
  /** Text to search for in publication */
  searchText: string;
  /** Display text for the award */
  displayText: string;
  /** Optional URL for more info about the award */
  url?: string;
  /** Regex pattern to remove award text from venue (will be created from searchText if not provided) */
  venueCleanupPattern?: RegExp;
}

const AWARD_PATTERNS: AwardConfig[] = [
  {
    searchText: 'Distinguished Paper Award',
    displayText: 'Distinguished Paper Award',
    url: 'https://ijcai20.org/distinguished-papers/',
    venueCleanupPattern: /\.?\s*Distinguished Paper Award\.?/gi,
  },
  {
    searchText: 'Honorable Mention',
    displayText: 'Honorable Mention (Nominee for the Outstanding Paper Award)',
    url: 'http://www.aaai.org/Awards/paper.php',
    venueCleanupPattern: /,?\s*Honorable Mention[^.]*\.?/gi,
  },
  {
    searchText: 'Test of Time Award',
    displayText: 'Won the CIKM-25 Test of Time Award',
    venueCleanupPattern: /\.?\s*Won the CIKM-25 Test of Time Award\.?/gi,
  },
  {
    searchText: 'Conference Award Track',
    displayText: 'Conference Award Track',
    url: 'https://jair.org/index.php/jair/awardedPapers',
    venueCleanupPattern: /\.?\s*Conference Award Track\.?/gi,
  },
];

// -----------------------------------------------------------------------------
// Extra Link Detection - Keywords and domains for supplementary materials
// -----------------------------------------------------------------------------

/** Keywords in link text that indicate supplementary materials */
const EXTRA_LINK_KEYWORDS = [
  'code',
  'dataset',
  'video',
  'slides',
  'poster',
] as const;

/** Domains that host supplementary materials */
const EXTRA_LINK_DOMAINS = [
  'github.com',
  'bitbucket.org',
  'preferred.ai',
  'aclweb.org/anthology/attachments',
] as const;

/** Keywords to remove from venue text (in parentheses) */
const VENUE_CLEANUP_KEYWORDS = ['Code', 'Dataset', 'Video', 'slides', 'poster'] as const;

// -----------------------------------------------------------------------------
// Internal Link Filtering
// -----------------------------------------------------------------------------

/** Domain to filter out internal links (except specific paths) */
const INTERNAL_DOMAIN = 'hadylauw.com/';

/** Paths on internal domain that should still be included */
const INTERNAL_ALLOWED_PATHS = ['dropbox', 'publications/elis09.pdf'] as const;

// =============================================================================
// INTERFACES
// =============================================================================

interface Publication {
  title: string;
  authors: string;
  venue: string;
  pdfUrl?: string;
  extraLinks: { text: string; url: string }[];
  award?: { text: string; url?: string };
}

interface YearSection {
  year: string;
  publications: Publication[];
}

// =============================================================================
// FUNCTIONS
// =============================================================================

async function fetchPublicationsPage(): Promise<string> {
  console.log(`Fetching publications from ${PUBLICATIONS_URL}...`);

  const response = await fetch(PUBLICATIONS_URL, {
    headers: {
      'User-Agent': USER_AGENT,
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  return await response.text();
}

function parsePublications(html: string): YearSection[] {
  const sections: YearSection[] = [];

  // Find year headings - they're in <h3> tags with span containing year
  // Note: For years 2022+, the year may be split across TWO spans: <span>202</span><span>5</span>
  // For older years it's a single span: <span>2021</span>
  const yearHeadingPattern = /<h3[^>]*id="h\.[^"]*"[^>]*>[\s\S]*?<span[^>]*class="C9DxTc[^"]*"[^>]*>(202|20\d{2}|2007 and earlier)<\/span>(?:<span[^>]*class="C9DxTc[^"]*"[^>]*>(\d)<\/span>)?[\s\S]*?<\/h3>/gi;

  // Split by year sections
  const yearMatches: { year: string; index: number }[] = [];
  let match;

  while ((match = yearHeadingPattern.exec(html)) !== null) {
    // Combine split year (e.g., "202" + "5" = "2025") or use single year
    const year = match[2] ? match[1] + match[2] : match[1];
    yearMatches.push({ year, index: match.index });
  }

  // Dedupe years (the page has duplicates due to structure)
  // Also filter out years before YEAR_LIMIT and special entries like "2007 and earlier"
  const seenYears = new Set<string>();
  const uniqueYearMatches = yearMatches.filter(m => {
    if (seenYears.has(m.year)) return false;
    // Skip "2007 and earlier" or similar non-numeric year entries
    const yearNum = parseInt(m.year, 10);
    if (isNaN(yearNum)) return false;
    // Skip years before YEAR_LIMIT
    if (YEAR_LIMIT !== null && yearNum < YEAR_LIMIT) return false;
    seenYears.add(m.year);
    return true;
  });

  console.log(`Found ${uniqueYearMatches.length} year sections`);

  for (let i = 0; i < uniqueYearMatches.length; i++) {
    const yearMatch = uniqueYearMatches[i];
    const nextYearMatch = uniqueYearMatches[i + 1];

    const startIndex = yearMatch.index;
    const endIndex = nextYearMatch ? nextYearMatch.index : html.length;

    const sectionHtml = html.slice(startIndex, endIndex);

    // Parse publications from this section
    const publications = parsePublicationsFromSection(sectionHtml);

    if (publications.length > 0) {
      sections.push({
        year: yearMatch.year,
        publications
      });
    }
  }

  return sections;
}

function parsePublicationsFromSection(sectionHtml: string): Publication[] {
  const publications: Publication[] = [];
  const seenTitles = new Set<string>();

  // Find all <li> elements that contain publications
  // Each publication is in a <li> with <p> containing the content
  const liPattern = /<li[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/li>/gi;

  let match;
  while ((match = liPattern.exec(sectionHtml)) !== null) {
    const liContent = match[1];

    // Skip if this is just navigation or empty
    if (liContent.length < MIN_LI_CONTENT_LENGTH) continue;

    const pub = parsePublicationFromLi(liContent);
    if (pub && !seenTitles.has(pub.title.toLowerCase())) {
      seenTitles.add(pub.title.toLowerCase());
      publications.push(pub);
    }
  }

  return publications;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function parsePublicationFromLi(liContent: string): Publication | null {
  // Extract all links
  const links: { text: string; url: string; isTitle: boolean }[] = [];
  const linkPattern = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

  let linkMatch;
  while ((linkMatch = linkPattern.exec(liContent)) !== null) {
    let url = decodeHtmlEntities(linkMatch[1]);
    let text = decodeHtmlEntities(linkMatch[2].replace(/<[^>]+>/g, '').trim());

    // Skip internal links that aren't papers
    if (url.includes(INTERNAL_DOMAIN) &&
        !INTERNAL_ALLOWED_PATHS.some(path => url.includes(path))) {
      continue;
    }

    // Skip empty links
    if (!text) continue;

    // Determine if this is likely the title link (paper PDF)
    const isPaperHost = PAPER_HOST_DOMAINS.some(domain => url.includes(domain));
    const isTitle = isPaperHost &&
      text.length > MIN_TITLE_LINK_TEXT_LENGTH &&
      !text.toLowerCase().includes('code');

    links.push({ text, url, isTitle });
  }

  // Clean up HTML to text
  let text = liContent
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  text = decodeHtmlEntities(text);

  // Skip if doesn't look like a publication
  if (text.length < MIN_PUBLICATION_TEXT_LENGTH) return null;
  if (!text.toLowerCase().includes('by ')) return null;

  // Find the title (first title link or text before "by")
  let title = '';
  let pdfUrl: string | undefined;

  const titleLink = links.find(l => l.isTitle);
  if (titleLink) {
    title = titleLink.text;
    pdfUrl = titleLink.url;
  } else {
    // Extract title from text before "by"
    const byMatch = text.match(/^([^,]+),\s*by\s/i);
    if (byMatch) {
      title = byMatch[1].trim();
    }
  }

  if (!title || title.length < MIN_TITLE_LENGTH) return null;

  // Extract authors and venue
  let authors = '';
  let venue = '';

  const byIndex = text.search(/,?\s*by\s+/i);
  if (byIndex > 0) {
    const afterBy = text.slice(byIndex).replace(/^,?\s*by\s+/i, '');

    // Find the position where venue starts using configured indicators
    let venueStart = -1;
    for (const indicator of VENUE_INDICATORS) {
      const idx = afterBy.indexOf(indicator);
      if (idx !== -1) {
        // Find the preceding comma
        const commaIdx = afterBy.lastIndexOf(',', idx);
        if (commaIdx !== -1 && (venueStart === -1 || commaIdx < venueStart)) {
          venueStart = commaIdx;
        }
      }
    }

    if (venueStart !== -1) {
      authors = afterBy.slice(0, venueStart).trim();
      venue = afterBy.slice(venueStart + 1).trim();
    } else {
      // Fallback: assume last part after comma is venue
      const lastComma = afterBy.lastIndexOf(',');
      if (lastComma !== -1 && lastComma > afterBy.length * 0.3) {
        authors = afterBy.slice(0, lastComma).trim();
        venue = afterBy.slice(lastComma + 1).trim();
      } else {
        authors = afterBy;
      }
    }
  }

  // Clean up
  title = title.replace(/[,.]$/, '').trim();
  authors = authors.replace(/^,\s*/, '').replace(/,\s*$/, '').trim();
  venue = venue.replace(/\.$/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();

  // Remove "(Code)" etc from venue using configured keywords
  const venueCleanupRegex = new RegExp(`\\s*\\(\\s*(${VENUE_CLEANUP_KEYWORDS.join('|')})\\s*\\)`, 'gi');
  venue = venue.replace(venueCleanupRegex, '');

  // Detect awards and remove award text from venue using configured patterns
  let award: { text: string; url?: string } | undefined;
  for (const awardConfig of AWARD_PATTERNS) {
    if (text.includes(awardConfig.searchText)) {
      award = { text: awardConfig.displayText };
      if (awardConfig.url) {
        award.url = awardConfig.url;
      }
      if (awardConfig.venueCleanupPattern) {
        venue = venue.replace(awardConfig.venueCleanupPattern, '').trim();
      }
      break; // Only match first award
    }
  }

  // Extract extra links (Code, Dataset, Video, etc.) - exclude title duplicates
  const extraLinks = links.filter(l => {
    const lowerText = l.text.toLowerCase();
    // Skip if this link text matches the title (case insensitive)
    if (l.text.toLowerCase() === title.toLowerCase()) return false;
    // Skip if this is likely a paper PDF link (same as pdfUrl)
    if (l.url === pdfUrl) return false;

    // Check if link text contains any configured keywords
    const hasKeyword = EXTRA_LINK_KEYWORDS.some(keyword => lowerText.includes(keyword));
    // Check if URL matches any configured domains
    const hasDomain = EXTRA_LINK_DOMAINS.some(domain => l.url.includes(domain));

    return hasKeyword || hasDomain;
  }).map(l => ({ text: l.text, url: l.url }));

  // Dedupe extra links
  const uniqueExtraLinks = extraLinks.filter((l, i, arr) =>
    arr.findIndex(x => x.url === l.url) === i
  );

  return {
    title,
    authors,
    venue,
    pdfUrl,
    extraLinks: uniqueExtraLinks,
    award
  };
}

function generateTypeScript(sections: YearSection[]): string {
  let ts = `// Auto-generated by crawl-publications.ts
// Last updated: ${new Date().toISOString()}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  pdfUrl?: string;
  extraLinks?: { text: string; url: string }[];
  award?: { text: string; url?: string };
}

export interface YearSection {
  year: string;
  publications: Publication[];
}

export const PUBLICATIONS_DATA: YearSection[] = [\n`;

  for (const section of sections) {
    ts += `  {\n`;
    ts += `    year: "${section.year}",\n`;
    ts += `    publications: [\n`;

    for (const pub of section.publications) {
      ts += `      {\n`;
      ts += `        title: ${JSON.stringify(pub.title)},\n`;
      ts += `        authors: ${JSON.stringify(pub.authors)},\n`;
      ts += `        venue: ${JSON.stringify(pub.venue)},\n`;
      if (pub.pdfUrl) {
        ts += `        pdfUrl: ${JSON.stringify(pub.pdfUrl)},\n`;
      }
      if (pub.extraLinks.length > 0) {
        ts += `        extraLinks: ${JSON.stringify(pub.extraLinks)},\n`;
      }
      if (pub.award) {
        ts += `        award: ${JSON.stringify(pub.award)},\n`;
      }
      ts += `      },\n`;
    }

    ts += `    ],\n`;
    ts += `  },\n`;
  }

  ts += `];\n`;

  return ts;
}

async function main() {
  try {
    console.log('Starting publications crawler...\n');

    const html = await fetchPublicationsPage();
    console.log(`Fetched ${html.length} bytes of HTML\n`);

    const sections = parsePublications(html);

    // Count total publications
    const totalPubs = sections.reduce((sum, s) => sum + s.publications.length, 0);
    console.log(`Parsed ${totalPubs} publications across ${sections.length} years\n`);

    if (totalPubs === 0) {
      console.error('No publications found. This might indicate a parsing issue.');
      process.exit(1);
    }

    const typescript = generateTypeScript(sections);

    // Write to file
    fs.writeFileSync(OUTPUT_PATH, typescript, 'utf8');

    console.log(`Successfully wrote publications to ${OUTPUT_PATH}`);
    console.log(`Total publications: ${totalPubs}`);

    // Print summary by year
    console.log('\nPublications by year:');
    for (const section of sections) {
      console.log(`  ${section.year}: ${section.publications.length}`);
    }

  } catch (error) {
    console.error('Error crawling publications:', error);
    process.exit(1);
  }
}

main();
