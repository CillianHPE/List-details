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
  PopoverDot,
} from './primitives';
import { SURFACE, listWidthFor, tierFor } from '../../pattern/listDetail';

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
    note: 'Default (stand-up, 12 Nov). The page (Main) is the scroll container, so the surface can sit among other page content; the list column stretches to the surface height, is sticky and scrolls its own rows; the detail grows the page. Try Examples › Users · page context (#/v3-context).',
  },
  {
    value: 'panes',
    label: 'Panes scroll',
    note: 'Alternative for standalone, Outlook-style apps where the surface is the whole page. Main is locked to the viewport; the list body and the detail content each scroll independently under fixed headers.',
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
          : 'Column is sticky at top: 60px + 24px (global header + edgeSize.medium) so it stays put while the page scrolls. The column itself stretches to the detail height, so a short list never leaves the divider hanging mid-surface and the empty space below the rows still reads as the list zone.'
      }`,
      {
        why: 'Scanning the collection must never cost the user their place in the record, and vice versa; the list keeps its own scroll so switching records is one gesture, not a page round-trip.',
      },
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

// Lettered so they never clash with the numbered regions in the wireframe
const BREAKPOINTS = {
  wide: region(
    'A',
    'Comfortable',
    '≥ 1000px surface width',
    'Two columns, proportional 40 / 60 (list min 256px, size.small). Measured on the surface, not the viewport (see Shell configuration below).',
    'Navigation pane expanded',
    'Everything has room: labelled actions, a single row of tabs, name | value pairs side by side.',
  ),
  medium: region(
    'B',
    'Compact',
    '760 – 999px surface width',
    'Two columns, still 40 / 60: list 304–400px, detail 456–600px. The 256px (size.small) floor never binds above 640px.',
    'Navigation pane collapsed to icons',
    'Chrome gives way first: secondary actions fold into overflow, tabs scroll, the detail header may wrap.',
    {
      questions:
        'Proportional keeps the detail under 600px for the whole Compact range. Should Compact pin the list to its 256px (size.small) floor instead, giving the detail up to 720px?',
    },
  ),
  narrow: region(
    'C',
    'Drill-in',
    '< 760px surface width',
    'Stacked. Only one zone is visible: the list by default, the detail as a drill-in screen once a row is chosen.',
    'Navigation in a drawer behind the header menu button',
    'A Back link in the page header parent slot ("All users") returns to the list; record actions live in an overflow menu; pairs stack.',
    {
      questions:
        'Does selecting a row push a URL so Back in the browser also returns to the list?',
    },
  ),
};

// Each region's rule at every breakpoint; `role` summarises the arc. Listed
// below the wireframe as text — the wireframe itself only highlights the zones.
const RESPONSIVE = {
  nav: region(
    1,
    'Navigation pane',
    'expanded → icons → drawer',
    'Section switching at every width.',
    'Collapse toggle · menu button',
    'Collapses to icons under 1024px and moves behind the header menu button under 768px.',
    {
      at: {
        wide: 'Expanded, with labels.',
        medium: 'Icons only; labels on hover/focus.',
        narrow: 'Hidden in a drawer, opened from the header menu button.',
      },
    },
  ),
  surface: region(
    2,
    'List–detail surface',
    'two columns → stacked',
    'The arrangement of the two zones.',
    'Back link in page header (drill-in only)',
    'Grid columns [40% in px, flex] from 760px surface width. Below, only one zone is visible: the list by default, the detail after a row is chosen, with Back in the page header parent slot.',
    {
      at: {
        wide: 'Grid [40% in px, flex]; list 40% (400–576px at 1000–1440).',
        medium: 'Same grid; list 40% (304–400px), detail 60% (456–600px).',
        narrow: 'Single column; list screen, then detail screen on selection.',
      },
    },
  ),
  pageHeader: region(
    3,
    'Page header actions',
    'buttons → overflow',
    'Page-level controls only (act on the surface, not the data). Collection actions live in the list toolbar.',
    'Divider toggle (prototype control)',
    'Everything folds into one overflow menu as soon as the surface leaves Comfortable; Back takes the parent slot when drilled in.',
    {
      at: {
        wide: 'Labelled controls.',
        medium: 'Overflow menu.',
        narrow: 'Overflow menu beside the Back link.',
      },
    },
  ),
  detailHeader: region(
    4,
    'Detail header',
    'row → wraps',
    'Heading and record actions.',
    '—',
    'Trailing zone wraps beneath the leading zone when the heading would truncate below ~20 characters. Actions collapse to an overflow menu at narrow.',
    {
      at: {
        wide: 'One row: leading identity, trailing actions.',
        medium:
          'Trailing wraps beneath leading when the heading would truncate below ~20 characters.',
        narrow:
          'Actions collapse to an overflow menu. Back lives in the page header, not here.',
      },
    },
  ),
  tabs: region(
    5,
    'Detail tabs',
    'row → scrollable row',
    'Facet switching.',
    '←/→ scroll arrows',
    'Tabs never wrap to two lines; the tablist scrolls horizontally with arrows when it overflows (Grommet Tabs does this natively).',
    {
      questions:
        'Shorten labels at narrow widths (e.g. "Groups") or allow scrolling only?',
      at: {
        wide: 'Single row, all labels visible.',
        medium: 'Single row; scroll arrows appear when it overflows.',
        narrow: 'Scrollable row; never wraps to two lines.',
      },
    },
  ),
  pairs: region(
    6,
    'Name–value pairs',
    'horizontal → vertical',
    'Record attributes.',
    '—',
    'Pairs switch from two columns to stacked when the detail zone is under 480px, independent of the viewport.',
    {
      at: {
        wide: 'name | value in two columns.',
        medium:
          'Two columns until the detail zone is under 480px, then stacked.',
        narrow: 'Stacked: name above value.',
      },
    },
  ),
};

const Screen = ({ narrow, children, ...rest }) => (
  <Frame
    width={narrow ? '260px' : undefined}
    flex={narrow ? false : 'grow'}
    height="360px"
    pad={{ horizontal: 'small', top: 'xsmall', bottom: 'xsmall' }}
    gap="small"
    {...rest}
  >
    {children}
  </Frame>
);

// A highlighted zone inside the list–detail surface, labelled with the
// width it is given at the current breakpoint.
const Zone = ({ name, width, children, ...rest }) => (
  <Box
    border={{ color: 'brand', size: 'small' }}
    round="xsmall"
    pad="xsmall"
    gap="xsmall"
    background="background-front"
    overflow="hidden"
    {...rest}
  >
    <Box direction="row" justify="between" align="baseline" gap="xsmall">
      <Text size="small" weight={500}>
        {name}
      </Text>
      <Mono>{width}</Mono>
    </Box>
    {children}
  </Box>
);

const ListGhost = ({ rows = 5 }) => (
  <>
    <Ghost height="14px" />
    <GhostRows count={rows} />
  </>
);

const DetailGhost = ({ stacked }) => (
  <Box gap="xsmall" flex>
    <Box direction="row" gap="xsmall" align="center">
      <Ghost width="40%" height="10px" />
      <Box flex />
      <Ghost width="14px" height="10px" />
    </Box>
    <Box direction="row" gap="4xsmall">
      <Ghost width="20%" height="6px" background="brand" />
      <Ghost width="25%" height="6px" />
      <Ghost width="25%" height="6px" />
    </Box>
    <Box gap="4xsmall">
      {[0, 1, 2].map((i) =>
        stacked ? (
          <Box key={i} gap="4xsmall">
            <Ghost width="30%" height="6px" />
            <Ghost width="70%" height="6px" />
          </Box>
        ) : (
          <Box key={i} direction="row" gap="4xsmall">
            <Ghost width="30%" height="6px" />
            <Ghost width="50%" height="6px" />
          </Box>
        ),
      )}
    </Box>
  </Box>
);

// Shell chrome is dimmed context; only the list–detail surface is highlighted
// so the eye goes to how the two zones share the available width.
const ResponsiveFrame = ({ bp }) => {
  const narrow = bp === 'narrow';
  const medium = bp === 'medium';
  return (
    <Box direction="row" gap="medium" align="start" justify="center">
      <Screen narrow={narrow}>
        <Box direction="row" gap="xsmall" align="center">
          <Ghost width="20px" height="20px" round="full" />
          <Ghost width="60px" height="10px" />
          <Box flex />
          {narrow && <Ghost width="20px" height="20px" />}
        </Box>
        <Box direction="row" gap="small" flex>
          {!narrow && (
            <Dim label="Nav" width={medium ? '28px' : '72px'} flex={false} />
          )}
          <Box flex gap="small">
            <Dim label="Page header" pad="xsmall" />
            <Box
              direction="row"
              gap="xsmall"
              flex
              border={{ color: 'border', style: 'dashed' }}
              round="xsmall"
              pad="xsmall"
            >
              <Zone
                name="List"
                width={narrow ? '100%' : '40% · min 256px (size.small)'}
                style={{ width: narrow ? '100%' : '40%' }}
                flex={false}
              >
                <ListGhost rows={narrow ? 7 : 5} />
              </Zone>
              {!narrow && (
                <Zone name="Detail" width="flex" flex>
                  <DetailGhost />
                </Zone>
              )}
            </Box>
          </Box>
        </Box>
      </Screen>
      {narrow && (
        <Screen narrow>
          <Box direction="row" gap="xsmall" align="center">
            <Ghost width="20px" height="20px" round="full" />
            <Ghost width="60px" height="10px" />
          </Box>
          <Dim label="Page header · ← All users" pad="xsmall" />
          <Box
            flex
            border={{ color: 'border', style: 'dashed' }}
            round="xsmall"
            pad="xsmall"
          >
            <Zone name="Detail" width="100%" flex>
              <DetailGhost stacked />
            </Zone>
          </Box>
        </Screen>
      )}
    </Box>
  );
};

// Left-hand picker shared by the States and Responsive explorers
const Picker = ({ items, value, onChange }) => (
  <Box as="nav" gap="xxsmall" width={{ min: 'medium' }} flex={false}>
    {Object.entries(items).map(([key, r]) => {
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

const ResponsiveExplorer = () => {
  const [bp, setBp] = useState('wide');
  const r = BREAKPOINTS[bp];
  return (
    <Grid columns={['auto', 'flex']} gap="large">
      <Picker items={BREAKPOINTS} value={bp} onChange={setBp} />
      <Box gap="medium">
        <ResponsiveFrame bp={bp} />
        <Box gap="xsmall">
          <Badge region={r} />
          <Box margin={{ left: '32px' }}>
            <RegionDetails
              region={r}
              labels={{ owns: 'Layout', controls: 'Chrome', behaviour: 'Rule' }}
            />
          </Box>
        </Box>
        <Box gap="xsmall" margin={{ left: '32px' }}>
          <Text size="small" weight={500} color="text-weak">
            Per region at this width
          </Text>
          <Box as="dl" margin="none" gap="xsmall">
            {Object.values(RESPONSIVE).map((region) => (
              <Box key={region.id} direction="row" gap="small" align="start">
                <Box width="200px" flex={false}>
                  <Text size="small" weight={500}>
                    {region.name}
                  </Text>
                </Box>
                <Text size="small">{region.at[bp]}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

// ---------------------------------------------------------------------------
// Shell configuration — how much of the browser the list–detail surface
// actually receives once the V3.1 shell's panes are accounted for.
// Measurements taken from the "App shell configurations" section in Figma.

const SHELL = {
  header: 60,
  gutter: 12, // outer page gutter ≥1024
  gutterSmall: 6, // outer page gutter ≤768
  nav: 256, // expanded
  navRail: 48, // collapsed to an icon rail — measured in the Shell v3 prototype
  context: 425,
  gap: 12, // between panes
  mainPad: 24, // Main horizontal padding each side ≥1024
  mainPadSmall: 12, // ≤768
  overlayBelow: 1024, // panes float over the page at or under this width
  coexistFrom: 1536, // nav + context may be open together from here
};

// What the surface needs to stay two-column — shared with the Users prototype
// (src/pattern/listDetail.js) so documentation and implementation agree.

const BROWSER_WIDTHS = [1920, 1536, 1366, 1024, 768, 414];

const NAV_WIDTH = { expanded: SHELL.nav, collapsed: SHELL.navRail, hidden: 0 };

// nav: 'expanded' | 'collapsed' | 'hidden'
const shellLayout = (width, nav, context) => {
  const overlay = width < SHELL.overlayBelow;
  const gutter = overlay ? SHELL.gutterSmall : SHELL.gutter;
  const pad = overlay ? SHELL.mainPadSmall : SHELL.mainPad;
  const navPx = NAV_WIDTH[nav] || 0;
  const navTakes = navPx && !overlay ? navPx + SHELL.gap : 0;
  const ctxTakes = context && !overlay ? SHELL.context + SHELL.gap : 0;
  const main = width - gutter * 2 - navTakes - ctxTakes;
  const available = main - pad * 2;
  const tier = tierFor(available);
  const list = tier === 'drillIn' ? available : listWidthFor(available);
  const detail = tier === 'drillIn' ? 0 : available - list - SURFACE.gap;
  const conflict =
    nav === 'expanded' && context && !overlay && width < SHELL.coexistFrom;
  return {
    overlay,
    navPx,
    gutter,
    pad,
    navTakes,
    ctxTakes,
    main,
    available,
    tier,
    list,
    detail,
    conflict,
  };
};

const TIERS = {
  comfortable: {
    label: 'Comfortable · two columns',
    color: 'brand',
    rule: `≥ ${SURFACE.comfortableMin}px available. List ${SURFACE.listShare * 100}% (min ${SURFACE.listMin}px, size.small), detail ${(1 - SURFACE.listShare) * 100}%; name–value pairs stay side by side.`,
  },
  compact: {
    label: 'Compact · two columns',
    color: 'status-warning',
    rule: `${SURFACE.twoColumnMin}–${SURFACE.comfortableMin - 1}px available. Still ${SURFACE.listShare * 100} / ${(1 - SURFACE.listShare) * 100}; detail may drop under ${SURFACE.detailMin}px so pairs stack and tabs scroll.`,
  },
  drillIn: {
    label: 'Drill-in · one column',
    color: 'status-critical',
    rule: `< ${SURFACE.twoColumnMin}px available (${SURFACE.listMin} list + ${SURFACE.gap} gap + ${SURFACE.detailMin} detail). One zone at a time: list first, detail on selection with Back.`,
  },
};

// Proportional bar: every segment's width is its real px share of the browser
const Seg = ({ px, total, label, children, ...rest }) => (
  <Box
    style={{ width: `${(px / total) * 100}%` }}
    flex={false}
    justify="center"
    overflow="hidden"
    {...rest}
  >
    {label && (
      <Text size="xsmall" textAlign="center" truncate>
        {label}
      </Text>
    )}
    {children}
  </Box>
);

const ShellBar = ({ width, nav, context, layout: l }) => {
  const tierColor = TIERS[l.tier].color;
  const Pane = ({ px, label, on }) =>
    px > 0 ? (
      <Seg
        px={px - SHELL.gap}
        total={width}
        label={label}
        background="background-contrast"
        round="xsmall"
        height="64px"
        margin={{ horizontal: `${(SHELL.gap / 2 / width) * 100}%` }}
      />
    ) : on && l.overlay ? (
      <Box
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [label === 'Context' ? 'right' : 'left']: 0,
          width: `${(Math.min(label === 'Context' ? SHELL.context : SHELL.nav, width * 0.8) / width) * 100}%`,
          background: 'rgba(255,255,255,0.85)',
        }}
        border={{ color: 'border', style: 'dashed' }}
        round="xsmall"
        justify="center"
      >
        <Text size="xsmall" textAlign="center">
          {label} (overlay)
        </Text>
      </Box>
    ) : null;
  return (
    <Box gap="xsmall">
      <Box
        direction="row"
        align="center"
        border={{ color: 'border' }}
        round="xsmall"
        pad={{ vertical: 'xsmall' }}
        style={{ position: 'relative' }}
        overflow="hidden"
      >
        <Seg px={l.gutter} total={width} />
        <Pane
          px={l.navTakes}
          label={nav === 'collapsed' ? 'Rail' : 'Nav'}
          on={nav !== 'hidden'}
        />
        <Seg px={l.main} total={width}>
          <Box direction="row" align="stretch" height="64px">
            <Seg px={l.pad} total={l.main} />
            {l.tier === 'drillIn' ? (
              <Seg
                px={l.available}
                total={l.main}
                border={{ color: tierColor, size: 'small' }}
                round="xsmall"
                label={`List or Detail · ${l.available}px`}
              />
            ) : (
              <>
                <Seg
                  px={l.list}
                  total={l.main}
                  border={{ color: tierColor, size: 'small' }}
                  round="xsmall"
                  label={`List ${l.list}`}
                />
                <Seg px={SURFACE.gap} total={l.main} />
                <Seg
                  px={l.detail}
                  total={l.main}
                  border={{ color: tierColor, size: 'small' }}
                  round="xsmall"
                  label={`Detail ${l.detail}`}
                />
              </>
            )}
            <Seg px={l.pad} total={l.main} />
          </Box>
        </Seg>
        <Pane px={l.ctxTakes} label="Context" on={context} />
        <Seg px={l.gutter} total={width} />
      </Box>
      <Box direction="row" justify="between">
        <Mono color="text-weak">0</Mono>
        <Mono color="text-weak">{width}px browser</Mono>
      </Box>
    </Box>
  );
};

const Num = ({ label, value, note }) => (
  <Box>
    <Text size="xsmall" color="text-weak">
      {label}
    </Text>
    <Box direction="row" gap="xsmall" align="baseline">
      <Mono color="text">{value}</Mono>
      {note && (
        <Text size="xsmall" color="text-weak">
          {note}
        </Text>
      )}
    </Box>
  </Box>
);

const ShellConfigExplorer = () => {
  const [width, setWidth] = useState(1366);
  const [nav, setNav] = useState('expanded');
  const [context, setContext] = useState(false);
  const l = shellLayout(width, nav, context);
  const tier = TIERS[l.tier];
  return (
    <Box gap="medium">
      <Box direction="row" gap="large" wrap align="center">
        <Box gap="xsmall">
          <Text size="small" weight={500} color="text-weak">
            Browser width
          </Text>
          <ToggleGroup
            options={BROWSER_WIDTHS.map((w) => ({ label: `${w}`, value: w }))}
            value={width}
            onToggle={({ value }) => value && setWidth(value)}
          />
        </Box>
        <Box gap="xsmall">
          <Text size="small" weight={500} color="text-weak">
            Navigation
          </Text>
          <ToggleGroup
            options={[
              { label: `Expanded ${SHELL.nav}px`, value: 'expanded' },
              { label: `Collapsed ${SHELL.navRail}px`, value: 'collapsed' },
              { label: 'Hidden', value: 'hidden' },
            ]}
            value={nav}
            onToggle={({ value }) => value && setNav(value)}
          />
        </Box>
        <Box gap="xsmall">
          <Text size="small" weight={500} color="text-weak">
            Context pane
          </Text>
          <ToggleGroup
            options={[
              { label: `Open ${SHELL.context}px`, value: true },
              { label: 'Closed', value: false },
            ]}
            value={context}
            onToggle={({ value }) => value !== undefined && setContext(value)}
          />
        </Box>
      </Box>

      <ShellBar width={width} nav={nav} context={context} layout={l} />

      <Box direction="row" gap="large" wrap>
        <Num
          label="Main pane"
          value={`${l.main}px`}
          note={
            l.overlay
              ? `${width} − 2×${l.gutter} gutter (panes overlay)`
              : `${width} − 2×${l.gutter} gutter${l.navPx ? ` − ${l.navPx}+${SHELL.gap} nav` : ''}${context ? ` − ${SHELL.context}+${SHELL.gap} context` : ''}`
          }
        />
        <Num
          label="Available to surface"
          value={`${l.available}px`}
          note={`Main − 2×${l.pad} padding`}
        />
        <Num
          label="Needed for two columns"
          value={`${SURFACE.twoColumnMin}px`}
          note={`${SURFACE.listMin} + ${SURFACE.gap} + ${SURFACE.detailMin}`}
        />
      </Box>

      <Box gap="xsmall">
        <Box direction="row" gap="xsmall" align="center">
          <Tag color={tier.color}>{tier.label}</Tag>
        </Box>
        <Text size="small">{tier.rule}</Text>
      </Box>

      {l.conflict && (
        <Box
          background={{ color: 'status-critical', opacity: 'weak' }}
          pad="small"
          round="xsmall"
          gap="xxsmall"
        >
          <Text size="small" weight={500}>
            Shell rule · expanded nav and context pane are mutually exclusive
            under {SHELL.coexistFrom}px
          </Text>
          <Text size="small">
            With both open only {l.available}px is left. Opening the context
            pane should collapse the navigation to its {SHELL.navRail}px rail,
            leaving {shellLayout(width, 'collapsed', true).available}px (
            {TIERS[shellLayout(width, 'collapsed', true).tier].label
              .split(' ·')[0]
              .toLowerCase()}
            ); expanding the nav again closes the context pane. From{' '}
            {SHELL.coexistFrom}px both can stay open and the surface still gets
            ≥ {shellLayout(SHELL.coexistFrom, 'expanded', true).available}px.
          </Text>
        </Box>
      )}
      {l.overlay && (nav !== 'hidden' || context) && (
        <Text size="small" color="text-weak">
          Under {SHELL.overlayBelow}px the panes float over the page, so they
          take no width from the surface — the Figma set shows no inline panes
          at 768 or 414.
        </Text>
      )}
    </Box>
  );
};

// Every width × pane combination at a glance
const ShellMatrix = () => {
  const combos = [
    ['Nav expanded', 'expanded', false],
    ['Nav collapsed', 'collapsed', false],
    ['Rail + context', 'collapsed', true],
    ['Nav + context', 'expanded', true],
  ];
  const cell = { padding: '6px 16px 6px 0', textAlign: 'left' };
  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={cell}>
            <Text size="xsmall" color="text-weak" weight={400}>
              Browser
            </Text>
          </th>
          {combos.map(([name]) => (
            <th key={name} style={cell}>
              <Text size="xsmall" color="text-weak" weight={400}>
                {name}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {BROWSER_WIDTHS.map((w) => (
          <tr key={w}>
            <td style={cell}>
              <Mono color="text">{w}</Mono>
            </td>
            {combos.map(([name, nav, context]) => {
              const l = shellLayout(w, nav, context);
              return (
                <td key={name} style={cell}>
                  <Box direction="row" gap="xsmall" align="center">
                    <Box
                      width="8px"
                      height="8px"
                      round="full"
                      background={TIERS[l.tier].color}
                      flex={false}
                    />
                    <Mono color="text">{l.available}</Mono>
                    {l.conflict && (
                      <Text size="xsmall" color="status-critical">
                        ✕
                      </Text>
                    )}
                  </Box>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const ResponsiveLevel = () => (
  <Level
    title="Responsive behaviour"
    intro="Pick a width to see how the shell, the surface and the detail zone re-flow. The summary states the rule for that width; the list below gives each region's rule at that width."
  >
    <ResponsiveExplorer />
    <Box gap="small" margin={{ top: 'large' }}>
      <Text size="large" weight={500}>
        Shell configuration
      </Text>
      <Text size="small" color="text-weak">
        The breakpoints above assume the surface owns the viewport. In the V3.1
        shell the navigation ({SHELL.nav}px expanded, {SHELL.navRail}px
        collapsed to a rail) and the context pane ({SHELL.context}px) take width
        first, so the surface should respond to its own container width, not the
        browser's. Toggle panes to see what is left and which tier the surface
        lands in.
      </Text>
      <ShellConfigExplorer />
      <Box gap="xsmall" margin={{ top: 'small' }}>
        <Text size="small" weight={500} color="text-weak">
          All configurations · px available to the surface (✕ = expanded nav
          with context pane under {SHELL.coexistFrom}px, disallowed)
        </Text>
        <ShellMatrix />
      </Box>
    </Box>
  </Level>
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

const StatesExplorer = () => {
  const [state, setState] = useState('loading');
  const r = STATES[state];
  return (
    <Grid columns={['auto', 'flex']} gap="large">
      <Picker items={STATES} value={state} onChange={setState} />
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
    'list toolbar · trailing, beside search',
    'Actions that create or change items in the set the toolbar controls: Add users, import, bulk select.',
    'One secondary button · overflow for the rest · icon-only below Comfortable',
    'Sits with search, filter and sort because they all shape the same collection. Always visible regardless of selection; never acts on the selected record. Distinct from page-level controls in the page header (Back, page settings, help, export of the whole view), which act on the surface rather than its data.',
    {
      why: "Users expect a control to sit beside the thing it affects. Keeping add/import with the list's own search and filters makes their scope obvious and keeps the page header free of data actions.",
    },
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
    {
      why: "Actions on a record are only meaningful once the user knows which record is in focus. Placing them beside the record's identity makes the target unambiguous and reduces mis-applied actions.",
    },
  ),
  section: region(
    3,
    'Section actions',
    'content area · top trailing',
    'Actions that add to the facet being viewed: Assign roles, Add to user groups.',
    'One secondary button per section',
    'Scoped to the visible tab. Opens a layer; on success the list in the section updates in place.',
    {
      why: "A facet's list has its own additions (assign a role, join a group). Keeping that action with the facet makes it clear what is being added to, and avoids a crowded record-level menu.",
    },
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
    {
      why: 'Removing or inspecting one membership is a decision about that row alone. Inline placement makes the target self-evident and keeps the main list reserved for selection.',
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
    title="Actions and ownership"
    intro="Every action lives in exactly one scope, and each scope has one home on the page. Colour marks the scope; the legend gives the rules."
    wireframe={<ActionsWireframe />}
    regions={ACTIONS}
  />
);
