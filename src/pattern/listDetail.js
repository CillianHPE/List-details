import { useEffect, useRef, useState } from 'react';

// Single source of truth for the list–detail pattern's sizing rules. Both the
// Users prototype and the Anatomy documentation read from here so the two
// cannot drift apart.

export const SURFACE = {
  listMin: 192, // size.xsmall
  listMax: 384, // size.medium
  gap: 24, // edgeSize.medium
  detailMin: 480, // name–value pairs stack under this
};
SURFACE.twoColumnMin = SURFACE.listMin + SURFACE.gap + SURFACE.detailMin; // 696
SURFACE.comfortableMin = 1000;

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
