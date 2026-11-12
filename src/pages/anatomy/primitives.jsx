import { createContext, useContext } from 'react';
import { Anchor, Box, Heading, Paragraph, Text } from 'grommet';

// Lets legend entries jump to another group/tab (e.g. Behaviour → Scroll).
export const AnatomyNav = createContext(() => {});

export const BEHAVIOUR_TABS = [
  'Scroll & height',
  'Responsive',
  'States',
  'Data & performance',
  'Actions & ownership',
];

// Cross-reference from a Structure legend entry to a Behaviour tab
export const see = (...tabs) => ({
  see: tabs.map((t) => ({ group: 'behaviour', tab: t })),
});

const SeeAlso = ({ links }) => {
  const go = useContext(AnatomyNav);
  return (
    <Text size="small" color="text-weak">
      See Behaviour →{' '}
      {links.map((l, i) => (
        <Text key={l.tab} size="small">
          {i > 0 && ' · '}
          <Anchor
            size="small"
            label={BEHAVIOUR_TABS[l.tab]}
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
  extra = {},
) => ({
  id,
  name,
  role,
  owns,
  controls,
  behaviour,
  ...extra,
});

export const Badge = ({ region: r, size = 'medium', showRole = true }) => (
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
    {showRole && (
      <Text size="small" color="text-weak" style={{ fontFamily: 'monospace' }}>
        {r.role}
      </Text>
    )}
  </Box>
);

// Dashed, unfilled wireframe block
export const Block = ({ region: r, showRole, children, ...rest }) => (
  <Box
    border={{ color: 'border', style: 'dashed', size: 'small' }}
    round="xsmall"
    pad="small"
    gap="small"
    {...rest}
  >
    <Badge region={r} showRole={showRole} />
    {children}
  </Box>
);

// Solid, emphasised block used for the regions a level is focused on
export const Focus = ({ region: r, label, showRole, children, ...rest }) => (
  <Box
    border={{ color: 'brand', size: 'small' }}
    round="xsmall"
    pad="small"
    gap="small"
    background="background-front"
    {...rest}
  >
    <Box direction="row" justify="between" align="start" gap="small" wrap>
      <Badge region={r} showRole={showRole} />
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

export const RegionDetails = ({ region: r, labels = {} }) => {
  const l = {
    owns: 'Owns',
    controls: 'Controls',
    behaviour: 'Behaviour',
    ...labels,
  };
  return (
    <Box gap="xxsmall">
      {r.space && (
        <Text>
          <Text weight={500}>Space · </Text>
          {r.space}
        </Text>
      )}
      <Text>
        <Text weight={500}>{l.owns} · </Text>
        {r.owns}
      </Text>
      <Text>
        <Text weight={500}>{l.controls} · </Text>
        {r.controls}
      </Text>
      <Text color="text-weak">
        <Text weight={500}>{l.behaviour} · </Text>
        {r.behaviour}
      </Text>
      {r.questions && (
        <Text color="brand">
          <Text weight={500}>Open questions · </Text>
          {r.questions}
        </Text>
      )}
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
    {children ?? (
      <>
        {wireframe}
        <Legend regions={regions} labels={labels} />
      </>
    )}
  </Box>
);
