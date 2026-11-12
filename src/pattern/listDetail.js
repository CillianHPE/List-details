import { useEffect, useRef, useState } from 'react';

// Single source of truth for the list–detail pattern's sizing rules. Both the
// Users prototype and the Anatomy documentation read from here so the two
// cannot drift apart.

export const SURFACE = {
  listMin: 256, // size.small — floor so avatar + two lines of text fit
  listMax: 384, // size.medium — ceiling used by the Fixed / Resizable variants
  listShare: 0.4, // Proportional variant: list 40%, detail 60%
  gap: 24, // edgeSize.medium
  detailMin: 480, // name–value pairs stack under this
};
SURFACE.twoColumnMin = SURFACE.listMin + SURFACE.gap + SURFACE.detailMin; // 760
SURFACE.comfortableMin = 1000;

// Proportional zones for Grommet Grid: list minmax(256px, 2fr) · detail 3fr.
// The floor keeps rows legible when 40% of a Compact surface would be too thin.
export const PROPORTIONAL_COLUMNS = [
  [`${SURFACE.listMin}px`, `${SURFACE.listShare * 10}fr`],
  `${(1 - SURFACE.listShare) * 10}fr`,
];

// The surface responds to its own width, not the viewport's, because the app
// shell's navigation and context panes take width first.
export const tierFor = (width) =>
  width >= SURFACE.comfortableMin
    ? 'comfortable'
    : width >= SURFACE.twoColumnMin
      ? 'compact'
      : 'drillIn';

// Observe an element's width and return the matching tier. Starts in
// 'comfortable' so the first render shows two columns.
export const useSurfaceTier = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, width, tier: width === null ? 'comfortable' : tierFor(width) };
};
