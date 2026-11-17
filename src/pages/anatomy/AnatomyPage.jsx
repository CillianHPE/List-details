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
  VISIBLE_BEHAVIOUR_TABS,
} from './primitives';
import {
  ScrollLevel,
  ResponsiveLevel,
  StatesLevel,
  DataLevel,
  ActionsLevel,
} from './BehaviourLevels';

const BEHAVIOUR_CONTENT = {
  scroll: ScrollLevel,
  responsive: ResponsiveLevel,
  states: StatesLevel,
  data: DataLevel,
  actions: ActionsLevel,
};

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
    'The pattern itself: a selection surface (list) beside an inspection surface (detail). Sits in the page content, directly below the page header.',
    'Divider between zones (optional)',
    'Fills the remaining width and height of the page content; never sets its own.',
    {
      why: [
        'Find and inspect without leaving the page',
        'Keep the selected record visible while scanning the rest',
        'Switch records in one click, not a page round-trip',
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
    'Finding and selecting one record from the collection.',
    'List toolbar · list body',
    'Proportional column: 40% of the surface, floored at a token.',
    {
      space: '40% of surface · min 256px (size.small)',
      ...see('scroll', 'responsive'),
    },
    {
      why: [
        'Users arrive with a vague target, not an ID',
        'Search and filters narrow the set fast',
        'Stays visible so the chosen record keeps its context',
      ],
    },
  ),
  detail: region(
    2,
    'Detail zone',
    '<section> · inspection surface',
    'Everything about the selected record, and the actions that apply to it.',
    'Detail header · tabs · body',
    'Proportional column: 60% of the surface.',
    {
      space: '60% of surface (≈ 670px at 1116px content width)',
      ...see('scroll', 'responsive'),
    },
    {
      why: [
        'Show everything about the chosen record in one place',
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
    note: "Alternative (the prototype's original behaviour). The list is clamped to a token range so row content stays legible; the detail zone absorbs all remaining width.",
  },
  {
    value: 'split',
    label: 'Proportional',
    listWidth: '40%',
    listLabel: '40% · min 256px (size.small)',
    detailLabel: '60%',
    note: 'Current behaviour (Users prototype). Both zones scale with the surface, keeping a 2:3 ratio — Grid [40% in px, flex]. Suits lists with richer rows (status, meta) at the cost of a narrower detail column on small surfaces.',
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
  'Letting the user trade list width for detail width within the token range.',
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
    'Narrowing and adding to the collection without leaving the page.',
    'Search input · Add users (collection action, trailing) · quick-filter toggle group · result count',
    'Sits above the rows. Filters apply instantly and update the count. Collection actions live here, not in the page header, because they act on the same set the filters shape.',
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
    '<ul role="listbox"> · option rows',
    'Presenting the collection and holding the current selection.',
    'Rows (avatar, name, role) · ↑/↓ · Enter',
    'Holds exactly one selection — highlighted and announced; first row selected by default.',
    {
      why: [
        'Consistent row rhythm makes records easy to compare',
        'Selected state marks which record is open',
        'Users keep their place while reading the detail',
      ],
      ...see('scroll', 'states'),
    },
  ),
  row: region(
    3,
    'Row',
    'role="option" · aria-selected',
    'One record, summarised to what is needed to choose it.',
    'Click / Enter to select',
    'Primary text + one line of secondary text. No per-row actions — those live in the detail zone.',
    see('actions'),
    {
      why: [
        'Just enough to answer “is this the one?”',
        'More slows scanning; less forces a click',
        'Summary-only rows keep the list fast to read',
      ],
    },
  ),
};

const DETAIL = {
  header: region(
    1,
    'Detail header',
    'header row · leading + trailing',
    'Identity of the selected record and the actions that apply to it.',
    'Leading zone · trailing zone',
    'One row mirroring the page header: identity on the left, actions on the right.',
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
    'None — may support inline rename',
    'Takes the available width; text truncates or wraps before the trailing zone does.',
  ),
  trailing: region(
    '1b',
    'Trailing',
    'buttons · menu',
    'Actions that apply to the selected record only.',
    'Primary action · overflow menu (destructive last)',
    'Right-aligned, content width.',
    see('responsive', 'actions'),
  ),
  tabs: region(
    2,
    'Detail tabs',
    'tablist · tab · tabpanel (optional)',
    'Switching between facets of the record when there is more than one.',
    'Tab per facet · ←/→',
    'Only present when the record has several facets. Otherwise the content area follows the header directly.',
    {
      why: [
        'Jump straight to the facet needed (profile, roles, groups)',
        'Avoids one long scrolling page',
        'Scopes each facet’s content and actions',
      ],
      ...see('responsive'),
    },
  ),
  content: region(
    3,
    'Content area',
    'tabpanel or plain region',
    'Whatever best presents the facet: name–value pairs, a list, a table, an empty state …',
    'Depends on the content shown',
    'Fills the remaining height. Section-level actions sit at the top of the area.',
    see('scroll', 'states'),
    {
      why: [
        'Each facet uses the clearest form: pairs, list or table',
        'Neutral area, no forced single layout',
      ],
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
        <Ghost height="36px" background="transparent" border />
        <Box direction="row" gap="xsmall">
          <Ghost width="40px" height="24px" round="full" background="brand" />
          <Ghost width="56px" height="24px" round="full" />
          <Ghost width="60px" height="24px" round="full" />
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
              <Ghost width="90px" height="32px" round="full" />
              <Ghost width="32px" height="32px" round="full" />
            </Box>
          </Block>
        </Box>
      </Focus>
      <Focus
        region={DETAIL.tabs}
        label="optional"
        border={{ color: 'brand', size: 'small', style: 'dashed' }}
      >
        <Box direction="row" gap="small" wrap>
          <Ghost width="60px" height="20px" background="brand" />
          <Ghost width="110px" height="20px" />
          <Ghost width="150px" height="20px" />
        </Box>
      </Focus>
      <Focus region={DETAIL.content} label="pairs · list · table …" flex>
        <Box direction="row" justify="end">
          <Ghost width="90px" height="28px" round="full" />
        </Box>
        <Dim label="Content" flex />
      </Focus>
    </Box>
  </Box>
);

// Structure and Behaviour are separate pages (#/anatomy, #/behaviour); both
// render through this component so tab state survives cross-links between them.
const SECTIONS = {
  structure: {
    hash: 'anatomy',
    title: 'Structure',
    subtitle:
      'Zoom from the page down into each zone. Every level names its regions, their roles and what they own.',
  },
  behaviour: {
    hash: 'behaviour',
    title: 'Behaviour',
    subtitle:
      'How the surface responds: selection, navigation, scroll, responsive and more.',
  },
};

export const AnatomyPage = ({
  section = 'structure',
  chrome = true,
  onChromeChange,
}) => {
  const [zone, setZone] = useState('fixed');
  const [level, setLevel] = useState(0);
  const [behaviour, setBehaviour] = useState(0);
  const go = (g, tab) => {
    if (g === 'behaviour') {
      const i = VISIBLE_BEHAVIOUR_TABS.findIndex((t) => t.key === tab);
      if (i < 0) return;
      setBehaviour(i);
    } else setLevel(tab);
    window.location.hash = `/${SECTIONS[g].hash}`;
    window.scrollTo({ top: 0 });
  };
  const group = section;
  return (
    <AnatomyNav.Provider value={go}>
      <Page pad={{ bottom: 'xlarge' }}>
        <PageContent gap="medium">
          <PageHeader
            title={SECTIONS[group].title}
            subtitle={SECTIONS[group].subtitle}
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
          {group === 'behaviour' && (
            <Tabs
              activeIndex={behaviour}
              onActive={setBehaviour}
              justify="start"
            >
              {VISIBLE_BEHAVIOUR_TABS.map(({ key, label }) => {
                const Content = BEHAVIOUR_CONTENT[key];
                return (
                  <Tab key={key} title={label}>
                    <Content />
                  </Tab>
                );
              })}
            </Tabs>
          )}
          {group === 'structure' && (
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
                  intro="Two zones with distinct jobs: the list is for finding and choosing, the detail is for inspecting and acting. Toggle the variations to compare how width is shared."
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
                  intro="The header mirrors the page header — heading on the left, record actions on the right. Tabs appear only when the record has several facets. Below is a single content area that takes whatever fits: pairs, a list, a table."
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
