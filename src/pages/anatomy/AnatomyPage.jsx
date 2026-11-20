import { Search } from '@hpe-design/icons-grommet';
import { useState } from 'react';
import {
  Box,
  CheckBox,
  Page,
  PageContent,
  PageHeader,
  Paragraph,
  Tab,
  Text,
  Tabs,
  ToggleGroup,
} from 'grommet';
import {
  region,
  see,
  AnatomyNav,
  Block,
  Focus,
  Ghost,
  Dim,
  GhostRows,
  Level,
} from './primitives';
import { ScrollLevel, DataLevel, ActionsLevel } from './BehaviourLevels';
import {
  BreakpointsLevel,
  RegionsLevel,
  DrillInLevel,
  ShellConfigsLevel,
} from './ResponsiveLevels';
import {
  LoadingLevel,
  EmptyLevel,
  NoSelectionLevel,
  ErrorLevel,
  ReadOnlyLevel,
} from './StatesLevels';
import { CritNov19Level } from './CritLevels';
import {
  PatternWhatLevel,
  PatternWhenLevel,
  PatternStoryLevel,
  PatternWhenNotLevel,
} from './PatternLevels';

// Lo-fi anatomy of the list–detail page, explored at four zoom levels:
//   Page   · where the list–detail surface sits inside the app shell
//   Zones  · the two zones, what they are and the space they can occupy
//   List   · inside the list zone (toolbar + list body)
//   Detail · inside the detail zone (header + tabs + body)
// Each level has a wireframe and a legend of its regions (role / owns /
// controls / layout). How regions *act* (scroll, responsive, states…) lives
// in BehaviourLevels; Structure legends link there instead of repeating it.

// Only the surface is documented here; the shell around it (global header,
// nav, page header) is drawn dimmed as context and owned by the app shell.
const PAGE = {
  surface: region(
    1,
    'List–detail surface',
    'Grid · 2 columns',
    'Lets the user pick one record from a collection and read or act on it, side by side, without leaving the page.',
    'Divider between zones (optional)',
    'Fills the remaining width of the page content and the full view height below the page header, ending level with the side navigation (12px, edgeSize.small, above the viewport edge).',
    {
      why: [
        'Find and inspect without leaving the page',
        'Keep the selected record visible while scanning the rest',
        'Switch records in 1 click, not a page round-trip',
      ],
      ...see('scroll', 'responsive'),
    },
  ),
};

const ZONES = {
  list: region(
    1,
    'List zone',
    '<section> · selection surface',
    'Helps the user find a record in the collection and choose it. It is for selection, not for reading.',
    'List toolbar · list body',
    'Proportional column: 40% of the surface, floored at a token.',
    {
      space: '40% of surface · min 256px (size.small)',
      ...see('scroll', 'responsive'),
    },
    {
      why: [
        'People arrive with a vague target, not an ID',
        'Search and filters narrow the set fast',
        'Stays visible so the chosen record keeps its context',
      ],
    },
  ),
  detail: region(
    2,
    'Detail zone',
    '<section> · inspection surface',
    'Shows the selected record in full and offers the actions that apply to it. It is for reading and acting, not for browsing.',
    'Detail header · content area',
    'Proportional column: 60% of the surface.',
    {
      space: '60% of surface (≈ 670px at 1116px content width)',
      ...see('scroll', 'responsive'),
    },
    {
      why: [
        'Show everything about the chosen record in 1 place',
        'Act on it (edit, remove) without navigating away',
        'Dedicated zone keeps the list in view while reading',
      ],
    },
  ),
};

const ZONE_VARIANTS = [
  {
    value: 'fixed',
    label: 'Fixed list',
    listWidth: '34%',
    listLabel: '256–384px (size.small–size.medium)',
    detailLabel: 'flex',
    note: "Alternative (the prototype's original behaviour). The list is clamped to a token range so item content stays legible; the detail zone absorbs all remaining width.",
  },
  {
    value: 'split',
    label: 'Proportional',
    listWidth: '40%',
    listLabel: '40% · min 256px (size.small)',
    detailLabel: '60%',
    note: 'Current behaviour. Both zones scale with the surface, keeping a 2:3 ratio — Grid [40% in px, flex]. Suits lists with richer items (status, meta) at the cost of a narrower detail column on small surfaces.',
  },
  {
    value: 'resizable',
    label: 'Resizable',
    listWidth: '34%',
    listLabel: 'drag · 256–384px (size.small–size.medium)',
    detailLabel: 'flex',
    note: 'Alternative. The divider becomes a handle: drag (or arrow keys) to resize the list within the same token range; double-click resets. Try it in the wireframe.',
    // Parked after the 12 Nov stand-up; implementation kept for later.
    hidden: true,
  },
];
const VISIBLE_ZONE_VARIANTS = ZONE_VARIANTS.filter((v) => !v.hidden);

// Resizable variant: the divider is the control
const RESIZE_MIN = 256; // size.small
const RESIZE_MAX = 384; // size.large
const RESIZE_STEP = 8; // keyboard step (edgeSize.xxsmall)

const RESIZE_HANDLE = region(
  3,
  'Resize handle',
  '<div role="separator" aria-orientation="vertical" aria-valuemin/max/now>',
  'Lets the user trade list width for detail width, within the token range.',
  'Pointer drag · ←/→ (8px, size.xxsmall) · Home/End to min/max · double-click to reset',
  'Sits on the divider, 8px (edgeSize.xxsmall) hit area, col-resize cursor. Width clamps to 256–384px (size.small–size.medium) and persists per user.',
  {
    questions:
      'Persist in localStorage or user preferences? Should the handle be always visible or appear on hover/focus?',
    ...see('responsive', 'actions'),
  },
);

const LIST = {
  toolbar: region(
    1,
    'List toolbar',
    '<search> · search',
    'Narrows the collection (search, filters) and adds to it, so the list stays usable at any size.',
    'Search input · collection action (trailing) · quick-filter toggle group · result count',
    'Sits above the list items. Filters apply instantly and update the count. Collection actions live here, not in the page header, because they act on the same set the filters shape.',
    see('scroll', 'data'),
    {
      why: [
        'Search and filters keep long lists usable',
        'Add action sits beside the set it changes',
        'Proximity tells users what the button affects',
      ],
    },
  ),
  rows: region(
    2,
    'List body',
    '<ul role="listbox"> · option items',
    'Presents the records as a scannable list and marks the one that is open.',
    'Rows (avatar, name, role) · ↑/↓ · Enter',
    'Holds exactly one selection — highlighted and announced; first item selected by default.',
    {
      why: [
        'Consistent item rhythm makes records easy to compare',
        'Selected state marks which record is open',
        'People keep their place while reading the detail',
      ],
      ...see('scroll', 'states'),
    },
  ),
  row: region(
    3,
    'List item',
    'role="option" · aria-selected',
    'Summarises one record with just enough to decide whether to open it.',
    'Click / Enter to select',
    'Primary text + 1 line of secondary text. No per-item actions — those live in the detail zone.',
    see('actions'),
    {
      why: [
        'Just enough to answer “is this the one?”',
        'More slows scanning; less forces a click',
        'Summary-only items keep the list fast to read',
      ],
    },
  ),
};

const DETAIL = {
  header: region(
    1,
    'Detail header',
    'header row · leading + trailing',
    'Confirms which record is open and offers the actions that apply to the whole record.',
    'Leading zone · trailing zone',
    '1 row mirroring the page header: identity on the left, actions on the right.',
    see('actions'),
    {
      why: [
        'Confirms which record is in focus before acting',
        'Identity next to actions avoids acting on the wrong record',
        'Record-level controls live in one predictable place',
      ],
    },
  ),
  leading: region(
    '1a',
    'Leading',
    '<h2> · identifiers',
    'Things that identify the record: name, status, subtitle or key metadata.',
    'None',
    'Takes the available width; text truncates or wraps before the trailing zone does.',
  ),
  trailing: region(
    '1b',
    'Trailing',
    'buttons · menu',
    'Organises the actions that apply to the selected record: the most common one is visible, the rest are grouped in an overflow menu.',
    'Primary action · overflow menu (destructive last)',
    'Right-aligned, content width. Visible actions are ordered by frequency of use; destructive actions sit last in the menu.',
    see('responsive', 'actions'),
  ),
  content: region(
    2,
    'Content area',
    'everything below the header',
    'Presents the record in whatever form suits it best: name–value pairs, a list, a table or an empty state. When the record has several facets, tabs at the top of the area organise them.',
    'Depends on the content shown',
    'Fills the remaining height. Section-level actions sit at the top of the area, or at the top of the active tab when tabs are used.',
    see('scroll', 'states'),
    {
      why: [
        'Each record uses the clearest form: pairs, list or table',
        'Neutral area, no forced single layout',
        'Optional structure (tabs, sections) lives inside it rather than beside it',
      ],
    },
  ),
  tabs: region(
    '2a',
    'Tabs',
    'optional · tablist',
    'One way of organising the content area when the record has more than 1 facet. Alternatives are stacked sections or an accordion.',
    'Tab per facet · ←/→',
    'Sits at the top of the content area and stays put while the panel scrolls. Each tab scopes its own content and actions. Omitted when there is a single facet.',
    {
      why: [
        'Jump straight to the facet needed',
        'Avoids one long scrolling page',
        'Scopes each facet’s content and actions',
      ],
      ...see('responsive'),
    },
  ),
};

// ---------------------------------------------------------------------------
// Level 1 · Page — where the surface sits in the shell

// Drawn against App Shell V3; shell regions are dimmed context only.
const PageWireframe = () => (
  <Box
    border={{ color: 'border-weak' }}
    background="background"
    round="small"
    overflow="hidden"
  >
    <Box
      direction="row"
      align="center"
      justify="between"
      pad="small"
      border={{ side: 'bottom', color: 'border-weak' }}
      background="background-front"
    >
      <Text size="small" color="text-weak">
        Global header
      </Text>
      <Box direction="row" gap="small" align="center">
        <Ghost width="200px" height="28px" />
        <Ghost width="28px" height="28px" round="full" />
        <Ghost width="28px" height="28px" round="full" />
      </Box>
    </Box>

    <Box direction="row" gap="xsmall" pad="xsmall" align="stretch">
      <Dim label="Navigation pane" width="200px" flex={false} round="large" />

      <Box flex gap="small" pad="small">
        <Dim label="Page header" pad="medium" />
        <Focus
          showRole={false}
          region={PAGE.surface}
          label="fills page content"
          round="xsmall"
          height={{ min: '260px' }}
        >
          <Box direction="row" gap="small" flex>
            <Dim label="List zone" width="34%" flex={false} />
            <Dim label="Detail zone" flex />
          </Box>
        </Focus>
      </Box>
    </Box>
  </Box>
);

// ---------------------------------------------------------------------------
// Level 2 · Zones — list vs detail, and how much space each can take

const ResizeHandle = ({ width, onChange }) => {
  const clamp = (w) => Math.min(RESIZE_MAX, Math.max(RESIZE_MIN, w));
  const onPointerDown = (e) => {
    const startX = e.clientX;
    const startW = width;
    const move = (ev) => onChange(clamp(startW + ev.clientX - startX));
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    e.preventDefault();
  };
  const onKeyDown = (e) => {
    const map = {
      ArrowLeft: width - RESIZE_STEP,
      ArrowRight: width + RESIZE_STEP,
      Home: RESIZE_MIN,
      End: RESIZE_MAX,
    };
    if (map[e.key] !== undefined) {
      e.preventDefault();
      onChange(clamp(map[e.key]));
    }
  };
  return (
    <Box
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize list zone"
      aria-valuemin={RESIZE_MIN}
      aria-valuemax={RESIZE_MAX}
      aria-valuenow={width}
      tabIndex={0}
      width="8px"
      flex={false}
      align="center"
      justify="center"
      style={{ cursor: 'col-resize', position: 'relative' }}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onDoubleClick={() => onChange(RESIZE_MIN + (RESIZE_MAX - RESIZE_MIN) / 2)}
    >
      <Box fill="vertical" border={{ side: 'left', color: 'border-weak' }} />
      <Box
        background="brand"
        round="full"
        width="6px"
        height="40px"
        style={{ position: 'absolute' }}
      />
      <Box
        background="text-strong"
        round="full"
        align="center"
        justify="center"
        flex={false}
        style={{
          position: 'absolute',
          top: '8px',
          left: '-6px',
          width: '20px',
          height: '20px',
          maxWidth: 'none',
        }}
      >
        <Text size="xsmall" weight={700} color="#ffffff">
          {RESIZE_HANDLE.id}
        </Text>
      </Box>
    </Box>
  );
};

const ZonesWireframe = ({ variant }) => {
  const v = ZONE_VARIANTS.find((o) => o.value === variant);
  const resizable = variant === 'resizable';
  const [listPx, setListPx] = useState(288);
  return (
    <Box gap="small">
      <Box
        border={{ color: 'border-weak' }}
        background="background-back"
        round="small"
        pad="small"
        gap="small"
      >
        <Dim label="Page header" height="56px" />
        <Box direction="row" gap="small" height={{ min: '360px' }}>
          <Focus
            region={ZONES.list}
            label={resizable ? `${listPx}px` : v.listLabel}
            width={resizable ? `${listPx}px` : v.listWidth}
            flex={false}
          >
            <Dim label="List toolbar" height="72px" />
            <Dim label="List body" flex />
          </Focus>
          {resizable ? (
            <ResizeHandle width={listPx} onChange={setListPx} />
          ) : (
            <Box border={{ side: 'left', color: 'border-weak' }} />
          )}
          <Focus region={ZONES.detail} label={v.detailLabel} flex>
            <Dim label="Detail header" height="48px" />
            <Dim label="Tabs" height="36px" />
            <Dim label="Body" flex />
          </Focus>
        </Box>
      </Box>
      <Paragraph margin="none" fill size="small" color="text-weak">
        {v.note}
      </Paragraph>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Level 3 · List zone

const ListWireframe = () => (
  <Box
    border={{ color: 'border-weak' }}
    background="background-back"
    round="small"
    pad="small"
    direction="row"
    gap="small"
    height={{ min: '420px' }}
  >
    <Box width="40%" flex={false} gap="small">
      <Focus region={LIST.toolbar}>
        <Box direction="row" gap="xsmall">
          <Box
            flex
            direction="row"
            align="center"
            gap="xsmall"
            pad={{ horizontal: 'small' }}
            height="36px"
            border
            round="xsmall"
          >
            <Search size="small" color="text-weak" />
            <Ghost width="60px" height="8px" />
          </Box>
          <Box
            width="84px"
            height="36px"
            align="center"
            justify="center"
            border={{ color: 'brand', size: 'small' }}
            round="xsmall"
          >
            <Ghost width="44px" height="6px" background="brand" />
          </Box>
        </Box>
        <Box direction="row" border round="xsmall" alignSelf="start">
          {[{ w: '44px', active: true }, { w: '56px' }, { w: '60px' }].map(
            ({ w, active }, i) => (
              <Box
                key={i}
                width={w}
                height="28px"
                align="center"
                justify="center"
                background={active ? 'background-contrast' : undefined}
                border={i ? { side: 'left', color: 'border' } : undefined}
              >
                <Ghost width="55%" height="6px" />
              </Box>
            ),
          )}
        </Box>
        <Ghost width="60px" height="8px" />
      </Focus>
      <Focus region={LIST.rows} flex>
        <Focus region={LIST.row} pad="xsmall" background="background-contrast">
          <GhostRows count={1} selected={0} />
        </Focus>
        <GhostRows count={4} selected={-1} />
      </Focus>
    </Box>
    <Box border={{ side: 'left', color: 'border-weak' }} />
    <Dim label="Detail zone" flex />
  </Box>
);

// ---------------------------------------------------------------------------
// Level 4 · Detail zone

const DetailWireframe = () => (
  <Box
    border={{ color: 'border-weak' }}
    background="background-back"
    round="small"
    pad="small"
    direction="row"
    gap="small"
    height={{ min: '480px' }}
  >
    <Dim label="List zone" width="30%" flex={false} />
    <Box border={{ side: 'left', color: 'border-weak' }} />
    <Box flex gap="small">
      <Focus region={DETAIL.header}>
        <Box direction="row" gap="small" align="start">
          <Block region={DETAIL.leading} flex>
            <Ghost width="160px" height="24px" />
            <Ghost width="100px" height="10px" />
          </Block>
          <Block region={DETAIL.trailing} flex={false}>
            <Box direction="row" justify="end" gap="xsmall">
              <Ghost width="90px" height="32px" round="xsmall" />
              <Ghost width="32px" height="32px" round="full" />
            </Box>
          </Block>
        </Box>
      </Focus>
      <Focus region={DETAIL.content} flex>
        <Block
          region={DETAIL.tabs}
          border={{ color: 'border', size: 'small', style: 'dashed' }}
        >
          <Box direction="row" gap="small" wrap>
            <Ghost width="60px" height="20px" background="brand" />
            <Ghost width="110px" height="20px" />
            <Ghost width="150px" height="20px" />
          </Box>
        </Block>
        <Box direction="row" justify="end">
          <Ghost width="90px" height="28px" round="xsmall" />
        </Box>
        <Dim label="Content" flex />
      </Focus>
    </Box>
  </Box>
);

// Every page under Anatomy / Behaviour / Responsive / States is addressed by
// its route and rendered through this component so cross-links work.
export const PAGES = {
  'pattern/what': {
    title: 'What it is',
    subtitle:
      'The list–detail pattern in plain language, starting from the job it does.',
    Content: PatternWhatLevel,
  },
  'pattern/when': {
    title: 'User stories',
    subtitle: '4 stories showing when list–detail fits, and a quick check.',
    Content: PatternWhenLevel,
  },
  'pattern/when/gather': {
    title: 'Clearing the access request queue',
    subtitle:
      'Gather · Priya, workspace administrator, works through 3 requests in 1 sitting.',
    Content: () => <PatternStoryLevel id="gather" />,
  },
  'pattern/when/compare': {
    title: 'Spotting what differs between 2 servers',
    subtitle:
      'Compare · Daniel, infrastructure engineer, flips between near-identical records.',
    Content: () => <PatternStoryLevel id="compare" />,
  },
  'pattern/when/triage': {
    title: 'Finding the critical few in 2,340 resources',
    subtitle:
      'Triage · Mei-Ling, NOC operator, acts on the alerts that matter.',
    Content: () => <PatternStoryLevel id="triage" />,
  },
  'pattern/when/quick-edit': {
    title: 'Assigning owners to 41 devices',
    subtitle:
      'Quick edit · Tomás, asset manager, makes the same small change 41 times.',
    Content: () => <PatternStoryLevel id="quick-edit" />,
  },
  'pattern/when-not': {
    title: 'When not to use it',
    subtitle: '4 scenarios where another surface does the job better.',
    Content: PatternWhenNotLevel,
  },
  anatomy: {
    title: 'Structure',
    subtitle:
      'Zoom from the page down into each zone. Every level names its regions, their roles and what they own.',
  },
  'behaviour/scroll': {
    title: 'Scroll & height',
    subtitle:
      'Which part of the surface owns each scrollbar, what is pinned, and how heights are derived.',
    Content: ScrollLevel,
  },
  'behaviour/data': {
    title: 'Data & performance',
    subtitle: 'What loads when, and how the surface stays responsive.',
    Content: DataLevel,
  },
  'behaviour/actions': {
    title: 'Actions & ownership',
    subtitle: 'Every action lives in exactly 1 scope with 1 home on the page.',
    Content: ActionsLevel,
  },
  'responsive/breakpoints': {
    title: 'Breakpoints',
    subtitle:
      'The 3 width tiers the surface responds to, and how width is shared between the zones in each.',
    Content: BreakpointsLevel,
  },
  'responsive/regions': {
    title: 'Regions by width',
    subtitle: 'What each region does differently in each tier.',
    Content: RegionsLevel,
  },
  'responsive/drill-in': {
    title: 'Drill-in',
    subtitle: 'Below the narrow breakpoint the 2 zones become 2 screens.',
    Content: DrillInLevel,
  },
  'responsive/shell-configs': {
    title: 'Shell configurations',
    subtitle:
      'The common shell configurations, each written out as its own section.',
    Content: ShellConfigsLevel,
  },
  'states/loading': {
    title: 'Loading',
    subtitle: 'Skeletons in place; the rest keeps working.',
    Content: LoadingLevel,
  },
  'states/empty': {
    title: 'Empty',
    subtitle: 'No records yet, or no results for a query.',
    Content: EmptyLevel,
  },
  'states/no-selection': {
    title: 'No selection',
    subtitle:
      'First item selected by default; a prompt when the selection is lost.',
    Content: NoSelectionLevel,
  },
  'states/error': {
    title: 'Error',
    subtitle:
      'Inline for loading, toast for actions, Retry beside the message.',
    Content: ErrorLevel,
  },
  'states/read-only': {
    title: 'Read-only',
    subtitle: 'About the controls, not the content.',
    Content: ReadOnlyLevel,
  },
  'crit/2026-11-19': {
    title: 'Page design critique · 19 Nov',
    subtitle:
      'Sentiment, verdicts and the ordered plan from the first review of the live prototype.',
    Content: CritNov19Level,
  },
};

export const AnatomyPage = ({
  route = 'anatomy',
  chrome = true,
  onChromeChange,
}) => {
  const [zone, setZone] = useState('fixed');
  const [level, setLevel] = useState(0);
  const go = (target, tab) => {
    if (!PAGES[target]) return;
    if (target === 'anatomy' && tab !== undefined) setLevel(tab);
    window.location.hash = `/${target}`;
    window.scrollTo({ top: 0 });
  };
  const page = PAGES[route] || PAGES.anatomy;
  const Content = page.Content;
  return (
    <AnatomyNav.Provider value={go}>
      <Page pad={{ bottom: 'xlarge' }}>
        <PageContent gap="medium">
          <PageHeader
            title={page.title}
            subtitle={page.subtitle}
            actions={
              onChromeChange && (
                <CheckBox
                  toggle
                  label="App chrome"
                  checked={chrome}
                  onChange={(e) => onChromeChange(e.target.checked)}
                />
              )
            }
          />
          {Content && <Content />}
          {!Content && (
            <Tabs activeIndex={level} onActive={setLevel} justify="start">
              <Tab title="Page">
                <Level
                  title="Where the surface sits"
                  intro="The list–detail surface lives in the page content, below the page header, and fills whatever space the shell gives it. Everything around it belongs to the app shell and is not part of this pattern."
                  wireframe={<PageWireframe />}
                  regions={PAGE}
                  labels={{ behaviour: 'Layout' }}
                />
              </Tab>
              <Tab title="Zones">
                <Level
                  title="List zone and detail zone"
                  intro="2 zones with distinct jobs: the list is for finding and choosing, the detail is for inspecting and acting. Toggle the variations to compare how width is shared."
                  control={
                    <ToggleGroup
                      options={VISIBLE_ZONE_VARIANTS.map(
                        ({ label, value }) => ({
                          label,
                          value,
                        }),
                      )}
                      value={zone}
                      onToggle={({ value }) => value && setZone(value)}
                    />
                  }
                  wireframe={<ZonesWireframe variant={zone} />}
                  regions={ZONES}
                  labels={{ behaviour: 'Layout' }}
                />
              </Tab>
              <Tab title="List zone">
                <Level
                  title="Inside the list zone"
                  intro="The toolbar narrows the collection; the body below holds exactly one selection. How the two scroll is covered under Behaviour → Scroll & height."
                  wireframe={<ListWireframe />}
                  regions={LIST}
                  labels={{ behaviour: 'Layout' }}
                />
              </Tab>
              <Tab title="Detail zone">
                <Level
                  title="Inside the detail zone"
                  intro="The header mirrors the page header — heading on the left, record actions on the right. Below it is a single content area that takes whatever fits: pairs, a list, a table. Tabs are one optional way of organising that area when the record has several facets."
                  wireframe={<DetailWireframe />}
                  regions={DETAIL}
                  labels={{ behaviour: 'Layout' }}
                />
              </Tab>
            </Tabs>
          )}
        </PageContent>
      </Page>
    </AnatomyNav.Provider>
  );
};
