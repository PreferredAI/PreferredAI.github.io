export const TARGET_IMAGE_WIDTHS = [256, 384, 640, 1080, 1920, 3840];

/** Return distinct generated widths without ever enlarging the source image. */
export function getGeneratedWidths(sourceWidth: number): number[] {
  const maximumTargetWidth = TARGET_IMAGE_WIDTHS.at(-1) ?? sourceWidth;
  const finalWidth = Math.min(sourceWidth, maximumTargetWidth);
  return [
    ...new Set([
      ...TARGET_IMAGE_WIDTHS.filter((width) => width < finalWidth),
      finalWidth,
    ]),
  ].sort((a, b) => a - b);
}
