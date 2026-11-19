import { Box, Text } from 'grommet';
import {
  region,
  Badge,
  Focus,
  Ghost,
  Dim,
  GhostRows,
  Level,
  PopoverDot,
  Tag,
  Frame,
} from './primitives';

// Behaviour levels: the questions developers ask once the regions are named.
//   Scroll      · who owns overflow, what sticks, where height comes from
//   Data        · where fetches happen and how the list is paged
//   Actions     · which scope every action belongs to
// Responsive and States have grown into their own page groups; see
// ResponsiveLevels.jsx and StatesLevels.jsx.

// A fake vertical scrollbar drawn on the right edge of a block
const ScrollTrack = ({ thumb = '35%' }) => (
  <Box
    width="6px"
    background="background-contrast"
    round="small"
    alignSelf="stretch"
    flex={false}
    style={{ position: 'relative' }}
  >
    <Box
      background="brand"
      round="small"
      width="6px"
      height={thumb}
      style={{ position: 'absolute', top: '10%' }}
    />
  </Box>
);

// ---------------------------------------------------------------------------
// Scroll & height

// At the side-by-side tiers the surface fills the available view height and
// ends level with the side navigation (12px, edgeSize.small, above the
// viewport edge). The page never scrolls: the list body and the detail pane
// are each their own scroll container. Stacked (narrow) layouts fall back to
// the page as scroll container.
const SCROLL = {
  toolbar: region(
    1,
    'List toolbar',
    'sticky',
    'Keeps search, filters and collection actions reachable while the items scroll beneath it.',
    'Search · filters · collection actions · count',
    'Pinned at the top of the list zone; never scrolls out of view.',
  ),
  listBody: region(
    2,
    'List body',
    'overflow auto',
    'Scrolls the items independently so browsing the list never moves the record beside it.',
    'Wheel · ↑/↓ · PgUp/PgDn',
    [
      'Height is what remains of the view after the global header, page header and toolbar; the zone always fills it, even with 1 or 2 items.',
      'The list zone, the divider and the side navigation all end 12px (edgeSize.small) above the viewport edge, so they read as 1 aligned set.',
      'The page does not scroll at this tier; the surface is sized to the viewport instead.',
      'Keyboard navigation scrolls the selected item into view.',
      'Uses the native scrollbar so people can see that the list scrolls.',
      'Jumps back to the top when the filter changes — a new filter is a new list.',
    ],
    {
      why: [
        'Scrolling the list never loses the place in the record',
        'Scrolling the record never loses the place in the list',
        'Switching records is 1 gesture',
      ],
    },
  ),
  detailHeader: region(
    3,
    'Detail header',
    'scrolls with detail',
    'Names the open record and holds its actions; scrolls away with the detail.',
    '—',
    'Scrolls with the detail pane like normal content.',
  ),
  detailContent: region(
    4,
    'Detail content',
    'overflow auto',
    'Holds the record’s tabs and content; long content scrolls inside the detail pane.',
    'Wheel · PgUp/PgDn',
    [
      'The detail pane is its own scroll container, bounded by the same view height as the list zone.',
      'Changing selection scrolls the pane back to the top, so every record starts with its header and first facet visible.',
      'If a tab is open, the same tab stays selected for the new record.',
    ],
  ),
};

// Page header is drawn as context only; the surface is bounded to the view
// height and the list body and detail pane each own a scrollbar.
const ScrollWireframe = () => {
  const R = SCROLL;
  return (
    <Box
      border={{ color: 'border-weak' }}
      round="small"
      pad="small"
      height="440px"
    >
      <Box direction="row" gap="small" flex>
        <Box flex gap="small">
          <Box direction="row" gap="small" align="center">
            <Dim label="Page header" flex />
            <Tag color="text-weak">static</Tag>
          </Box>
          <Box direction="row" gap="small" flex>
            <Box width="40%" gap="xsmall" flex={false}>
              <Focus
                region={R.toolbar}
                label="sticky"
                pad="xsmall"
                gap="xsmall"
              >
                <Ghost height="24px" />
              </Focus>
              <Focus region={R.listBody} label="scrolls" pad="xsmall" flex>
                <Box direction="row" gap="xsmall" flex overflow="hidden">
                  <Box flex overflow="hidden">
                    <Box flex={false}>
                      <GhostRows count={7} />
                    </Box>
                  </Box>
                  <ScrollTrack thumb="40%" />
                </Box>
              </Focus>
            </Box>
            <Box flex gap="xsmall">
              <Focus
                region={R.detailHeader}
                label="scrolls"
                pad="xsmall"
                gap="xsmall"
              >
                <Ghost width="140px" height="20px" />
              </Focus>
              <Focus region={R.detailContent} label="scrolls" pad="xsmall" flex>
                <Box direction="row" gap="xsmall" flex overflow="hidden">
                  <Box flex gap="xsmall" overflow="hidden">
                    {Array.from({ length: 9 }, (_, i) => (
                      <Ghost key={i} width={`${60 + ((i * 17) % 35)}%`} />
                    ))}
                  </Box>
                  <ScrollTrack thumb="55%" />
                </Box>
              </Focus>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ScrollLevel = () => (
  <Level
    intro="Which part of the surface owns each scrollbar, what is pinned, and how heights are derived. The surface fills the view height and ends level with the side navigation; the list and the detail each keep their own scroll."
    wireframe={<ScrollWireframe />}
    regions={SCROLL}
  />
);

// ---------------------------------------------------------------------------
// Data & performance

const DATA = {
  list: region(
    1,
    'List fetch',
    'GET /items?page=…',
    'The collection, on page load.',
    'Page size · sort',
    'Paged (e.g. 50) and virtualised when long. First page renders before the detail request starts.',
    {
      questions:
        'Pagination, infinite scroll or virtualised list? Expected max collection size?',
    },
  ),
  search: region(
    2,
    'Search & filter',
    'GET /items?q=…&filter=…',
    'Narrowing the collection.',
    'Debounce ≈300ms · cancel in-flight',
    'Server-side when the collection is paged; client-side only for small, fully loaded sets. Count comes from the response.',
  ),
  detail: region(
    3,
    'Detail fetch',
    'GET /items/:id',
    'Full record for the selected item.',
    '—',
    'Fired on selection; cached per id so revisiting is instant. Header renders from list data immediately, body waits for the fetch.',
  ),
  tabs: region(
    4,
    'Tab lazy-load',
    'GET /items/:id/<facet>',
    'Secondary facets of the record.',
    '—',
    'Loaded on first visit to the tab, not with the record. Loading skeleton inside the tab panel only.',
    { questions: 'Prefetch the second tab on hover/focus?' },
  ),
  mutate: region(
    5,
    'Mutations',
    'POST · PATCH · DELETE',
    'Any action in the page, detail or section.',
    'Optimistic update · rollback on error',
    'Update the list row and detail together; invalidate the affected tab and the collection count.',
  ),
};

const DataWireframe = () => (
  <Frame direction="row">
    <Dim label="Nav" width="80px" flex={false} />
    <Box flex gap="small">
      <Box
        direction="row"
        justify="between"
        align="center"
        pad="xsmall"
        border={{ color: 'border-weak', style: 'dashed' }}
        round="xsmall"
      >
        <Ghost width="120px" height="14px" />
        <Box direction="row" gap="xsmall" align="center">
          <Tag>5 mutate</Tag>
          <Ghost width="70px" height="24px" round="full" />
        </Box>
      </Box>
      <Box direction="row" gap="small" flex>
        <Focus
          region={DATA.list}
          label="paged"
          width="36%"
          flex={false}
          gap="xsmall"
        >
          <Focus
            region={DATA.search}
            label="debounce"
            pad="xsmall"
            gap="xsmall"
          >
            <Ghost height="24px" />
          </Focus>
          <GhostRows count={3} />
          <Box align="center">
            <Tag color="text-weak">… 50 / 1 240</Tag>
          </Box>
        </Focus>
        <Box flex gap="xsmall">
          <Focus
            region={DATA.detail}
            label="on select · cached"
            pad="xsmall"
            gap="xsmall"
          >
            <Box direction="row" justify="between">
              <Ghost width="140px" height="20px" />
              <Tag>5 mutate</Tag>
            </Box>
          </Focus>
          <Focus
            region={DATA.tabs}
            label="on first visit"
            pad="xsmall"
            gap="xsmall"
            flex
          >
            <Box direction="row" gap="small">
              <Ghost width="60px" height="16px" background="brand" />
              <Ghost width="100px" height="16px" />
              <Ghost width="120px" height="16px" />
            </Box>
            <Box flex height={{ min: '96px' }} style={{ position: 'relative' }}>
              <Dim label="facet content" flex />
              <Box style={{ position: 'absolute', right: 8, bottom: 8 }}>
                <Tag>5 mutate</Tag>
              </Box>
            </Box>
          </Focus>
        </Box>
      </Box>
    </Box>
  </Frame>
);

export const DataLevel = () => (
  <Level
    intro="Where requests originate, what triggers them and how results are cached. Numbers mark the fetch points; the legend gives the strategy for each."
    wireframe={<DataWireframe />}
    regions={DATA}
  />
);

// ---------------------------------------------------------------------------
// Actions & ownership

const SCOPES = {
  collection: { color: '#01a982', label: 'Collection' },
  record: { color: '#7630EA', label: 'Record' },
  section: { color: '#FF8300', label: 'Section' },
  row: { color: '#00739D', label: 'Row' },
};

const ACTIONS = {
  collection: region(
    1,
    'Collection actions',
    'list toolbar · trailing, beside search',
    'Creates or changes items in the collection the toolbar controls: add, import, bulk select.',
    '1 secondary button · overflow for the rest · icon-only below Comfortable',
    'Sits with search, filter and sort because they all shape the same collection. Always visible regardless of selection; never acts on the selected record. Distinct from page-level controls in the page header (Back, page settings, help, export of the whole view), which act on the surface rather than its data.',
    {
      why: [
        'Controls sit beside what they affect',
        'Add/import scope is obvious next to search and filters',
        'Page header stays free of data actions',
      ],
    },
  ),
  record: region(
    2,
    'Record actions',
    'detail header · trailing',
    'Acts on the selected record as a whole: edit, reset password, suspend, delete.',
    'Primary + overflow menu · destructive last and separated',
    'Change with the selection and permissions. Destructive actions always confirm. Delete returns focus to the list and selects the next row.',
    {
      questions:
        'Should the most common action be a visible button or everything in the menu?',
    },
    {
      why: [
        'Target is unambiguous: actions sit beside the record’s name',
        'Fewer mis-applied actions',
      ],
    },
  ),
  section: region(
    3,
    'Section actions',
    'content area · top trailing',
    'Adds to the facet being viewed, e.g. assign or add to a related set.',
    '1 secondary button per section',
    'Scoped to the visible tab. Opens a layer; on success the list in the section updates in place.',
    {
      why: [
        'Clear what is being added to (a role, a group)',
        'Keeps the record-level menu uncluttered',
      ],
    },
  ),
  row: region(
    4,
    'Row actions',
    'inline · list rows in the content area',
    'Acts on one membership row: remove it, or follow a link to its source.',
    'Trailing icon button · anchor',
    'Only in detail-zone lists, never in the main list — the main list is for selection only. Removal confirms when the effect is not easily reversible.',
    {
      questions:
        'Do we ever need bulk selection in the main list? If so this model changes.',
    },
    {
      why: [
        'Decision is about that row alone',
        'Inline placement makes the target self-evident',
        'Main list stays reserved for selection',
      ],
    },
  ),
};

// Scope-coloured numbered dot used inside slots instead of the full Badge
const Dot = ({ scope, id }) => (
  <Box
    background={SCOPES[scope].color}
    round="full"
    width="20px"
    height="20px"
    align="center"
    justify="center"
    flex={false}
  >
    <Text
      size="xsmall"
      weight="bold"
      style={{ color: '#ffffff', lineHeight: 1 }}
    >
      {id}
    </Text>
  </Box>
);

const Slot = ({ scope, children, ...rest }) => (
  <Box
    border={{ color: SCOPES[scope].color, size: 'small' }}
    round="xsmall"
    pad="xsmall"
    gap="xsmall"
    background="background-front"
    flex={false}
    {...rest}
  >
    {children}
  </Box>
);

const ScopeKey = () => (
  <Box direction="row" gap="medium" wrap>
    {Object.entries(SCOPES).map(([k, s]) => (
      <Box key={k} direction="row" gap="xsmall" align="center">
        <Box width="12px" height="12px" round="xsmall" background={s.color} />
        <Text size="small">{s.label}</Text>
      </Box>
    ))}
  </Box>
);

const ActionsWireframe = () => (
  <Box gap="small">
    <ScopeKey />
    <Frame direction="row">
      <Dim label="Nav" width="80px" flex={false} />
      <Box flex gap="small">
        <Box
          direction="row"
          justify="between"
          align="center"
          pad="xsmall"
          border={{ color: 'border-weak', style: 'dashed' }}
          round="xsmall"
        >
          <Ghost width="120px" height="14px" />
          {/* Page-level controls (Back, settings, export of the view) act on
              the surface, not its data — no scope colour, not numbered. */}
          <Box direction="row" align="center" gap="xsmall">
            <Text size="xsmall" color="text-weak">
              Page-level
            </Text>
            <Ghost width="24px" height="24px" round="full" />
          </Box>
        </Box>
        <Box direction="row" gap="small" flex>
          <Box
            width="34%"
            flex={false}
            border={{ color: 'border-weak', style: 'dashed' }}
            round="xsmall"
            pad="xsmall"
            gap="xsmall"
          >
            {/* List toolbar: search + collection action share a row because
                they shape the same set. */}
            <Box direction="row" align="center" gap="xsmall">
              <Ghost
                width="auto"
                height="24px"
                round="full"
                flex
                style={{ minWidth: 0 }}
              />
              <Slot
                scope="collection"
                direction="row"
                align="center"
                gap="xsmall"
              >
                <PopoverDot region={ACTIONS.collection}>
                  <Dot scope="collection" id={ACTIONS.collection.id} />
                </PopoverDot>
                <Ghost width="48px" height="24px" round="full" />
              </Slot>
            </Box>
            <Box direction="row" gap="xsmall">
              {[0, 1, 2].map((i) => (
                <Ghost key={i} width="36px" height="14px" round="full" />
              ))}
            </Box>
            <Dim label="Rows — selection only, no actions" flex />
          </Box>
          <Box flex gap="xsmall">
            <Box
              direction="row"
              justify="between"
              align="center"
              pad="xsmall"
              border={{ color: 'border-weak', style: 'dashed' }}
              round="xsmall"
            >
              <Ghost width="140px" height="20px" />
              <Slot scope="record" direction="row" align="center" gap="xsmall">
                <PopoverDot region={ACTIONS.record}>
                  <Dot scope="record" id={ACTIONS.record.id} />
                </PopoverDot>
                <Ghost width="70px" height="24px" round="full" />
                <Ghost width="24px" height="24px" round="full" />
              </Slot>
            </Box>
            <Box direction="row" gap="small" pad={{ horizontal: 'xsmall' }}>
              <Ghost width="60px" height="16px" background="brand" />
              <Ghost width="100px" height="16px" />
            </Box>
            <Box
              border={{ color: 'border-weak', style: 'dashed' }}
              round="xsmall"
              pad="xsmall"
              gap="xsmall"
              flex
            >
              <Box direction="row" justify="end">
                <Slot
                  scope="section"
                  direction="row"
                  align="center"
                  gap="xsmall"
                >
                  <PopoverDot region={ACTIONS.section}>
                    <Dot scope="section" id={ACTIONS.section.id} />
                  </PopoverDot>
                  <Ghost width="90px" height="24px" round="full" />
                </Slot>
              </Box>
              {[0, 1].map((i) => (
                <Box
                  key={i}
                  direction="row"
                  justify="between"
                  align="center"
                  border={{ side: 'bottom', color: 'border-weak' }}
                  pad={{ vertical: 'xsmall' }}
                >
                  <Box gap="4xsmall" flex>
                    <Ghost width="50%" background="brand" />
                    <Ghost width="65%" height="8px" />
                  </Box>
                  <Slot
                    scope="row"
                    direction="row"
                    align="center"
                    gap="xsmall"
                    pad="4xsmall"
                  >
                    <PopoverDot region={ACTIONS.row}>
                      <Dot scope="row" id={ACTIONS.row.id} />
                    </PopoverDot>
                    <Ghost width="20px" height="20px" />
                  </Slot>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Frame>
  </Box>
);

export const ActionsLevel = () => (
  <Level
    intro="Every action lives in exactly 1 scope, and each scope has 1 home on the page. Colour marks the scope; the legend gives the rules."
    wireframe={<ActionsWireframe />}
    regions={ACTIONS}
  />
);
