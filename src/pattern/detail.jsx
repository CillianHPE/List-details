import { useEffect, useRef, useState } from 'react';
import { Box, Heading } from 'grommet';

// Building blocks for the detail zone's content area, shared by every record
// type (Anatomy › Detail zone › Content area).

// Keeps a heading in the document outline without rendering it visibly
const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export const Section = ({ title, hideTitle, action, contained, children }) => (
  <Box
    gap="small"
    flex={false}
    margin={{ top: 'medium' }}
    pad={contained ? 'medium' : undefined}
    round={contained ? 'medium' : undefined}
    background={contained ? 'background-contrast' : undefined}
  >
    {hideTitle && (
      <Heading level={3} margin="none" style={visuallyHidden}>
        {title}
      </Heading>
    )}
    {((title && !hideTitle) || action) && (
      <Box
        direction="row"
        align="center"
        justify={hideTitle ? 'end' : 'between'}
      >
        {!hideTitle && (
          <Heading level={3} size="xsmall" margin="none">
            {title}
          </Heading>
        )}
        {action}
      </Box>
    )}
    {children}
  </Box>
);

// Horizontal name/value pairs; stack vertically once the container is too
// narrow to hold the name column plus a reasonable value column.
export const PAIR_ROW_MIN_WIDTH = 480;

export const usePairDirection = () => {
  const ref = useRef(null);
  const [direction, setDirection] = useState('row');
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) =>
      setDirection(
        entry.contentRect.width < PAIR_ROW_MIN_WIDTH ? 'column' : 'row',
      ),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, direction];
};

// Shared row shell for the membership lists: primary + supplementary text on
// the left; the right edge holds icon-button actions only (no links/metadata).
export const ListRow = ({ index, count, children }) => (
  <Box
    direction="row"
    align="center"
    justify="between"
    gap="medium"
    pad={{ vertical: 'small' }}
    border={
      index < count - 1 ? { side: 'bottom', color: 'border-weak' } : false
    }
  >
    {children}
  </Box>
);
