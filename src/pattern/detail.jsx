import { useEffect, useRef, useState } from 'react';
import {
  Box,
  DataTable,
  Heading,
  NameValueList,
  NameValuePair,
  Text,
} from 'grommet';

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

// Data table for detail content. Rows align to the top so that when a cell
// wraps, every cell in the row still starts on one visual line. Scrolls
// horizontally rather than squeezing columns when the detail is narrow.
export const Table = (props) => (
  <Box overflow="auto">
    <DataTable verticalAlign="top" {...props} />
  </Box>
);

// Primary text of a list row: the HPE list primaryKey style (weight 500,
// text-strong) so the identifying label reads the same in every list.
export const ListPrimary = ({ children, ...rest }) => (
  <Text weight={500} color="text-strong" {...rest}>
    {children}
  </Text>
);

// Trailing cell of a list row. Fixed width and start-aligned so indicators
// and labels line up in one column instead of ragging against the right edge.
export const ListStatus = ({ width = 'small', children }) => (
  <Box width={width} flex={false} align="start">
    {children}
  </Box>
);

// Contained card: groups related pairs so a facet reads as a few blocks
// rather than one long list.
export const Card = ({ title, note, action, children }) => (
  <Box
    background="background-contrast"
    round="medium"
    pad="medium"
    gap="medium"
    flex={false}
  >
    {(title || action) && (
      <Box direction="row" align="start" justify="between" gap="medium" wrap>
        <Box gap="4xsmall">
          <Heading level={4} size="small" margin="none">
            {title}
          </Heading>
          {note && (
            <Text size="small" color="text-weak">
              {note}
            </Text>
          )}
        </Box>
        {action}
      </Box>
    )}
    {children}
  </Box>
);

// Name beside value in one column; stacks when the card gets too narrow
export const Pairs = ({ pairs }) => {
  const [ref, direction] = usePairDirection();
  return (
    <Box ref={ref}>
      <NameValueList pairProps={{ direction }} nameProps={{ width: 'small' }}>
        {pairs.map(([name, value]) => (
          <NameValuePair key={name} name={name}>
            {typeof value === 'string' ? <Text>{value}</Text> : value}
          </NameValuePair>
        ))}
      </NameValueList>
    </Box>
  );
};
