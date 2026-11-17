import { Box, Text } from 'grommet';
import {
  region,
  Badge,
  Ghost,
  Dim,
  GhostRows,
  Level,
  Legend,
  Tag,
  Frame,
} from './primitives';

// States pages: where each state renders and what control it offers. Every
// state is scoped to a zone; everything outside the highlighted block keeps
// working. One page per state, each showing its variants side by side.

// Highlighted block: where the state renders
const Hot = ({ children, ...rest }) => (
  <Box
    border={{ color: 'brand', size: 'small' }}
    round="xsmall"
    pad="small"
    gap="small"
    background="background-front"
    {...rest}
  >
    {children}
  </Box>
);

const Msg = ({ children, action, size = 'medium' }) => (
  <Box flex align="center" justify="center" gap="small" pad="small">
    <Text textAlign="center" size={size}>
      {children}
    </Text>
    {action && <Tag>{action}</Tag>}
  </Box>
);

// Lo-fi standard empty state: icon, title, short description, primary action
const EmptyState = ({ title, action }) => (
  <Box flex align="center" justify="center" gap="small" pad="medium">
    <Box
      width="40px"
      height="40px"
      round="full"
      background="background-contrast"
      flex={false}
    />
    <Text textAlign="center" weight={500}>
      {title}
    </Text>
    <Ghost width="60%" height="8px" />
    <Box margin={{ top: 'xsmall' }}>
      <Tag>{action}</Tag>
    </Box>
  </Box>
);

const Pair = () => (
  <Box direction="row" gap="small">
    <Ghost width="30%" height="10px" />
    <Ghost width="50%" height="10px" />
  </Box>
);

const Toolbar = () => (
  <Box direction="row" gap="xsmall">
    <Ghost height="24px" flex />
    <Ghost height="24px" width="48px" round="xsmall" background="brand" />
  </Box>
);

// Side-by-side variants of one state, each with a caption
const Variants = ({ children }) => (
  <Box direction="row" gap="medium" wrap data-doc="figure">
    {children}
  </Box>
);
const Variant = ({ caption, region: r, children }) => (
  <Box gap="xsmall" flex="grow" basis="360px" style={{ maxWidth: 600 }}>
    <Frame
      height="260px"
      direction="row"
      pad="small"
      gap="small"
      style={{ position: 'relative' }}
    >
      {children}
    </Frame>
    <Box direction="row" gap="xsmall" align="center">
      {r && <Badge region={r} size="small" />}
      <Text size="small" color="text-weak">
        {caption}
      </Text>
    </Box>
  </Box>
);

const StatePage = ({ intro, regions, children }) => (
  <Level intro={intro}>
    {children}
    <Legend
      regions={regions}
      labels={{ owns: 'Trigger', controls: 'Control' }}
    />
  </Level>
);

// ---------------------------------------------------------------------------
// Loading

const LOADING = {
  list: region(
    1,
    'List loading',
    'skeleton · list body',
    'First load of the collection, and each time the filter changes.',
    'Skeleton rows',
    [
      'The toolbar renders immediately and stays interactive.',
      'Skeleton rows keep the list’s height so the layout does not jump.',
      'Shown only if the fetch takes longer than about 300ms.',
    ],
  ),
  detail: region(
    2,
    'Detail loading',
    'skeleton · detail content',
    'Each detail fetch after a selection.',
    'Skeleton pairs',
    [
      'The detail header shows the selected item’s name straight away, from the list data.',
      'Only the content area below it shows skeletons; the list keeps working.',
      'The whole page is never blocked.',
    ],
  ),
};

export const LoadingLevel = () => (
  <StatePage
    intro="The list and the detail load independently. Whichever is waiting shows a skeleton in place; the rest of the page keeps working."
    regions={LOADING}
  >
    <Variants>
      <Variant caption="First load of the collection" region={LOADING.list}>
        <Hot width="40%">
          <Toolbar />
          <GhostRows count={5} selected={-1} />
        </Hot>
        <Dim label="Detail (empty until a selection)" flex />
      </Variant>
      <Variant caption="Fetching the selected item" region={LOADING.detail}>
        <Dim label="List" width="40%" />
        <Box flex gap="small">
          <Box direction="row" justify="between" align="center">
            <Ghost width="50%" height="20px" />
            <Ghost width="64px" height="24px" round="xsmall" />
          </Box>
          <Hot flex>
            {[0, 1, 2, 3].map((i) => (
              <Pair key={i} />
            ))}
          </Hot>
        </Box>
      </Variant>
    </Variants>
  </StatePage>
);

// ---------------------------------------------------------------------------
// Empty

const EMPTY = {
  collection: region(
    1,
    'Empty collection',
    'whole surface',
    'The collection has no records yet.',
    'Primary call to action (create or import the first record)',
    [
      'The empty state takes the whole surface; the detail zone is hidden.',
      'The toolbar is hidden too — there is nothing to search or filter.',
    ],
  ),
  noResults: region(
    2,
    'No results',
    'list body',
    'Search or a filter matched nothing.',
    'Clear filters',
    [
      'The toolbar stays so the person can change the query.',
      'The message replaces the list items only.',
      'The detail keeps showing the last selected item until the selection is cleared.',
    ],
  ),
};

export const EmptyLevel = () => (
  <StatePage
    intro="Two different situations that look similar: nothing exists yet, or nothing matched. They render in different places and offer different ways out."
    regions={EMPTY}
  >
    <Variants>
      <Variant caption="No records exist" region={EMPTY.collection}>
        <EmptyState title="No items yet" action="Add item" />
      </Variant>
      <Variant caption="Query matched nothing" region={EMPTY.noResults}>
        <Box width="40%" gap="small">
          <Toolbar />
          <Hot flex>
            <Msg size="small" action="Clear filters">
              No matches
            </Msg>
          </Hot>
        </Box>
        <Dim label="Detail (unchanged)" flex />
      </Variant>
    </Variants>
  </StatePage>
);

// ---------------------------------------------------------------------------
// No selection

const SELECTION = {
  auto: region(
    1,
    'Auto-select first item',
    'default',
    'The page opens, or the filter changes.',
    '—',
    [
      'The first item in the list is selected and its detail shown.',
      'The detail zone is never empty on arrival, so the two-column layout always has something to show.',
    ],
  ),
  prompt: region(
    2,
    'Prompt',
    'detail zone',
    'The selected item was removed, or filtered out of the list.',
    '—',
    [
      'The detail zone shows a short prompt: "Select an item to see details".',
      'Nothing is auto-selected here, because the person did not choose to lose their selection.',
    ],
  ),
};

export const NoSelectionLevel = () => (
  <StatePage
    intro="A detail zone with nothing in it is wasted space, so by default the first item is selected. The prompt is kept for the moments when a selection disappears."
    regions={SELECTION}
  >
    <Variants>
      <Variant
        caption="On arrival · first item selected"
        region={SELECTION.auto}
      >
        <Hot width="40%">
          <Toolbar />
          <GhostRows count={5} selected={0} />
        </Hot>
        <Dim label="Detail of the first item" flex />
      </Variant>
      <Variant
        caption="Selection removed or filtered out"
        region={SELECTION.prompt}
      >
        <Dim label="List" width="40%" />
        <Hot flex>
          <Msg>Select an item to see details</Msg>
        </Hot>
      </Variant>
    </Variants>
  </StatePage>
);

// ---------------------------------------------------------------------------
// Error

const ERROR = {
  list: region(
    1,
    'List failed',
    'inline · list body',
    'The collection could not be fetched.',
    'Retry',
    [
      'The message and Retry replace the list items; the toolbar stays.',
      'The detail is empty, because nothing could be selected.',
    ],
  ),
  detail: region(
    2,
    'Detail failed',
    'inline · detail content',
    'The selected item could not be fetched.',
    'Retry',
    [
      'The list keeps working, so the person can pick another item.',
      'The detail header still names the item (from list data); the content area holds the message.',
    ],
  ),
  action: region(
    3,
    'Action failed',
    'toast',
    'A save, delete or other action did not go through.',
    'Toast with Retry or Undo where possible',
    [
      'The page is unchanged; the toast explains what failed.',
      'Inline errors are for loading; toasts are for actions.',
    ],
  ),
};

export const ErrorLevel = () => (
  <StatePage
    intro="An error is scoped to the zone that failed. The other zone keeps working, and the way out is always right beside the message."
    regions={ERROR}
  >
    <Variants>
      <Variant caption="Collection could not load" region={ERROR.list}>
        <Box width="40%" gap="small">
          <Toolbar />
          <Hot flex>
            <Msg size="small" action="Retry">
              Couldn’t load items
            </Msg>
          </Hot>
        </Box>
        <Dim label="Detail (empty)" flex />
      </Variant>
      <Variant caption="Selected item could not load" region={ERROR.detail}>
        <Dim label="List" width="40%" />
        <Box flex gap="small">
          <Ghost width="50%" height="20px" />
          <Hot flex>
            <Msg action="Retry">Couldn’t load this item</Msg>
          </Hot>
        </Box>
      </Variant>
      <Variant caption="Action did not go through" region={ERROR.action}>
        <Dim label="List" width="40%" />
        <Dim label="Detail (unchanged)" flex />
        <Hot
          style={{ position: 'absolute', right: 16, bottom: 16 }}
          pad="xsmall"
          direction="row"
          gap="small"
          align="center"
        >
          <Text size="small">Couldn’t save changes</Text>
          <Tag>Retry</Tag>
        </Hot>
      </Variant>
    </Variants>
  </StatePage>
);

// ---------------------------------------------------------------------------
// Read-only

const READONLY = {
  hidden: region(
    1,
    'Hidden',
    'never allowed',
    'The viewer’s role can never perform the action.',
    '—',
    [
      'The action is not rendered at all.',
      'Showing a control someone can never use only invites a dead end.',
    ],
  ),
  disabled: region(
    2,
    'Disabled',
    'not right now',
    'The action exists for this role but is unavailable for this record or moment.',
    'Disabled button · tooltip explains why',
    [
      'The action stays visible but disabled, with a tooltip saying what would enable it.',
      'The content is still readable; only the controls change.',
    ],
  ),
};

export const ReadOnlyLevel = () => (
  <StatePage
    intro="Read-only is about the controls, not the content. The rule is simple: hide what the person can never do, disable what they cannot do right now."
    regions={READONLY}
  >
    <Variants>
      <Variant caption="Viewer role · actions hidden" region={READONLY.hidden}>
        <Dim label="List" width="40%" />
        <Hot flex>
          <Box direction="row" justify="between" align="center">
            <Ghost width="40%" height="20px" />
          </Box>
          <Dim label="read-only pairs" flex />
        </Hot>
      </Variant>
      <Variant
        caption="Temporarily unavailable · disabled"
        region={READONLY.disabled}
      >
        <Dim label="List" width="40%" />
        <Hot flex>
          <Box direction="row" justify="between" align="center">
            <Ghost width="40%" height="20px" />
            <Box direction="row" gap="xsmall" align="center">
              <Ghost
                width="64px"
                height="24px"
                round="xsmall"
                style={{ opacity: 0.4 }}
              />
              <Tag color="text-weak">disabled</Tag>
            </Box>
          </Box>
          <Dim label="read-only pairs" flex />
        </Hot>
      </Variant>
    </Variants>
  </StatePage>
);
