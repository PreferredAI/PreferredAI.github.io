import { visit } from 'unist-util-visit';
import type { Root, Element, Parent, ElementContent } from 'hast';

/**
 * Rehype plugin to wrap images in figure elements with figcaption
 * Uses the image's alt text as the caption
 */
export default function rehypeFigure() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent: Parent | undefined) => {
      // Only process img elements
      if (
        node.tagName === 'img' &&
        parent &&
        index !== undefined
      ) {
        const parentElement = parent as Element;
        const isInParagraph = parent.type === 'element' && parentElement.tagName === 'p';
        const isInRoot = parent.type === 'root';

        if (!isInParagraph && !isInRoot) {
          return;
        }

        const alt = node.properties?.alt as string;

        // Create figure element
        const figure: Element = {
          type: 'element',
          tagName: 'figure',
          properties: {
            className: ['image-figure'],
          },
          children: [
            {
              ...node,
              properties: {
                ...node.properties,
              },
            },
          ],
        };

        // Add figcaption if alt text exists
        if (alt && alt.trim()) {
          figure.children.push({
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [
              {
                type: 'text',
                value: alt,
              },
            ],
          });
        }

        // Replace the image with the figure
        parent.children[index] = figure as ElementContent;
      }
    });
  };
}
