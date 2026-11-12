import { useState } from 'react';
import {
  Box,
  CheckBox,
  Heading,
  Page,
  PageContent,
  PageHeader,
  Paragraph,
  Tab,
  Tabs,
  Text,
  ToggleGroup,
} from 'grommet';

// Lo-fi anatomy of the list–detail page, explored at four zoom levels:
//   Page   · where the list–detail surface sits inside the app shell
//   Zones  · the two zones, what they are and the space they can occupy
//   List   · inside the list zone (toolbar + list body)
//   Detail · inside the detail zone (header + tabs + body)
// Each level has a wireframe and a legend of its regions (role / owns /
// controls / behaviour).

const region = (id, name, role, owns, controls, behaviour, extra = {}) => ({
  id,
  name,
  role,
  owns,
  controls,
  behaviour,
  ...extra,
});

const PAGE = {
  header: region(
    1,
    'Global header',
    '<header> · banner',
    'Product identity, workspace switcher, global search, help, notifications, account.',
    'Menu toggle · search · icon buttons · account drop',
    'Persistent across every page. Never scrolls away.',
  ),
  nav: region(
    2,
    'Navigation pane',
    '<nav aria-label="Primary"> · navigation',
    'Section switching. The current page is marked with aria-current="page".',
    'Collapse toggle · nav items',
    'Sticky. Collapses to icons on narrow viewports or on demand.',
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
    'Scrolls with content. Back link appears only in stacked mode.',
  ),
  surface: region(
    5,
    'List–detail surface',
    'Grid · 2 columns',
    'The pattern itself: a selection surface (list) beside an inspection surface (detail).',
    'Divider between zones (optional)',
    'Fills the remaining width of Main. Stacks into a drill-in below the medium breakpoint.',
  ),
};

const ZONES = {
  list: region(
    1,
    'List zone',
    '<section> · selection surface',
    'Finding and selecting one record from the collection.',
    'List toolbar · list body',
    'Fixed-width column. Sticks to the viewport and scrolls its rows independently.',
    { space: 'min 192px · max 384px (medium → large tokens)' },
  ),
  detail: region(
    2,
    'Detail zone',
    '<section> · inspection surface',
    'Everything about the selected record, and the actions that apply to it.',
    'Detail header · tabs · body',
    'Flexible column. Takes whatever width the list zone leaves. Scrolls with the page.',
    { space: 'flex · remaining width (≈ 732px at 1116px content width)' },
  ),
};

const ZONE_VARIANTS = [
  {
    value: 'fixed',
    label: 'Fixed list',
    listWidth: '34%',
    listLabel: '192–384px',
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
    'Sticky above the rows. Filters apply instantly and update the count.',
  ),
  rows: region(
    2,
    'List body',
    '<ul role="listbox"> · option rows',
    'Presenting the collection and holding the current selection.',
    'Rows (avatar, name, role) · ↑/↓ · Enter',
    'Scrolls independently of the page. Selected row is highlighted and announced; first row selected by default.',
  ),
  row: region(
    3,
    'Row',
    'role="option" · aria-selected',
    'One record, summarised to what is needed to choose it.',
    'Click / Enter to select',
    'Primary text + one line of secondary text. No per-row actions — those live in the detail zone.',
  ),
};

const DETAIL = {
  header: region(
    1,
    'Detail header',
    'header row · leading + trailing',
    'Identity of the selected record and the actions that apply to it.',
    'Leading zone · trailing zone',
    'Updates when the selection changes. Mirrors the page header: one row, identity on the left, actions on the right.',
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
    'Right-aligned and fixed to content width. Wraps beneath the leading zone on narrow widths.',
  ),
  tabs: region(
    2,
    'Detail tabs',
    'tablist · tab · tabpanel (optional)',
    'Switching between facets of the record when there is more than one.',
    'Tab per facet · ←/→',
    'Only present when the record has several facets. Otherwise the content area follows the header directly.',
  ),
  content: region(
    3,
    'Content area',
    'tabpanel or plain region',
    'Whatever best presents the facet: name–value pairs, a list, a table, an empty state …',
    'Depends on the content shown',
    'Fills the remaining height and scrolls with the page. Section-level actions sit at the top of the area.',
  ),
};

const Badge = ({ region: r, size = 'medium' }) => (
  <Box direction="row" gap="xsmall" align="center" wrap>
    <Box
      background="text-strong"
      round="full"
      width={{ min: '24px' }}
      height="24px"
      pad={{ horizontal: '4xsmall' }}
      align="center"
      justify="center"
      flex={false}
    >
      <Text size="xsmall" weight={700} color="#ffffff">
        {r.id}
      </Text>
    </Box>
    <Text weight={500} size={size}>
      {r.name}
    </Text>
    <Text size="small" color="text-weak" style={{ fontFamily: 'monospace' }}>
      {r.role}
    </Text>
  </Box>
);

// Dashed, unfilled wireframe block
const Block = ({ region: r, children, ...rest }) => (
  <Box
    border={{ color: 'border', style: 'dashed', size: 'small' }}
    round="xsmall"
    pad="small"
    gap="small"
    {...rest}
  >
    <Badge region={r} />
    {children}
  </Box>
);

// Solid, emphasised block used for the regions a level is focused on
const Focus = ({ region: r, label, children, ...rest }) => (
  <Box
    border={{ color: 'brand', size: 'small' }}
    round="xsmall"
    pad="small"
    gap="small"
    background="background-front"
    {...rest}
  >
    <Box direction="row" justify="between" align="start" gap="small" wrap>
      <Badge region={r} />
      {label && (
        <Text
          size="small"
          color="brand"
          weight={500}
          style={{ fontFamily: 'monospace' }}
        >
          {label}
        </Text>
      )}
    </Box>
    {children}
  </Box>
);

const Ghost = ({ width = '100%', height = '12px', ...rest }) => (
  <Box
    background="background-contrast"
    round="xsmall"
    width={width}
    height={height}
    flex={false}
    {...rest}
  />
);

// De-emphasised placeholder for regions outside the current zoom level
const Dim = ({ label, ...rest }) => (
  <Box
    border={{ color: 'border-weak', style: 'dashed' }}
    round="xsmall"
    pad="small"
    align="center"
    justify="center"
    {...rest}
  >
    <Text size="small" color="text-weak">
      {label}
    </Text>
  </Box>
);

const GhostRows = ({ count = 5, selected = 0 }) =>
  Array.from({ length: count }, (_, i) => (
    <Box
      key={i}
      direction="row"
      gap="small"
      align="center"
      pad="xsmall"
      background={i === selected ? 'background-contrast' : undefined}
    >
      <Ghost width="32px" height="32px" round="full" />
      <Box gap="xxsmall" flex>
        <Ghost width="70%" />
        <Ghost width="50%" height="8px" />
      </Box>
    </Box>
  ));

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

        <Block region={PAGE.main} flex round="none">
          <Block
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
      <Focus region={LIST.toolbar} label="sticky">
        <Ghost height="36px" background="transparent" border />
        <Box direction="row" gap="xsmall">
          <Ghost width="40px" height="24px" round="full" background="brand" />
          <Ghost width="56px" height="24px" round="full" />
          <Ghost width="60px" height="24px" round="full" />
        </Box>
        <Ghost width="60px" height="8px" />
      </Focus>
      <Focus region={LIST.rows} label="scrolls independently" flex>
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
      <Focus region={DETAIL.header} label="updates on selection">
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

const Legend = ({ regions }) => (
  <Box as="dl" margin="none">
    {Object.values(regions).map((r, i, arr) => (
      <Box
        key={r.id}
        pad={{ vertical: 'medium' }}
        border={
          i < arr.length - 1 ? { side: 'bottom', color: 'border-weak' } : false
        }
        gap="xsmall"
      >
        <Box as="dt">
          <Badge region={r} />
        </Box>
        <Box as="dd" margin={{ left: '32px' }} gap="xxsmall">
          {r.space && (
            <Text>
              <Text weight={500}>Space · </Text>
              {r.space}
            </Text>
          )}
          <Text>
            <Text weight={500}>Owns · </Text>
            {r.owns}
          </Text>
          <Text>
            <Text weight={500}>Controls · </Text>
            {r.controls}
          </Text>
          <Text color="text-weak">
            <Text weight={500}>Behaviour · </Text>
            {r.behaviour}
          </Text>
        </Box>
      </Box>
    ))}
  </Box>
);

const Level = ({ title, intro, control, wireframe, regions }) => (
  <Box gap="medium" pad={{ top: 'medium' }}>
    <Box direction="row" justify="between" align="start" gap="medium" wrap>
      <Box gap="xsmall" width={{ max: 'large' }}>
        <Heading level={2} margin="none">
          {title}
        </Heading>
        <Paragraph margin="none" fill>
          {intro}
        </Paragraph>
      </Box>
      {control}
    </Box>
    {wireframe}
    <Legend regions={regions} />
  </Box>
);

export const AnatomyPage = ({ chrome = true, onChromeChange }) => {
  const [shell, setShell] = useState('default');
  const [zone, setZone] = useState('fixed');
  const [level, setLevel] = useState(0);
  return (
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
            />
          </Tab>
          <Tab title="List zone">
            <Level
              title="Inside the list zone"
              intro="A sticky toolbar narrows the collection; the body below scrolls on its own and holds exactly one selection."
              wireframe={<ListWireframe />}
              regions={LIST}
            />
          </Tab>
          <Tab title="Detail zone">
            <Level
              title="Inside the detail zone"
              intro="The header mirrors the page header — heading on the left, record actions on the right. Tabs appear only when the record has several facets. Below is a single content area that takes whatever fits: pairs, a list, a table."
              wireframe={<DetailWireframe />}
              regions={DETAIL}
            />
          </Tab>
        </Tabs>
      </PageContent>
    </Page>
  );
};
