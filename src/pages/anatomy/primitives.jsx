import { createContext, useContext, useRef, useState } from 'react';
import {
  Anchor,
  Box,
  Drop,
  Heading,
  NameValueList,
  NameValuePair,
  Paragraph,
  Text,
} from 'grommet';

// Lets legend entries jump to another group/tab (e.g. Behaviour → Scroll).
export const AnatomyNav = createContext(() => {});
// Legend label overrides (e.g. behaviour → "Layout") so the wireframe popovers
// read the same as the legend beneath them.
const LegendLabels = createContext({});

// Behaviour tabs are addressed by key so links survive reordering or hiding.
// `hidden` keeps a tab's content in the codebase but out of the UI (and out of
// any "See Behaviour →" links) until it is ready to present.
export const BEHAVIOUR_TABS = [
  { key: 'scroll', label: 'Scroll & height' },
  { key: 'responsive', label: 'Responsive' },
  { key: 'states', label: 'States' },
  { key: 'data', label: 'Data & performance', hidden: true },
  { key: 'actions', label: 'Actions & ownership' },
];
export const VISIBLE_BEHAVIOUR_TABS = BEHAVIOUR_TABS.filter((t) => !t.hidden);
const tabByKey = (key) => BEHAVIOUR_TABS.find((t) => t.key === key);

// Cross-reference from a Structure legend entry to a Behaviour tab
export const see = (...keys) => ({
  see: keys.map((key) => ({ group: 'behaviour', tab: key })),
});

const SeeAlso = ({ links }) => {
  const go = useContext(AnatomyNav);
  const visible = links.filter((l) => !tabByKey(l.tab)?.hidden);
  if (!visible.length) return null;
  return (
    <Text size="small" color="text-weak">
      See Behaviour →{' '}
      {visible.map((l, i) => (
        <Text key={l.tab} size="small">
          {i > 0 && ' · '}
          <Anchor
            size="small"
            label={tabByKey(l.tab).label}
            onClick={() => go(l.group, l.tab)}
          />
        </Text>
      ))}
    </Text>
  );
};

// Shared lo-fi wireframe primitives for the anatomy page.

export const region = (
  id,
  name,
  role,
  owns,
  controls,
  behaviour,
  ...extras
) => ({
  id,
  name,
  role,
  owns,
  controls,
  behaviour,
  ...Object.assign({}, ...extras),
});

const Dot = ({ id }) => (
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
      {id}
    </Text>
  </Box>
);

// Numbered dot that reveals the region's legend entry on hover / focus, so
// the detail is reachable from the diagram without scrolling to the legend.
export const PopoverDot = ({ region: r, children }) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);
  const labels = useContext(LegendLabels);
  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  return (
    <>
      <Box
        as="button"
        type="button"
        ref={ref}
        aria-label={`${r.id} · ${r.name} — details`}
        aria-expanded={open}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={() => setOpen((o) => !o)}
        style={{
          padding: 0,
          border: 'none',
          background: 'none',
          cursor: 'help',
          borderRadius: 12,
        }}
      >
        {children ?? <Dot id={r.id} />}
      </Box>
      {open && (
        <Drop
          target={ref.current}
          align={{ top: 'bottom', left: 'left' }}
          margin={{ top: 'xsmall' }}
          round="small"
          elevation="medium"
          onMouseEnter={show}
          onMouseLeave={hide}
          trapFocus={false}
        >
          <Box pad="medium" width={{ max: 'medium' }} gap="xsmall">
            <Badge region={r} />
            <RegionDetails region={r} labels={labels} compact />
          </Box>
        </Drop>
      )}
    </>
  );
};

export const Badge = ({
  region: r,
  size = 'medium',
  showRole = false,
  popover = false,
}) => (
  <Box direction="row" gap="xsmall" align="center" wrap>
    {popover ? <PopoverDot region={r} /> : <Dot id={r.id} />}
    <Text weight={500} size={size}>
      {r.name}
    </Text>
    {showRole && (
      <Text size="small" color="text-weak" style={{ fontFamily: 'monospace' }}>
        {r.role}
      </Text>
    )}
  </Box>
);

// Dashed, unfilled wireframe block
export const Block = ({ region: r, showRole = false, children, ...rest }) => (
  <Box
    border={{ color: 'border', style: 'dashed', size: 'small' }}
    round="xsmall"
    pad="small"
    gap="small"
    {...rest}
  >
    <Badge region={r} showRole={showRole} popover />
    {children}
  </Box>
);

// Solid, emphasised block used for the regions a level is focused on
export const Focus = ({
  region: r,
  label,
  showRole = false,
  children,
  ...rest
}) => (
  <Box
    border={{ color: 'brand', size: 'small' }}
    round="xsmall"
    pad="small"
    gap="small"
    background="background-front"
    {...rest}
  >
    <Box direction="row" justify="between" align="start" gap="small" wrap>
      <Badge region={r} showRole={showRole} popover />
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

export const Ghost = ({ width = '100%', height = '12px', ...rest }) => (
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
export const Dim = ({ label, ...rest }) => (
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

export const GhostRows = ({ count = 5, selected = 0 }) =>
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

export const Legend = ({ regions, labels }) => (
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
        <Box as="dd" margin={{ left: '32px' }}>
          <RegionDetails region={r} labels={labels} />
        </Box>
      </Box>
    ))}
  </Box>
);

// Facts about a region. `compact` (wireframe popovers) stacks name over
// value; the legend lays them out as a two-column NameValueList.
export const RegionDetails = ({ region: r, labels = {}, compact = false }) => {
  const l = {
    owns: 'Role',
    controls: 'Controls',
    behaviour: 'Behaviour',
    ...labels,
  };
  const pairs = [
    r.space && ['Space', r.space],
    [l.owns, r.owns],
    r.why && ['Why', r.why],
    [l.controls, r.controls],
    [l.behaviour, r.behaviour],
    r.questions && ['Open questions', r.questions],
  ].filter(Boolean);
  return (
    <Box gap="small">
      <NameValueList
        pairProps={{ direction: compact ? 'column' : 'row' }}
        nameProps={{ width: compact ? undefined : 'xsmall' }}
        valueProps={{ width: 'auto' }}
        gap={compact ? 'small' : 'xsmall'}
      >
        {pairs.map(([name, value]) => (
          <NameValuePair key={name} name={name}>
            {Array.isArray(value) ? (
              <Box as="ul" margin="none" pad={{ left: 'medium' }} gap="xxsmall">
                {value.map((item) => (
                  <Text as="li" key={item}>
                    {item}
                  </Text>
                ))}
              </Box>
            ) : (
              <Text color={name === 'Open questions' ? 'brand' : undefined}>
                {value}
              </Text>
            )}
          </NameValuePair>
        ))}
      </NameValueList>
      {r.see && <SeeAlso links={r.see} />}
    </Box>
  );
};

export const Level = ({
  title,
  intro,
  control,
  wireframe,
  regions,
  labels,
  children,
}) => (
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
    <LegendLabels.Provider value={labels ?? {}}>
      {children ?? (
        <>
          {wireframe}
          <Legend regions={regions} labels={labels} />
        </>
      )}
    </LegendLabels.Provider>
  </Box>
);
