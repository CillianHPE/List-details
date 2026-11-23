import { useState } from 'react';
import { Box, Grid, Text, ToggleGroup } from 'grommet';
import {
  region,
  Badge,
  Ghost,
  Dim,
  GhostRows,
  Level,
  RegionDetails,
  Mono,
  Tag,
  Frame,
  Picker,
} from './primitives';
import { SURFACE, listWidthFor, tierFor } from '../../pattern/listDetail';

// Responsive pages: how the list–detail surface re-flows by width.
//   Breakpoints · the three tiers and how the zones share width
//   Regions     · what each part does at each tier
//   Drill-in    · one zone at a time on narrow surfaces
//   Shell       · what the V3.1 shell leaves for the surface

// ---------------------------------------------------------------------------
// Responsive

// Lettered so they never clash with the numbered regions in the wireframe
const BREAKPOINTS = {
  wide: region(
    'A',
    'Comfortable',
    '≥ 1000px surface width',
    '2 columns, proportional 40 / 60 (list min 256px, size.small). Measured on the surface, not the viewport.',
    'Navigation pane expanded',
    'Everything has room: labelled actions, a single row of tabs, name | value pairs side by side.',
  ),
  medium: region(
    'B',
    'Compact',
    '784 – 999px surface width',
    '2 columns, still 40 / 60: list 314–400px, detail 422–551px after the 48px (size.xlarge) gap. The 256px (size.small) floor never binds above 640px.',
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
    '< 784px surface width',
    'Stacked. Only 1 zone is visible: the detail if a record is already selected (matching the wide view), otherwise the list; selecting drills in.',
    'Navigation rail; opens as an overlay',
    'A Back link in the page header parent slot ("All <collection>") returns to the list; record actions live in an overflow menu; pairs stack.',
    {
      questions:
        'Does selecting an item push a URL so Back in the browser also returns to the list?',
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
    'Rail under 1080px (medium), or under 1440px (xlarge) while the context pane is open; opens as an overlay under 768px (small).',
    {
      at: {
        wide: 'Expanded, with labels. Drops to the rail if the context pane opens under 1440px.',
        medium: 'Icon rail; the toggle expands it and pushes content.',
        narrow:
          'Icon rail; the toggle opens it over the page and it closes on selection.',
      },
    },
  ),
  surface: region(
    2,
    'List–detail surface',
    '2 columns → stacked',
    'The arrangement of the 2 zones.',
    'Back link in page header (drill-in only)',
    'Grid columns [40% in px, flex] from 784px surface width. Below, only 1 zone is visible: the list by default, the detail after an item is chosen, with Back in the page header parent slot.',
    {
      at: {
        wide: 'Grid [40% in px, flex]; list 40% (400–576px at 1000–1440).',
        medium: 'Same grid; list 40% (314–400px), detail 60% (422–551px).',
        narrow:
          'Single column; lands on the selected record with Back, or the list if nothing is selected.',
      },
    },
  ),
  pageHeader: region(
    3,
    'Page header actions',
    'buttons → overflow',
    'Page-level controls only (act on the surface, not the data). Collection actions live in the list toolbar.',
    'Prototype options (prototype control)',
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
    3,
    'Detail header',
    'row → wraps',
    'Heading and record actions.',
    '—',
    'Trailing zone wraps beneath the leading zone when the heading would truncate below ~20 characters. Actions collapse to an overflow menu at narrow.',
    {
      at: {
        wide: '1 row: leading identity, trailing actions.',
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
    'Tabs never wrap to 2 lines; the tablist scrolls horizontally with arrows when it overflows (Grommet Tabs does this natively).',
    {
      questions: 'Shorten labels at narrow widths or allow scrolling only?',
      at: {
        wide: 'Single row, all labels visible.',
        medium: 'Single row; scroll arrows appear when it overflows.',
        narrow: 'Scrollable row; never wraps to 2 lines.',
      },
    },
  ),
  pairs: region(
    6,
    'Name–value pairs',
    'horizontal → vertical',
    'Record attributes.',
    '—',
    'Pairs switch from 2 columns to stacked when the detail zone is under 480px, independent of the viewport.',
    {
      at: {
        wide: 'name | value in 2 columns.',
        medium: '2 columns until the detail zone is under 480px, then stacked.',
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
    <Box
      direction="row"
      gap="medium"
      align="start"
      justify="center"
      data-doc="figure"
    >
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
          <Dim label="Page header · ← All items" pad="xsmall" />
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

// ---------------------------------------------------------------------------
// Shell configuration — how much of the browser the list–detail surface
// actually receives once the V3.1 shell's panes are accounted for.
// Measurements taken from the "App shell configurations" section in Figma.

const SHELL = {
  header: 60,
  gutter: 12, // outer page gutter
  gutterSmall: 6, // outer page gutter under 768px
  nav: 256, // expanded
  navRail: 48, // collapsed to an icon rail — measured in the Shell v3 prototype
  context: 425,
  gap: 12, // between panes
  mainPad: 48, // PageContent horizontal padding each side, edgeSize.xlarge
  mainPadSmall: 24, // under 768px the theme remaps xlarge to 24
  // Ladder, on the theme breakpoints (grommet-theme-hpe): nav gives way
  // first, then the context pane, then the surface itself.
  overlayBelow: 768, // small: nav and context pane float over the page
  railBelow: 1080, // medium: nav starts as an icon rail
  coexistFrom: 1440, // xlarge: nav may stay expanded beside the context pane
};

// What the surface needs to stay two-column — shared with the prototype
// (src/pattern/listDetail.js) so documentation and implementation agree.

const NAV_WIDTH = { expanded: SHELL.nav, collapsed: SHELL.navRail, hidden: 0 };

// nav: 'expanded' | 'collapsed' | 'hidden'
const shellLayout = (width, requestedNav, context) => {
  const overlay = width < SHELL.overlayBelow;
  const gutter = overlay ? SHELL.gutterSmall : SHELL.gutter;
  const pad = overlay ? SHELL.mainPadSmall : SHELL.mainPad;
  // The shell collapses an expanded nav to its rail under railBelow, or when
  // the context pane is open under coexistFrom.
  const autoRail =
    requestedNav === 'expanded' &&
    (width < SHELL.railBelow || (context && width < SHELL.coexistFrom));
  const nav = autoRail ? 'collapsed' : requestedNav;
  const navPx = NAV_WIDTH[nav] || 0;
  // In overlay the rail keeps its slot; the open pane floats over the page.
  const navTakes = navPx ? (overlay ? SHELL.navRail : navPx) + SHELL.gap : 0;
  const ctxTakes = context && !overlay ? SHELL.context + SHELL.gap : 0;
  const main = width - gutter * 2 - navTakes - ctxTakes;
  const available = main - pad * 2;
  const tier = tierFor(available);
  const list = tier === 'drillIn' ? available : listWidthFor(available);
  const detail = tier === 'drillIn' ? 0 : available - list - SURFACE.gap;
  const conflict = autoRail;
  return {
    overlay,
    nav,
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
    label: 'Comfortable · 2 columns',
    color: 'brand',
    rule: `≥ ${SURFACE.comfortableMin}px available. List ${SURFACE.listShare * 100}% (min ${SURFACE.listMin}px, size.small), detail ${(1 - SURFACE.listShare) * 100}%; name–value pairs stay side by side.`,
  },
  compact: {
    label: 'Compact · 2 columns',
    color: 'status-warning',
    rule: `${SURFACE.twoColumnMin}–${SURFACE.comfortableMin - 1}px available. Still ${SURFACE.listShare * 100} / ${(1 - SURFACE.listShare) * 100}; detail may drop under ${SURFACE.detailMin}px so pairs stack and tabs scroll.`,
  },
  drillIn: {
    label: 'Drill-in · 1 column',
    color: 'status-critical',
    rule: `< ${SURFACE.twoColumnMin}px available (${SURFACE.listMin} list + ${SURFACE.gap} gap + ${SURFACE.detailMin} detail). 1 zone at a time: list first, detail on selection with Back.`,
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

const ShellBar = ({ width, nav, context, layout: l, axis = true }) => {
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
      {axis && (
        <Box direction="row" justify="between">
          <Mono color="text-weak">0</Mono>
          <Mono color="text-weak">{width}px browser</Mono>
        </Box>
      )}
    </Box>
  );
};

// The configurations that actually occur, one glanceable section each.
// Static by design: this page is destined for Confluence, where there are
// no toggles.
const SHELL_CONFIGS = [
  {
    title: 'Large desktop · 1920px · nav + context pane',
    width: 1920,
    nav: 'expanded',
    context: true,
  },
  { title: 'Laptop · 1366px · nav expanded', width: 1366, nav: 'expanded' },
  {
    title: 'Laptop · 1366px · rail + context pane',
    note: `Opening the context pane under ${SHELL.coexistFrom}px (xlarge) collapses the nav to its rail automatically.`,
    width: 1366,
    nav: 'expanded',
    context: true,
  },
  {
    title: 'Small laptop · 1024px · rail',
    note: `Under ${SHELL.railBelow}px (medium) the nav starts as a rail, giving the surface ${shellLayout(1024, 'expanded', false).available}px.`,
    width: 1024,
    nav: 'expanded',
  },
  {
    title: 'Tablet · 700px · panes overlay',
    note: `Under ${SHELL.overlayBelow}px (small) nav and context pane float over the page and take no width; the surface drills in and lands on the selected record.`,
    width: 700,
    nav: 'expanded',
  },
];

const ShellConfigSections = () => (
  <Box gap="xlarge">
    {SHELL_CONFIGS.map((c) => {
      const l = shellLayout(c.width, c.nav, !!c.context);
      const tier = TIERS[l.tier];
      return (
        <Box
          key={c.title}
          border={{ color: 'border' }}
          round="small"
          pad="medium"
          gap="medium"
        >
          <Box
            direction="row"
            justify="between"
            align="center"
            wrap
            gap="small"
          >
            <Text size="large" weight={500}>
              {c.title}
            </Text>
            <Box direction="row" gap="small" align="center">
              <Text size="small" color="text-weak">
                Surface gets <Mono color="text">{l.available}px</Mono>
              </Text>
              <Tag color={tier.color}>{tier.label}</Tag>
            </Box>
          </Box>
          <Box data-doc="figure">
            <ShellBar
              width={c.width}
              nav={c.nav}
              context={!!c.context}
              layout={l}
              axis={false}
            />
          </Box>
          {c.note && (
            <Text size="small" color="text-weak">
              {c.note}
            </Text>
          )}
        </Box>
      );
    })}
  </Box>
);

// ---------------------------------------------------------------------------
// Breakpoints page

// Proportional bar showing how a given surface width is split between the
// two zones, coloured by tier. Complements the explorer above with numbers.
const WidthBar = ({ width }) => {
  const tier = tierFor(width);
  const color = TIERS[tier].color;
  const list = tier === 'drillIn' ? width : listWidthFor(width);
  const detail = tier === 'drillIn' ? 0 : width - list - SURFACE.gap;
  const pct = (px) => `${(px / 1440) * 100}%`;
  return (
    <Box direction="row" gap="small" align="center">
      <Box width="120px" flex={false}>
        <Mono color="text">{width}px</Mono>
      </Box>
      <Box flex direction="row" align="center">
        <Box
          direction="row"
          style={{ width: pct(width) }}
          flex={false}
          height="28px"
        >
          {tier === 'drillIn' ? (
            <Box
              flex
              border={{ color, size: 'small' }}
              round="xsmall"
              justify="center"
              align="center"
            >
              <Text size="xsmall">List or detail</Text>
            </Box>
          ) : (
            <>
              <Box
                style={{ width: `${(list / width) * 100}%` }}
                flex={false}
                border={{ color, size: 'small' }}
                round="xsmall"
                justify="center"
                align="center"
                overflow="hidden"
              >
                <Text size="xsmall" truncate>
                  List {list}
                </Text>
              </Box>
              <Box
                style={{ width: `${(SURFACE.gap / width) * 100}%` }}
                flex={false}
              />
              <Box
                flex
                border={{ color, size: 'small' }}
                round="xsmall"
                justify="center"
                align="center"
                overflow="hidden"
              >
                <Text size="xsmall" truncate>
                  Detail {detail}
                </Text>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Box width="150px" flex={false}>
        <Text size="xsmall" color={color}>
          {TIERS[tier].label.split(' ·')[0]}
        </Text>
      </Box>
    </Box>
  );
};

const WidthShare = () => (
  <Box gap="xsmall">
    <Text size="large" weight={500}>
      How the zones share width
    </Text>
    <Text size="small" color="text-weak">
      The list takes {SURFACE.listShare * 100}% of the surface, never less than{' '}
      {SURFACE.listMin}px (size.small); the detail takes the rest after a{' '}
      {SURFACE.gap}px (size.xlarge) gap. Under {SURFACE.twoColumnMin}px the 2 no
      longer fit side by side.
    </Text>
    <Box gap="xsmall" margin={{ top: 'small' }} data-doc="figure">
      {[1440, 1200, 1000, 900, 784, 600].map((w) => (
        <WidthBar key={w} width={w} />
      ))}
    </Box>
  </Box>
);

const BreakpointsExplorer = () => {
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
      </Box>
    </Grid>
  );
};

export const BreakpointsLevel = () => (
  <Level intro="3 tiers, measured on the surface's own width rather than the browser's. Pick one to see how the 2 zones share the space and what the shell does around them.">
    <BreakpointsExplorer />
    <Box margin={{ top: 'large' }}>
      <WidthShare />
    </Box>
  </Level>
);

// ---------------------------------------------------------------------------
// Regions page — region × tier matrix with a mini lo-fi in every cell

const Cell = ({ children }) => (
  <Box
    border={{ color: 'border', style: 'dashed', size: 'small' }}
    round="xsmall"
    pad="xsmall"
    height="56px"
    justify="center"
    gap="4xsmall"
    background="background-front"
  >
    {children}
  </Box>
);

const Btn = ({ width = '28px', ...rest }) => (
  <Ghost width={width} height="12px" round="xsmall" {...rest} />
);
const Dots = () => (
  <Box direction="row" gap="2px" align="center" pad={{ horizontal: '4px' }}>
    {[0, 1, 2].map((i) => (
      <Box key={i} width="3px" height="3px" round="full" background="text" />
    ))}
  </Box>
);

// Each renderer draws the region at one tier (wide | medium | narrow)
const MINIS = {
  nav: {
    wide: (
      <Box direction="row" gap="xsmall">
        <Box width="40%" gap="2px">
          {[0, 1, 2].map((i) => (
            <Ghost
              key={i}
              height="6px"
              background={i === 0 ? 'brand' : undefined}
            />
          ))}
        </Box>
        <Box flex border={{ color: 'border-weak' }} round="xsmall" />
      </Box>
    ),
    medium: (
      <Box direction="row" gap="xsmall">
        <Box width="10px" gap="2px">
          {[0, 1, 2].map((i) => (
            <Ghost
              key={i}
              height="6px"
              width="10px"
              background={i === 0 ? 'brand' : undefined}
            />
          ))}
        </Box>
        <Box flex border={{ color: 'border-weak' }} round="xsmall" />
      </Box>
    ),
    narrow: (
      <Box direction="row" gap="xsmall" align="start">
        <Box gap="2px" pad={{ top: '2px' }}>
          {[0, 1, 2].map((i) => (
            <Ghost key={i} height="2px" width="10px" background="brand" />
          ))}
        </Box>
        <Box
          flex
          border={{ color: 'border-weak' }}
          round="xsmall"
          height="26px"
        />
      </Box>
    ),
  },
  surface: {
    wide: (
      <Box direction="row" gap="xsmall" height="30px">
        <Box
          width="40%"
          border={{ color: 'brand', size: 'small' }}
          round="xsmall"
        />
        <Box flex border={{ color: 'brand', size: 'small' }} round="xsmall" />
      </Box>
    ),
    medium: (
      <Box direction="row" gap="xsmall" height="30px" width="70%">
        <Box
          width="40%"
          border={{ color: 'brand', size: 'small' }}
          round="xsmall"
        />
        <Box flex border={{ color: 'brand', size: 'small' }} round="xsmall" />
      </Box>
    ),
    narrow: (
      <Box direction="row" gap="xsmall" height="30px" align="center">
        <Box
          width="30%"
          border={{ color: 'brand', size: 'small' }}
          round="xsmall"
          fill="vertical"
        />
        <Text size="xsmall">→</Text>
        <Box
          width="30%"
          border={{ color: 'brand', size: 'small' }}
          round="xsmall"
          fill="vertical"
        />
      </Box>
    ),
  },
  pageHeader: {
    wide: (
      <Box direction="row" justify="between" align="center">
        <Ghost width="40%" height="10px" />
        <Box direction="row" gap="4px">
          <Btn />
          <Btn />
        </Box>
      </Box>
    ),
    medium: (
      <Box direction="row" justify="between" align="center">
        <Ghost width="40%" height="10px" />
        <Dots />
      </Box>
    ),
    narrow: (
      <Box direction="row" justify="between" align="center">
        <Box direction="row" gap="4px" align="center">
          <Text size="xsmall">←</Text>
          <Ghost width="40px" height="8px" />
        </Box>
        <Dots />
      </Box>
    ),
  },
  detailHeader: {
    wide: (
      <Box direction="row" justify="between" align="center">
        <Ghost width="45%" height="10px" />
        <Box direction="row" gap="4px">
          <Btn background="brand" />
          <Dots />
        </Box>
      </Box>
    ),
    medium: (
      <Box gap="4px">
        <Ghost width="80%" height="10px" />
        <Box direction="row" gap="4px">
          <Btn background="brand" />
          <Dots />
        </Box>
      </Box>
    ),
    narrow: (
      <Box direction="row" justify="between" align="center">
        <Ghost width="70%" height="10px" />
        <Dots />
      </Box>
    ),
  },
  tabs: {
    wide: (
      <Box direction="row" gap="6px">
        <Ghost width="20%" height="6px" background="brand" />
        <Ghost width="20%" height="6px" />
        <Ghost width="20%" height="6px" />
        <Ghost width="20%" height="6px" />
      </Box>
    ),
    medium: (
      <Box direction="row" gap="4px" align="center">
        <Text size="xsmall">‹</Text>
        <Box direction="row" gap="6px" flex overflow="hidden">
          <Ghost width="30%" height="6px" background="brand" />
          <Ghost width="30%" height="6px" />
          <Ghost width="30%" height="6px" />
          <Ghost width="30%" height="6px" />
        </Box>
        <Text size="xsmall">›</Text>
      </Box>
    ),
    narrow: (
      <Box direction="row" gap="6px" overflow="hidden">
        <Ghost width="45%" height="6px" background="brand" />
        <Ghost width="45%" height="6px" />
        <Ghost width="45%" height="6px" />
      </Box>
    ),
  },
  pairs: {
    wide: (
      <Box gap="4px">
        {[0, 1].map((i) => (
          <Box key={i} direction="row" gap="6px">
            <Ghost width="30%" height="6px" />
            <Ghost width="50%" height="6px" />
          </Box>
        ))}
      </Box>
    ),
    medium: (
      <Box gap="4px">
        {[0, 1].map((i) => (
          <Box key={i} direction="row" gap="6px">
            <Ghost width="35%" height="6px" />
            <Ghost width="45%" height="6px" />
          </Box>
        ))}
      </Box>
    ),
    narrow: (
      <Box gap="4px">
        <Ghost width="30%" height="6px" />
        <Ghost width="70%" height="6px" />
        <Ghost width="30%" height="6px" />
        <Ghost width="70%" height="6px" />
      </Box>
    ),
  },
};

const RegionsMatrix = () => (
  <Box gap="small" data-doc="figure">
    <Grid columns={['small', 'flex', 'flex', 'flex']} gap="small" align="end">
      <Box />
      {Object.entries(BREAKPOINTS).map(([key, r]) => (
        <Badge key={key} region={r} size="small" />
      ))}
    </Grid>
    {Object.entries(RESPONSIVE).map(([key, r]) => (
      <Grid
        key={key}
        columns={['small', 'flex', 'flex', 'flex']}
        gap="small"
        align="start"
        pad={{ top: 'small' }}
        border={{ side: 'top', color: 'border-weak' }}
      >
        <Box gap="4xsmall">
          <Text weight={500}>{r.name}</Text>
          <Mono color="text-weak">{r.role}</Mono>
        </Box>
        {['wide', 'medium', 'narrow'].map((bp) => (
          <Box key={bp} gap="xsmall">
            <Cell>{MINIS[key][bp]}</Cell>
            <Text size="small">{r.at[bp]}</Text>
          </Box>
        ))}
      </Grid>
    ))}
  </Box>
);

export const RegionsLevel = () => (
  <Level intro="What each part of the page does at each tier. Read across a row to follow one region as the surface narrows; read down a column for everything that changes at one width.">
    <RegionsMatrix />
    <Box gap="xsmall" margin={{ top: 'large' }}>
      <Text size="large" weight={500}>
        Rules
      </Text>
      <Box as="ul" margin="none" pad={{ left: 'medium' }} gap="xxsmall">
        {Object.values(RESPONSIVE).map((r) => (
          <Text as="li" key={r.id + r.name}>
            <Text weight={500}>{r.name}.</Text> {r.behaviour}
          </Text>
        ))}
      </Box>
      <Text size="small" color="brand" margin={{ top: 'xsmall' }}>
        Open question · {RESPONSIVE.tabs.questions}
      </Text>
    </Box>
  </Level>
);

// ---------------------------------------------------------------------------
// Drill-in page

const DRILL = {
  list: region(
    1,
    'List screen',
    'first screen',
    'Shows the collection on its own; the toolbar and list body fill the width.',
    'Search · filters · collection actions',
    'Choosing an item opens the detail screen. The list keeps its scroll position and filter for when the person comes back.',
  ),
  back: region(
    2,
    'Back link',
    'page header · parent slot',
    'Returns to the list screen.',
    '← All <collection>',
    [
      'Sits in the page header parent slot, not in the detail header.',
      'Selecting an item updates the URL, so the browser Back button returns to the list as well.',
    ],
  ),
  actions: region(
    3,
    'Record actions',
    'overflow menu',
    'All record actions, including the primary one.',
    '… menu',
    'Nothing is lost: the most common action is first in the menu, destructive actions last.',
  ),
  content: region(
    4,
    'Detail content',
    'stacked',
    'The record’s facets, 1 above the other.',
    'Tabs scroll · pairs stack',
    'Tabs stay on one scrollable row; name–value pairs stack with the name above the value.',
  ),
};

const DrillInWireframe = () => (
  <Box direction="row" gap="medium" align="start" justify="center" wrap>
    <Box gap="xsmall" align="center">
      <Screen narrow>
        <Box direction="row" gap="xsmall" align="center">
          <Ghost width="20px" height="20px" round="full" />
          <Ghost width="60px" height="10px" />
          <Box flex />
          <Ghost width="20px" height="20px" />
        </Box>
        <Dim label="Page header" pad="xsmall" />
        <Box
          flex
          border={{ color: 'brand', size: 'small' }}
          round="xsmall"
          pad="xsmall"
          gap="xsmall"
          background="background-front"
          overflow="hidden"
        >
          <Badge region={DRILL.list} size="small" />
          <Box direction="row" gap="xsmall" flex={false}>
            <Ghost height="14px" flex />
            <Ghost
              height="14px"
              width="28px"
              round="xsmall"
              background="brand"
            />
          </Box>
          <Box flex={false}>
            <GhostRows count={7} />
          </Box>
        </Box>
      </Screen>
      <Text size="small" color="text-weak">
        List screen
      </Text>
    </Box>
    <Box justify="center" height="360px">
      <Text size="large" color="text-weak">
        →
      </Text>
    </Box>
    <Box gap="xsmall" align="center">
      <Screen narrow>
        <Box direction="row" gap="xsmall" align="center">
          <Ghost width="20px" height="20px" round="full" />
          <Ghost width="60px" height="10px" />
        </Box>
        <Box
          direction="row"
          align="center"
          gap="xsmall"
          border={{ color: 'brand', size: 'small' }}
          round="xsmall"
          pad="xsmall"
          background="background-front"
        >
          <Badge region={DRILL.back} size="small" />
          <Text size="xsmall">← All items</Text>
        </Box>
        <Box
          flex
          border={{ color: 'border', style: 'dashed' }}
          round="xsmall"
          pad="xsmall"
          gap="xsmall"
        >
          <Box direction="row" justify="between" align="center" gap="small">
            <Ghost width="20%" height="12px" />
            <Box
              flex={false}
              direction="row"
              gap="xsmall"
              align="center"
              border={{ color: 'brand', size: 'small' }}
              round="xsmall"
              pad={{ horizontal: 'xsmall', vertical: '4xsmall' }}
              background="background-front"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Badge region={DRILL.actions} size="small" />
              <Dots />
            </Box>
          </Box>
          <Box
            flex
            border={{ color: 'brand', size: 'small' }}
            round="xsmall"
            pad="xsmall"
            gap="xsmall"
            background="background-front"
          >
            <Badge region={DRILL.content} size="small" />
            <Box direction="row" gap="4xsmall" overflow="hidden">
              <Ghost width="35%" height="6px" background="brand" />
              <Ghost width="35%" height="6px" />
              <Ghost width="35%" height="6px" />
            </Box>
            {[0, 1, 2].map((i) => (
              <Box key={i} gap="4xsmall">
                <Ghost width="30%" height="6px" />
                <Ghost width="70%" height="6px" />
              </Box>
            ))}
          </Box>
        </Box>
      </Screen>
      <Text size="small" color="text-weak">
        Detail screen
      </Text>
    </Box>
  </Box>
);

export const DrillInLevel = () => (
  <Level
    intro={`Under ${SURFACE.twoColumnMin}px of surface width only 1 zone fits, so the pattern becomes 2 screens: the list first, then the detail once an item is chosen.`}
    wireframe={
      <Frame>
        <DrillInWireframe />
      </Frame>
    }
    regions={DRILL}
    labels={{ owns: 'Role', controls: 'Controls' }}
  />
);

// ---------------------------------------------------------------------------
// Shell configuration page

export const ShellConfigsLevel = () => (
  <Level
    intro={`Nav (${SHELL.nav}px expanded, ${SHELL.navRail}px rail) and context pane (${SHELL.context}px) take width first; the surface gets what is left. 2 columns need ${SURFACE.twoColumnMin}px.`}
  >
    <ShellConfigSections />
  </Level>
);
