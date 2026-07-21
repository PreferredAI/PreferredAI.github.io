export interface CategoryFilter {
  id: string;
  label: string;
  keywords: string[]; // Lowercase keywords to match against title or venue
}

/**
 * Configuration for publications categorization filters.
 * To add, remove, or edit search categories, simply amend this list!
 */
export const PUBLICATION_CATEGORIES: CategoryFilter[] = [
  {
    id: "All",
    label: "All Research",
    keywords: [], // Empty matches everything
  },
  {
    id: "RS",
    label: "Recommender Systems",
    keywords: ["recommend", "recsys", "collaborative", "basket", "rating"],
  },
  {
    id: "Graph",
    label: "Graph & Networks",
    keywords: ["graph", "network", "hypergraph", "link", "similarity"],
  },
  {
    id: "NLP",
    label: "NLP & Text",
    keywords: [
      "topic",
      "text",
      "language",
      "nlp",
      "vocabulary",
      "word",
      "review",
    ],
  },
  {
    id: "ML",
    label: "Core ML & Optimization",
    keywords: [
      "autoencoder",
      "reinforcement",
      "optimal",
      "bayesian",
      "vae",
      "bandit",
      "contrastive",
      "gradient alignment",
    ],
  },
];
