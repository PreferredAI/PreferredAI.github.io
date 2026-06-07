import React from "react";

interface IconProps {
  className?: string;
}

export const SearchIcon: React.FC<IconProps> = ({ 
  className = "h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" 
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export const PdfIcon: React.FC<IconProps> = ({ 
  className = "h-3.5 w-3.5 text-primary" 
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9h1.5M9 13h6M9 17h6"
    />
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ 
  className = "h-3.5 w-3.5 text-gray-700 dark:text-gray-400" 
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

export const SlidesIcon: React.FC<IconProps> = ({ 
  className = "h-3.5 w-3.5 text-amber-600" 
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 12l3-3 3 3 4-4M8 21h8M12 17v4M3 4h18M4 4v10a2 2 0 002 2h12a2 2 0 002-2V4"
    />
  </svg>
);

export const VideoIcon: React.FC<IconProps> = ({ 
  className = "h-3.5 w-3.5 text-primary" 
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

export const LinkIcon: React.FC<IconProps> = ({ 
  className = "h-3.5 w-3.5 text-blue-600" 
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);
