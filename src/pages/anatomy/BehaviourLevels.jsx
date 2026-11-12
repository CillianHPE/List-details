import { useState } from 'react';
import { Box, Button, Grid, Text, ToggleGroup } from 'grommet';
import {
  region,
  Badge,
  Focus,
  Ghost,
  Dim,
  GhostRows,
  Level,
  RegionDetails,
} from './primitives';

// Behaviour levels: the questions developers ask once the regions are named.
//   Scroll      · who owns overflow, what sticks, where height comes from
//   Responsive  · how the layout re-flows across three widths
//   States      · loading / empty / error / read-only per zone
//   Data        · where fetches happen and how the list is paged
//   Actions     · which scope every action belongs to

const Mono = ({ children, color = 'brand' }) => (
  <Text
    size="small"
    color={color}
    weight={500}
    style={{ fontFamily: 'monospace' }}
  >
    {children}
  </Text>
);

// Small callout chip placed inside a wireframe block
const Tag = ({ children, color = 'brand', ...rest }) => (
  <Box
    background={color}
    round="xsmall"
    pad={{ horizontal: 'xsmall', vertical: '4xsmall' }}
    alignSelf="start"
    flex={false}
    {...rest}
  >
    <Text
      size="xsmall"
      weight={500}
      color="#ffffff"
      style={{ fontFamily: 'monospace' }}
    >
      {children}
    </Text>
  </Box>
);

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

// Compact dashed block for mini layouts: badge number only, no label
const Mini = ({ region: r, children, ...rest }) => (
  <Box
    border={{ color: 'border', style: 'dashed', size: 'small' }}
    round="xsmall"
    pad="4xsmall"
    gap="4xsmall"
    style={{ position: 'relative' }}
    {...rest}
  >
    <Box
      background="text-strong"
      round="full"
      width="16px"
      height="16px"
      align="center"
      justify="center"
      flex={false}
      style={{ position: 'absolute', top: -8, left: -8, zIndex: 1 }}
    >
      <Text
        size="xsmall"
        weight="bold"
        style={{ color: '#ffffff', lineHeight: 1 }}
      >
        {r.id}
      </Text>
    </Box>
    {children}
  </Box>
);

const Frame = ({ children, ...rest }) => (
  <Box
    border={{ color: 'border-weak' }}
    background="background-back"
    round="small"
    pad="small"
    gap="small"
    {...rest}
  >
    {children}
  </Box>
);

// ---------------------------------------------------------------------------
// Scroll & height

const SCROLL_VARIANTS = [
  {
    value: 'page',
    label: 'Page scrolls',
    note: 'Current behaviour. The page (Main) is the scroll container; the list column is sticky and scrolls its own rows; the detail grows the page.',
  },
  {
    value: 'panes',
    label: 'Panes scroll',
    note: 'Alternative. Main is locked to the viewport; the list body and the detail content each scroll independently under fixed headers.',
  },
];

const scrollRegions = (variant) => {
  const panes = variant === 'panes';
  return {
    globalHeader: region(
      1,
      'Global header',
      'sticky · top 0',
      'Always visible. Main content slides beneath it in both models; this is the app-shell default, not a per-page choice.',
      '—',
      'position: sticky; top: 0; z-index above Main. 60px tall. Every other pinned element (nav, list column) offsets from this height.',
    ),
    viewport: region(
      2,
      'Viewport',
      '100vh · overflow hidden',
      'The outer frame. Nothing inside is taller than this except designated scroll containers.',
      '—',
      'App shell is height: 100vh. Global header is sticky; nav is pinned beneath it.',
      {
        questions: 'Is the min supported height 600px? What happens below it?',
      },
    ),
    main: region(
      3,
      'Main',
      panes ? 'overflow hidden' : 'overflow auto',
      panes
        ? 'Fixed-height column; delegates scrolling to the two zones.'
        : 'The one page-level scroll container. Page header scrolls away with the content.',
      '—',
      panes
        ? 'Height = 100vh − global header (60px). Page header stays visible.'
        : 'Height = 100vh − global header (60px). Scrollbar appears on the right edge of Main; content scrolls under the sticky global header.',
    ),
    toolbar: region(
      4,
      'List toolbar',
      'sticky',
      'Stays above the rows at all times.',
      'Search · filters · count',
      'Sticky within the list column; never scrolls out of view.',
    ),
    listBody: region(
      5,
      'List body',
      'overflow auto',
      'Rows. Always scrolls independently of everything else.',
      'Wheel · ↑/↓ · PgUp/PgDn',
      `Max height = viewport − header − page header − toolbar. Selected row is scrolled into view on keyboard navigation. ${
        panes
          ? ''
          : 'Column is sticky at top: 60px + 24px (global header + edgeSize.medium) so it stays put while the page scrolls.'
      }`,
      {
        questions:
          'Native vs hidden scrollbar? Keep scroll position when the filter changes?',
      },
    ),
    detailHeader: region(
      6,
      'Detail header',
      panes ? 'sticky' : 'static',
      'Record identity and actions.',
      '—',
      panes
        ? 'Pinned at the top of the detail zone while its content scrolls.'
        : 'Scrolls away with the page like normal content.',
    ),
    detailContent: region(
      7,
      'Detail content',
      panes ? 'overflow auto' : 'grows page',
      'Tabs and content for the selected record.',
      '—',
      panes
        ? 'Scrolls under the pinned header and tabs. Scroll resets to top when the selection changes.'
        : 'Long content makes the page taller. Changing selection scrolls the page back to the top of the detail zone.',
      {
        questions:
          'Reset scroll on selection change, or preserve when switching between records of the same type?',
      },
    ),
  };
};

const ScrollWireframe = ({ variant }) => {
  const panes = variant === 'panes';
  const R = scrollRegions(variant);
  return (
    <Focus
      region={R.viewport}
      label="100vh"
      background="background-back"
      gap="small"
    >
      <Focus region={R.globalHeader} label="60px" pad="xsmall">
        <Box direction="row" gap="small" align="center">
          <Ghost width="80px" height="16px" />
          <Ghost width="40%" height="16px" />
        </Box>
      </Focus>
      <Box direction="row" gap="small" height="440px">
        <Dim label="Nav · pinned" width="90px" flex={false} />
        <Focus
          region={R.main}
          label={panes ? 'overflow hidden' : 'overflow auto'}
          flex
        >
          <Box direction="row" gap="small" flex>
            <Box flex gap="small">
              <Box direction="row" gap="small" align="center">
                <Dim label="Page header" flex />
                <Tag color={panes ? 'brand' : 'text-weak'}>
                  {panes ? 'fixed' : 'scrolls away'}
                </Tag>
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
                    <Box direction="row" gap="xsmall" flex>
                      <Box flex overflow="hidden">
                        <GhostRows count={7} />
                      </Box>
                      <ScrollTrack thumb="40%" />
                    </Box>
                  </Focus>
                </Box>
                <Box flex gap="xsmall">
                  <Focus
                    region={R.detailHeader}
                    label={panes ? 'sticky' : 'static'}
                    pad="xsmall"
                    gap="xsmall"
                  >
                    <Ghost width="140px" height="20px" />
                  </Focus>
                  <Focus
                    region={R.detailContent}
                    label={panes ? 'scrolls' : 'grows page'}
                    pad="xsmall"
                    flex
                  >
                    <Box direction="row" gap="xsmall" flex>
                      <Box flex gap="xsmall" overflow="hidden">
                        {Array.from({ length: 9 }, (_, i) => (
                          <Ghost key={i} width={`${60 + ((i * 17) % 35)}%`} />
                        ))}
                      </Box>
                      {panes && <ScrollTrack thumb="30%" />}
                    </Box>
                  </Focus>
                </Box>
              </Box>
            </Box>
            {!panes && <ScrollTrack thumb="55%" />}
          </Box>
        </Focus>
      </Box>
    </Focus>
  );
};

export const ScrollLevel = () => {
  const [variant, setVariant] = useState('page');
  const v = SCROLL_VARIANTS.find((x) => x.value === variant);
  return (
    <Level
      title="Scroll and height"
      intro="Developers need to know which element owns each scrollbar, what is pinned, and how heights are derived. Toggle the two models to compare."
      control={
        <ToggleGroup
          options={SCROLL_VARIANTS.map(({ label, value }) => ({
            label,
            value,
          }))}
          value={variant}
          onToggle={({ value }) => value && setVariant(value)}
        />
      }
      wireframe={
        <Box gap="small">
          <ScrollWireframe variant={variant} />
          <Text size="small" color="text-weak">
            {v.note}
          </Text>
        </Box>
      }
      regions={scrollRegions(variant)}
    />
  );
};

// ---------------------------------------------------------------------------
// Responsive

const BREAKPOINTS = [
  {
    name: 'Wide',
    range: '≥ 1024px',
    layout: 'Two columns · fixed list 192–384px (size.medium–size.large)',
    nav: 'expanded',
    actions: 'labelled buttons',
    tabs: 'single row',
    pairs: 'name | value',
  },
  {
    name: 'Medium',
    range: '768 – 1023px',
    layout: 'Two columns · list at min width',
    nav: 'icons only',
    actions: 'primary + overflow',
    tabs: 'scroll arrows',
    pairs: 'name | value',
  },
  {
    name: 'Narrow',
    range: '< 768px',
    layout: 'Stacked · list first, detail is a drill-in screen',
    nav: 'in drawer',
    actions: 'overflow menu',
    tabs: 'scroll',
    pairs: 'stacked',
  },
];

const RESPONSIVE = {
  nav: region(
    1,
    'Navigation pane',
    'expanded → icons → drawer',
    'Section switching at every width.',
    'Collapse toggle · menu button',
    'Collapses to icons under 1024px and moves behind the header menu button under 768px.',
  ),
  surface: region(
    2,
    'List–detail surface',
    'two columns → stacked',
    'The arrangement of the two zones.',
    'Back button (narrow only)',
    'Grid columns [auto, flex] above 768px. Below, only one zone is visible: the list by default, the detail after a row is chosen, with Back in the detail header.',
    {
      questions:
        'Container query on Main or viewport media query? Should Medium drop to a proportional list instead of the 192px (size.medium) minimum?',
    },
  ),
  pageHeader: region(
    3,
    'Page header actions',
    'buttons → overflow',
    'Collection-level actions.',
    'Add users · Divider toggle',
    'Secondary actions fold into an overflow menu first; the primary keeps its label as long as possible.',
  ),
  detailHeader: region(
    4,
    'Detail header',
    'row → wraps',
    'Heading and record actions.',
    '—',
    'Trailing zone wraps beneath the leading zone when the heading would truncate below ~20 characters. Actions collapse to an overflow menu at narrow.',
  ),
  tabs: region(
    5,
    'Detail tabs',
    'row → scrollable row',
    'Facet switching.',
    '←/→ scroll arrows',
    'Tabs never wrap to two lines; the tablist scrolls horizontally with arrows when it overflows.',
    {
      questions:
        'Shorten labels at narrow widths (e.g. "Groups") or allow scrolling only?',
    },
  ),
  pairs: region(
    6,
    'Name–value pairs',
    'horizontal → vertical',
    'Record attributes.',
    '—',
    'Pairs switch from two columns to stacked when the detail zone is under 480px, independent of the viewport.',
  ),
};

const MiniLayout = ({ bp }) => {
  const narrow = bp.name === 'Narrow';
  const medium = bp.name === 'Medium';
  return (
    <Box gap="xsmall">
      <Box direction="row" justify="between" align="baseline">
        <Text weight={500}>{bp.name}</Text>
        <Mono color="text-weak">{bp.range}</Mono>
      </Box>
      <Box direction={narrow ? 'row' : 'column'} gap="small" align="start">
        <Frame
          width={narrow ? '220px' : undefined}
          flex={narrow ? false : undefined}
          height="300px"
          pad={{ horizontal: 'small', top: 'xsmall', bottom: 'xsmall' }}
          gap="small"
        >
          <Box direction="row" gap="xsmall" align="center">
            <Ghost width="20px" height="20px" round="full" />
            <Ghost width="60px" height="10px" />
            <Box flex />
            {narrow && <Ghost width="20px" height="20px" />}
          </Box>
          <Box direction="row" gap="small" flex>
            {!narrow && (
              <Mini
                region={RESPONSIVE.nav}
                width={medium ? '28px' : '64px'}
                pad="4xsmall"
                gap="4xsmall"
                flex={false}
              >
                <Ghost height="8px" />
                <Ghost height="8px" />
              </Mini>
            )}
            <Box flex gap="small">
              <Mini
                region={RESPONSIVE.pageHeader}
                direction="row"
                justify="between"
                align="center"
                pad="4xsmall"
              >
                <Ghost width="40%" height="10px" />
                <Ghost
                  width={narrow || medium ? '20px' : '50px'}
                  height="16px"
                  round="full"
                />
              </Mini>
              <Mini
                region={RESPONSIVE.surface}
                flex
                direction="row"
                gap="xsmall"
                pad="4xsmall"
              >
                <Box
                  width={narrow ? '100%' : medium ? '45%' : '34%'}
                  gap="4xsmall"
                  flex={false}
                >
                  <Ghost height="14px" />
                  <GhostRows count={4} />
                </Box>
                {!narrow && (
                  <Box flex gap="small">
                    <Mini
                      region={RESPONSIVE.detailHeader}
                      direction="row"
                      justify="between"
                      pad="4xsmall"
                    >
                      <Ghost width="40%" height="10px" />
                      <Ghost width={medium ? '14px' : '30px'} height="10px" />
                    </Mini>
                    <Mini
                      region={RESPONSIVE.tabs}
                      direction="row"
                      gap="4xsmall"
                      pad="4xsmall"
                    >
                      <Ghost width="20%" height="6px" background="brand" />
                      <Ghost width="25%" height="6px" />
                      <Ghost width="25%" height="6px" />
                    </Mini>
                    <Mini
                      region={RESPONSIVE.pairs}
                      pad="4xsmall"
                      gap="4xsmall"
                      flex
                    >
                      {[0, 1, 2].map((i) => (
                        <Box key={i} direction="row" gap="4xsmall">
                          <Ghost width="30%" height="6px" />
                          <Ghost width="50%" height="6px" />
                        </Box>
                      ))}
                    </Mini>
                  </Box>
                )}
              </Mini>
            </Box>
          </Box>
        </Frame>
        {narrow && (
          <Frame
            width="220px"
            flex={false}
            height="300px"
            pad={{ horizontal: 'small', top: 'xsmall', bottom: 'xsmall' }}
            gap="small"
          >
            <Box direction="row" gap="xsmall" align="center">
              <Ghost width="20px" height="20px" round="full" />
              <Ghost width="60px" height="10px" />
            </Box>
            <Mini
              region={RESPONSIVE.detailHeader}
              direction="row"
              gap="xsmall"
              align="center"
              pad="4xsmall"
            >
              <Tag>← Back</Tag>
              <Ghost width="40%" height="10px" />
              <Box flex />
              <Ghost width="14px" height="10px" />
            </Mini>
            <Mini
              region={RESPONSIVE.tabs}
              direction="row"
              gap="4xsmall"
              pad="4xsmall"
            >
              <Ghost width="25%" height="6px" background="brand" />
              <Ghost width="30%" height="6px" />
              <Ghost width="30%" height="6px" />
            </Mini>
            <Mini region={RESPONSIVE.pairs} pad="4xsmall" gap="4xsmall" flex>
              {[0, 1].map((i) => (
                <Box key={i} gap="4xsmall">
                  <Ghost width="30%" height="6px" />
                  <Ghost width="70%" height="6px" />
                </Box>
              ))}
            </Mini>
          </Frame>
        )}
      </Box>
      <Box gap="4xsmall">
        <Text size="small">{bp.layout}</Text>
        <Text size="small" color="text-weak">
          Nav {bp.nav} · actions {bp.actions} · tabs {bp.tabs} · pairs{' '}
          {bp.pairs}
        </Text>
      </Box>
    </Box>
  );
};

export const ResponsiveLevel = () => (
  <Level
    title="Responsive behaviour"
    intro="Three widths, side by side. Each shows how the shell, the surface and the detail zone re-flow; the legend states the rule per region."
    wireframe={
      <Grid columns={['flex', 'flex', 'auto']} gap="medium">
        {BREAKPOINTS.map((bp) => (
          <MiniLayout key={bp.name} bp={bp} />
        ))}
      </Grid>
    }
    regions={RESPONSIVE}
  />
);

// ---------------------------------------------------------------------------
// States

const STATES = {
  loading: region(
    1,
    'Loading',
    'skeleton · per zone',
    'First load of the list, and each detail fetch after a selection.',
    'Skeleton rows · skeleton pairs',
    'List and detail load independently; never block the whole page. Toolbar stays interactive.',
    {
      questions:
        'Skeleton vs spinner for the detail? Delay before showing (≈300ms)?',
    },
  ),
  emptyCollection: region(
    2,
    'Empty collection',
    'list zone · full surface',
    'No users exist yet.',
    'Primary call to action (Add users)',
    'Detail zone is hidden; the empty state owns the whole surface.',
  ),
  noResults: region(
    3,
    'No results',
    'list body',
    'Search or filter matched nothing.',
    'Clear filters',
    'Toolbar stays; the message replaces the rows. Detail keeps the last selection until cleared.',
  ),
  noSelection: region(
    4,
    'No selection',
    'detail zone',
    'Nothing chosen yet, or the selected record was removed/filtered out.',
    '—',
    'Detail shows "Select a user to see details". Default behaviour is to auto-select the first row instead.',
    { questions: 'Auto-select first row, or start empty?' },
  ),
  error: region(
    5,
    'Error',
    'inline · per zone',
    'A fetch failed for the list or the detail.',
    'Retry',
    'Error is scoped to the zone that failed; the other zone keeps working. Toast only for action failures.',
  ),
  readOnly: region(
    6,
    'Read-only / no permission',
    'actions',
    'The viewer cannot change this record or collection.',
    '—',
    'Hide actions the user can never have; disable (with tooltip) actions that are temporarily unavailable.',
    { questions: 'Hide vs disable rule — confirm with the platform team.' },
  ),
};

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

const Msg = ({ children, action }) => (
  <Box flex align="center" justify="center" gap="small" pad="small">
    <Text textAlign="center">{children}</Text>
    {action && <Tag>{action}</Tag>}
  </Box>
);

const Pair = () => (
  <Box direction="row" gap="small">
    <Ghost width="30%" height="10px" />
    <Ghost width="50%" height="10px" />
  </Box>
);

// One large wireframe per state. Highlighted (brand) blocks show where the
// state renders; dimmed blocks keep working untouched.
const STATE_FRAMES = {
  loading: (
    <>
      <Hot width="40%">
        <Ghost height="28px" />
        <GhostRows count={5} selected={-1} />
      </Hot>
      <Hot flex>
        <Ghost width="50%" height="20px" />
        {[0, 1, 2, 3].map((i) => (
          <Pair key={i} />
        ))}
      </Hot>
    </>
  ),
  emptyCollection: (
    <Hot flex>
      <Msg action="Add users">No users yet</Msg>
    </Hot>
  ),
  noResults: (
    <>
      <Hot width="40%">
        <Ghost height="28px" />
        <Msg action="Clear filters">No matches</Msg>
      </Hot>
      <Dim label="Detail (unchanged)" flex />
    </>
  ),
  noSelection: (
    <>
      <Dim label="List" width="40%" />
      <Hot flex>
        <Msg>Select a user to see details</Msg>
      </Hot>
    </>
  ),
  error: (
    <>
      <Dim label="List" width="40%" />
      <Hot flex>
        <Msg action="Retry">Couldn't load this user</Msg>
      </Hot>
    </>
  ),
  readOnly: (
    <>
      <Dim label="List" width="40%" />
      <Hot flex>
        <Box direction="row" justify="between" align="center">
          <Ghost width="40%" height="20px" />
          <Box direction="row" gap="xsmall" align="center">
            <Ghost
              width="64px"
              height="24px"
              round="full"
              style={{ opacity: 0.4 }}
            />
            <Tag color="text-weak">disabled</Tag>
          </Box>
        </Box>
        <Dim label="read-only pairs" flex />
      </Hot>
    </>
  ),
};

const StatePicker = ({ value, onChange }) => (
  <Box as="nav" gap="xxsmall" width={{ min: 'medium' }} flex={false}>
    {Object.entries(STATES).map(([key, r]) => {
      const active = key === value;
      return (
        <Button key={key} plain onClick={() => onChange(key)} fill="horizontal">
          <Box
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
            round="xsmall"
            background={active ? 'background-contrast' : undefined}
            border={{
              side: 'left',
              size: 'medium',
              color: active ? 'brand' : 'transparent',
            }}
          >
            <Badge region={r} size="small" />
          </Box>
        </Button>
      );
    })}
  </Box>
);

const StatesExplorer = () => {
  const [state, setState] = useState('loading');
  const r = STATES[state];
  return (
    <Grid columns={['auto', 'flex']} gap="large">
      <StatePicker value={state} onChange={setState} />
      <Box gap="medium">
        <Frame height="320px" direction="row" pad="small" gap="small">
          {STATE_FRAMES[state]}
        </Frame>
        <Box gap="xsmall">
          <Badge region={r} />
          <Box margin={{ left: '32px' }}>
            <RegionDetails
              region={r}
              labels={{ owns: 'Trigger', controls: 'Control' }}
            />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export const StatesLevel = () => (
  <Level
    title="States"
    intro="Pick a state to see where it renders and what control it offers. Each state is scoped to a zone; everything outside the highlighted block keeps working."
  >
    <StatesExplorer />
  </Level>
);

// ---------------------------------------------------------------------------
// Data & performance

const DATA = {
  list: region(
    1,
    'List fetch',
    'GET /users?page=…',
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
    'GET /users?q=…&status=…',
    'Narrowing the collection.',
    'Debounce ≈300ms · cancel in-flight',
    'Server-side when the collection is paged; client-side only for small, fully loaded sets. Count comes from the response.',
  ),
  detail: region(
    3,
    'Detail fetch',
    'GET /users/:id',
    'Full record for the selected row.',
    '—',
    'Fired on selection; cached per id so revisiting is instant. Header renders from list data immediately, body waits for the fetch.',
  ),
  tabs: region(
    4,
    'Tab lazy-load',
    'GET /users/:id/roles · /groups',
    'Membership facets.',
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
    title="Data and performance"
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
    'page header · trailing',
    'Actions that create or affect the whole set: Add users, import, export.',
    'One primary (secondary styling here) · overflow for the rest',
    'Always visible regardless of selection. Never acts on the selected record.',
  ),
  record: region(
    2,
    'Record actions',
    'detail header · trailing',
    'Actions on the selected record: edit, reset password, suspend, delete.',
    'Primary + overflow menu · destructive last and separated',
    'Change with the selection and permissions. Destructive actions always confirm. Delete returns focus to the list and selects the next row.',
    {
      questions:
        'Should the most common action be a visible button or everything in the menu?',
    },
  ),
  section: region(
    3,
    'Section actions',
    'content area · top trailing',
    'Actions that add to the facet being viewed: Assign roles, Add to user groups.',
    'One secondary button per section',
    'Scoped to the visible tab. Opens a layer; on success the list in the section updates in place.',
  ),
  row: region(
    4,
    'Row actions',
    'inline · list rows in the content area',
    'Remove a single membership row; follow a link to its source.',
    'Trailing icon button · anchor',
    'Only in detail-zone lists, never in the main list — the main list is for selection only. Removal confirms when the effect is not easily reversible.',
    {
      questions:
        'Do we ever need bulk selection in the main list? If so this model changes.',
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
          <Slot scope="collection" direction="row" align="center" gap="xsmall">
            <Dot scope="collection" id={ACTIONS.collection.id} />
            <Ghost width="80px" height="24px" round="full" />
          </Slot>
        </Box>
        <Box direction="row" gap="small" flex>
          <Dim
            label="List — selection only, no actions"
            width="34%"
            flex={false}
          />
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
                <Dot scope="record" id={ACTIONS.record.id} />
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
                  <Dot scope="section" id={ACTIONS.section.id} />
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
                    <Dot scope="row" id={ACTIONS.row.id} />
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
    title="Actions and ownership"
    intro="Every action lives in exactly one scope, and each scope has one home on the page. Colour marks the scope; the legend gives the rules."
    wireframe={<ActionsWireframe />}
    regions={ACTIONS}
  />
);
