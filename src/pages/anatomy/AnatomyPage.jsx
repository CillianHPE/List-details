import { useState } from 'react';
import {
  Box,
  CheckBox,
  Page,
  PageContent,
  PageHeader,
  Paragraph,
  Tab,
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
import {
  ScrollLevel,
  ResponsiveLevel,
  StatesLevel,
  DataLevel,
  ActionsLevel,
} from './BehaviourLevels';

// Lo-fi anatomy of the list–detail page, explored at four zoom levels:
//   Page   · where the list–detail surface sits inside the app shell
//   Zones  · the two zones, what they are and the space they can occupy
//   List   · inside the list zone (toolbar + list body)
//   Detail · inside the detail zone (header + tabs + body)
// Each level has a wireframe and a legend of its regions (role / owns /
// controls / layout). How regions *act* (scroll, responsive, states…) lives
// in BehaviourLevels; Structure legends link there instead of repeating it.

const PAGE = {
  header: region(
    1,
    'Global header',
    '<header> · banner',
    'Product identity, workspace switcher, global search, help, notifications, account.',
    'Menu toggle · search · icon buttons · account drop',
    'Full width, above everything else.',
    see(0),
  ),
  nav: region(
    2,
    'Navigation pane',
    '<nav aria-label="Primary"> · navigation',
    'Section switching. The current page is marked with aria-current="page".',
    'Collapse toggle · nav items',
    'Fixed-width column beside Main; collapsible on demand.',
    see(1),
  ),
  main: region(
    3,
    'Main',
    '<main> · main',
    'Everything page-specific. Exactly one per page.',
    '—',
    'Hosts the page header and the list–detail surface.',
  ),
  pageHeader: region(
    4,
    'Page header',
    'PageHeader · <h1>',
    'Page title, subtitle and the single collection-level action.',
    'Page action button (e.g. Add users) · back link when drilled in',
    'Full width of Main, above the surface.',
    see(0, 1),
  ),
  surface: region(
    5,
    'List–detail surface',
    'Grid · 2 columns',
    'The pattern itself: a selection surface (list) beside an inspection surface (detail).',
    'Divider between zones (optional)',
    'Fills the remaining width and height of Main.',
    see(1),
  ),
};

const ZONES = {
  list: region(
    1,
    'List zone',
    '<section> · selection surface',
    'Finding and selecting one record from the collection.',
    'List toolbar · list body',
    'Fixed-width column, clamped to a token range.',
    { space: 'min 192px (size.medium) · max 384px (size.large)', ...see(0, 1) },
  ),
  detail: region(
    2,
    'Detail zone',
    '<section> · inspection surface',
    'Everything about the selected record, and the actions that apply to it.',
    'Detail header · tabs · body',
    'Flexible column. Takes whatever width the list zone leaves.',
    {
      space: 'flex · remaining width (≈ 732px at 1116px content width)',
      ...see(0, 1),
    },
  ),
};

const ZONE_VARIANTS = [
  {
    value: 'fixed',
    label: 'Fixed list',
    listWidth: '34%',
    listLabel: '192–384px (size.medium–size.large)',
    detailLabel: 'flex',
    note: 'Current behaviour. The list is clamped to a token range so row content stays legible; the detail zone absorbs all remaining width.',
  },
  {
    value: 'split',
    label: 'Proportional',
    listWidth: '40%',
    listLabel: '40%',
    detailLabel: '60%',
    note: 'Alternative. Both zones scale with the page, keeping a constant ratio. Suits lists with richer rows (status, meta) at the cost of a narrower detail column on small screens.',
  },
];

const LIST = {
  toolbar: region(
    1,
    'List toolbar',
    '<search> · search',
    'Narrowing the collection without leaving the page.',
    'Search input · quick-filter toggle group · result count',
    'Sits above the rows. Filters apply instantly and update the count.',
    see(0, 3),
  ),
  rows: region(
    2,
    'List body',
    '<ul role="listbox"> · option rows',
    'Presenting the collection and holding the current selection.',
    'Rows (avatar, name, role) · ↑/↓ · Enter',
    'Holds exactly one selection — highlighted and announced; first row selected by default.',
    see(0, 2),
  ),
  row: region(
    3,
    'Row',
    'role="option" · aria-selected',
    'One record, summarised to what is needed to choose it.',
    'Click / Enter to select',
    'Primary text + one line of secondary text. No per-row actions — those live in the detail zone.',
    see(4),
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
    see(4),
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
    see(1, 4),
  ),
  tabs: region(
    2,
    'Detail tabs',
    'tablist · tab · tabpanel (optional)',
    'Switching between facets of the record when there is more than one.',
    'Tab per facet · ←/→',
    'Only present when the record has several facets. Otherwise the content area follows the header directly.',
    see(1),
  ),
  content: region(
    3,
    'Content area',
    'tabpanel or plain region',
    'Whatever best presents the facet: name–value pairs, a list, a table, an empty state …',
    'Depends on the content shown',
    'Fills the remaining height. Section-level actions sit at the top of the area.',
    see(0, 2),
  ),
};

// ---------------------------------------------------------------------------
// Level 1 · Page — where the surface sits in the shell

const PageWireframe = ({ variant }) => {
  const v3 = variant === 'v3';
  return (
    <Box
      border={{ color: 'border-weak' }}
      background={v3 ? 'background' : 'background-back'}
      round="small"
      overflow="hidden"
    >
      <Block
        showRole={false}
        region={PAGE.header}
        direction="row"
        align="center"
        round="none"
        border={{
          side: 'bottom',
          color: 'border',
          style: 'dashed',
          size: 'small',
        }}
        background="background-front"
      >
        <Box direction="row" gap="small" align="center" flex justify="end">
          <Ghost width="200px" height="28px" />
          <Ghost width="28px" height="28px" round="full" />
          <Ghost width="28px" height="28px" round="full" />
          <Ghost width="28px" height="28px" round="full" />
        </Box>
      </Block>

      <Box
        direction="row"
        gap={v3 ? 'xsmall' : 'none'}
        pad={v3 ? 'xsmall' : 'none'}
        align="stretch"
      >
        <Block
          showRole={false}
          region={PAGE.nav}
          width="220px"
          flex={false}
          background={v3 ? 'background-back' : 'background-front'}
          round={v3 ? 'large' : 'none'}
        >
          <Ghost width="60%" />
          <Ghost width="80%" height="28px" />
          <Ghost
            width="80%"
            height="28px"
            background="transparent"
            border={{ color: 'border-weak' }}
          />
          <Ghost
            width="80%"
            height="28px"
            background="transparent"
            border={{ color: 'border-weak' }}
          />
        </Block>

        <Block showRole={false} region={PAGE.main} flex round="none">
          <Block
            showRole={false}
            region={PAGE.pageHeader}
            direction="row"
            justify="between"
            align="center"
          >
            <Box gap="xsmall">
              <Ghost width="120px" height="24px" />
              <Ghost width="240px" />
            </Box>
            <Ghost width="110px" height="36px" round="full" />
          </Block>

          <Focus
            showRole={false}
            region={PAGE.surface}
            label="fills remaining width"
            round={v3 ? 'xsmall' : 'xlarge'}
            height={{ min: '260px' }}
          >
            <Box direction="row" gap="small" flex>
              <Dim label="List zone" width="34%" flex={false} />
              <Dim label="Detail zone" flex />
            </Box>
          </Focus>
        </Block>
      </Box>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Level 2 · Zones — list vs detail, and how much space each can take

const ZonesWireframe = ({ variant }) => {
  const v = ZONE_VARIANTS.find((o) => o.value === variant);
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
            label={v.listLabel}
            width={v.listWidth}
            flex={false}
          >
            <Dim label="List toolbar" height="72px" />
            <Dim label="List body" flex />
          </Focus>
          <Box border={{ side: 'left', color: 'border-weak' }} />
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

export const AnatomyPage = ({ chrome = true, onChromeChange }) => {
  const [shell, setShell] = useState('default');
  const [zone, setZone] = useState('fixed');
  const [level, setLevel] = useState(0);
  const [group, setGroup] = useState('structure');
  const [behaviour, setBehaviour] = useState(0);
  const go = (g, tab) => {
    setGroup(g);
    if (g === 'behaviour') setBehaviour(tab);
    else setLevel(tab);
    window.scrollTo({ top: 0 });
  };
  return (
    <AnatomyNav.Provider value={go}>
      <Page pad={{ bottom: 'xlarge' }}>
        <PageContent gap="medium">
          <PageHeader
            title="List–detail anatomy"
            subtitle="Zoom from the page down into each zone. Every level names its regions, their roles and what they own."
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
          <ToggleGroup
            options={[
              { label: 'Structure', value: 'structure' },
              { label: 'Behaviour', value: 'behaviour' },
            ]}
            value={group}
            onToggle={({ value }) => value && setGroup(value)}
          />
          {group === 'behaviour' && (
            <Tabs
              activeIndex={behaviour}
              onActive={setBehaviour}
              justify="start"
            >
              <Tab title="Scroll & height">
                <ScrollLevel />
              </Tab>
              <Tab title="Responsive">
                <ResponsiveLevel />
              </Tab>
              <Tab title="States">
                <StatesLevel />
              </Tab>
              <Tab title="Data & performance">
                <DataLevel />
              </Tab>
              <Tab title="Actions & ownership">
                <ActionsLevel />
              </Tab>
            </Tabs>
          )}
          {group === 'structure' && (
            <Tabs activeIndex={level} onActive={setLevel} justify="start">
              <Tab title="Page">
                <Level
                  title="Where the surface sits"
                  intro="Shell regions (1–3) are shared by every page. The page header carries the one collection-level action; the list–detail surface fills the rest of Main."
                  control={
                    <ToggleGroup
                      options={[
                        { label: 'Default shell', value: 'default' },
                        { label: 'Shell v3', value: 'v3' },
                      ]}
                      value={shell}
                      onToggle={({ value }) => value && setShell(value)}
                    />
                  }
                  wireframe={<PageWireframe variant={shell} />}
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
                      options={ZONE_VARIANTS.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
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
