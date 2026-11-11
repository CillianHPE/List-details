import { useState } from 'react';
import {
  Box,
  Heading,
  Page,
  PageContent,
  PageHeader,
  Paragraph,
  Text,
  ToggleGroup,
} from 'grommet';

// Lo-fi anatomy of the list–detail page inside the HPE app shell.
// Each block is a region; the badge names its landmark / ARIA role and the
// legend below explains responsibility, controls and behaviour.

const REGIONS = {
  header: {
    id: 1,
    name: 'Global header',
    role: '<header> · banner',
    owns: 'Product identity, workspace switcher, global search, help, notifications, account.',
    controls: 'Menu toggle · search · icon buttons · account drop',
    behaviour: 'Persistent across every page. Never scrolls away.',
  },
  nav: {
    id: 2,
    name: 'Navigation pane',
    role: '<nav aria-label="Primary"> · navigation',
    owns: 'Section switching. The current page is marked with aria-current="page".',
    controls: 'Collapse toggle · grouped nav items',
    behaviour: 'Sticky. Collapses to icons on narrow viewports or on demand.',
  },
  main: {
    id: 3,
    name: 'Main',
    role: '<main> · main',
    owns: 'Everything page-specific. Exactly one per page.',
    controls: '—',
    behaviour: 'Hosts the page header and the list–detail surface.',
  },
  pageHeader: {
    id: 4,
    name: 'Page header',
    role: 'PageHeader · <h1>',
    owns: 'Page title, subtitle and page-level primary action.',
    controls: 'Primary button (e.g. Invite user) · back link when drilled in',
    behaviour: 'Scrolls with content. Back link appears only in stacked mode.',
  },
  listToolbar: {
    id: 5,
    name: 'List toolbar',
    role: '<search> · search',
    owns: 'Narrowing the collection without leaving the page.',
    controls: 'Search input · quick-filter toggle group · result count',
    behaviour: 'Sticky above the list. Filters apply instantly.',
  },
  list: {
    id: 6,
    name: 'List',
    role: '<ul role="listbox"> · option rows',
    owns: 'Selecting one record to inspect.',
    controls: 'Rows (avatar, name, role) · keyboard ↑↓ · Enter',
    behaviour:
      'Scrolls independently. Selected row is highlighted and announced.',
  },
  detailHeader: {
    id: 7,
    name: 'Detail header',
    role: '<h2> · menu button',
    owns: 'Identity of the selected record and its record-level actions.',
    controls: 'Actions menu (edit, reset MFA, … · destructive last)',
    behaviour: 'Updates when the selection changes.',
  },
  tabs: {
    id: 8,
    name: 'Detail tabs',
    role: 'tablist · tab · tabpanel',
    owns: 'Switching between facets of the record (Details, Roles & groups, Activity).',
    controls: 'Tabs · ←/→ keys',
    behaviour: 'Each panel has a visually hidden <h3> for the outline.',
  },
  detailBody: {
    id: 9,
    name: 'Detail body',
    role: 'tabpanel content',
    owns: 'Read-only facts and contained sub-lists for the record.',
    controls: 'Name–value pairs · row menus · inline links',
    behaviour: 'Name–value pairs go horizontal→vertical when space runs out.',
  },
};

const Badge = ({ region }) => (
  <Box direction="row" gap="xsmall" align="center" wrap>
    <Box
      background="text-strong"
      round="full"
      width="24px"
      height="24px"
      align="center"
      justify="center"
      flex={false}
    >
      <Text size="xsmall" weight={700} color="#ffffff">
        {region.id}
      </Text>
    </Box>
    <Text weight={500}>{region.name}</Text>
    <Text size="small" color="text-weak" style={{ fontFamily: 'monospace' }}>
      {region.role}
    </Text>
  </Box>
);

// Dashed, unfilled wireframe block
const Block = ({ region, children, ...rest }) => (
  <Box
    border={{ color: 'border', style: 'dashed', size: 'small' }}
    round="xsmall"
    pad="small"
    gap="small"
    {...rest}
  >
    <Badge region={region} />
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

const ShellWireframe = ({ variant }) => {
  const v3 = variant === 'v3';
  return (
    <Box
      border={{ color: 'border-weak' }}
      background={v3 ? 'background' : 'background-back'}
      round="small"
      overflow="hidden"
    >
      <Block
        region={REGIONS.header}
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
          region={REGIONS.nav}
          width="220px"
          flex={false}
          background={v3 ? 'background-back' : 'background-front'}
          round={v3 ? 'large' : 'none'}
        >
          <Ghost width="60%" />
          <Ghost width="80%" height="28px" background="background-contrast" />
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

        <Block
          region={REGIONS.main}
          flex
          round="none"
          border={{ color: 'border', style: 'dashed', size: 'small' }}
        >
          <Block
            region={REGIONS.pageHeader}
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

          <Box
            direction="row"
            background="background-front"
            round="xlarge"
            border={v3 ? { color: 'border-weak' } : undefined}
            pad="small"
            gap="small"
          >
            <Box width="240px" flex={false} gap="small">
              <Block region={REGIONS.listToolbar}>
                <Ghost height="36px" />
                <Box direction="row" gap="xsmall">
                  <Ghost width="40px" height="24px" round="full" />
                  <Ghost width="56px" height="24px" round="full" />
                  <Ghost width="60px" height="24px" round="full" />
                </Box>
              </Block>
              <Block region={REGIONS.list} flex>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Box
                    key={i}
                    direction="row"
                    gap="small"
                    align="center"
                    pad="xsmall"
                    background={i === 0 ? 'background-contrast' : undefined}
                  >
                    <Ghost width="32px" height="32px" round="full" />
                    <Box gap="xxsmall" flex>
                      <Ghost width="70%" />
                      <Ghost width="50%" height="8px" />
                    </Box>
                  </Box>
                ))}
              </Block>
            </Box>
            <Box border={{ side: 'left', color: 'border-weak' }} />
            <Box flex gap="small">
              <Block
                region={REGIONS.detailHeader}
                direction="row"
                justify="between"
                align="center"
              >
                <Ghost width="160px" height="24px" />
                <Ghost width="90px" height="32px" round="full" />
              </Block>
              <Block region={REGIONS.tabs} direction="row" gap="small">
                <Ghost width="60px" height="20px" background="text-strong" />
                <Ghost width="100px" height="20px" />
                <Ghost width="60px" height="20px" />
              </Block>
              <Block region={REGIONS.detailBody} flex>
                {[0, 1, 2, 3].map((i) => (
                  <Box key={i} direction="row" gap="medium">
                    <Ghost width="120px" />
                    <Ghost width="200px" />
                  </Box>
                ))}
              </Block>
            </Box>
          </Box>
        </Block>
      </Box>
    </Box>
  );
};

const Legend = () => (
  <Box as="dl" margin="none" gap="medium">
    {Object.values(REGIONS).map((region) => (
      <Box
        key={region.id}
        pad={{ bottom: 'medium' }}
        border={{ side: 'bottom', color: 'border-weak' }}
        gap="xsmall"
      >
        <Box as="dt">
          <Badge region={region} />
        </Box>
        <Box as="dd" margin={{ left: '32px' }} gap="xxsmall">
          <Text>
            <Text weight={500}>Owns · </Text>
            {region.owns}
          </Text>
          <Text>
            <Text weight={500}>Controls · </Text>
            {region.controls}
          </Text>
          <Text color="text-weak">
            <Text weight={500}>Behaviour · </Text>
            {region.behaviour}
          </Text>
        </Box>
      </Box>
    ))}
  </Box>
);

export const AnatomyPage = () => {
  const [variant, setVariant] = useState('default');
  return (
    <Page pad={{ bottom: 'xlarge' }}>
      <PageContent gap="large">
        <PageHeader
          title="List–detail anatomy"
          subtitle="Regions, landmark roles and what each one is responsible for."
          actions={
            <ToggleGroup
              options={[
                { label: 'Default shell', value: 'default' },
                { label: 'Shell V3.1', value: 'v3' },
              ]}
              value={variant}
              onToggle={({ value }) => value && setVariant(value)}
            />
          }
        />
        <ShellWireframe variant={variant} />
        <Box gap="small">
          <Heading level={2} margin="none">
            Regions
          </Heading>
          <Paragraph margin="none" fill>
            Shell regions (1–3) are shared by every page. Page regions (4–9) are
            specific to the list–detail pattern: the list is the selection
            surface, the detail column is the inspection surface, and the page
            header carries the single collection-level action.
          </Paragraph>
          <Legend />
        </Box>
      </PageContent>
    </Page>
  );
};
