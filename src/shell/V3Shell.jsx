import { useContext, useState } from 'react';
import {
  Box,
  Button,
  DropButton,
  Image,
  Menu,
  Nav,
  ResponsiveContext,
  Text,
  TextInput,
} from 'grommet';
import {
  AIGenFill,
  Catalog,
  Down,
  Help,
  Menu as MenuIcon,
  Notification,
  Search,
  Sidebar as SidebarIcon,
  User,
} from '@hpe-design/icons-grommet';
import {
  activeNavItem,
  navItems,
  selectNavItem,
} from '../components/NavSidebar';
import { ShellContext, stickyBelowHeader } from './ShellContext';

// App Shell V3.1 (Figma: Landmark Surface examples → 3250:15494).
// White canvas · 60px bordered global header · 12px wrapper holding a rounded
// grey navigation pane (256px, radius large) beside the main content column.

const GlobalHeaderV3 = () => {
  const size = useContext(ResponsiveContext);
  const compact = ['xsmall', 'small'].includes(size);
  return (
    <Box
      as="header"
      direction="row"
      align="center"
      gap="xsmall"
      height="60px"
      flex={false}
      background="background-front"
      border={{ side: 'bottom', color: 'border-weak' }}
      style={{ position: 'sticky', top: 0, zIndex: 2 }}
      pad={{ horizontal: compact ? 'medium' : 'xlarge' }}
    >
      <Box direction="row" align="center" gap="medium" flex>
        <Button
          icon={<MenuIcon />}
          size="small"
          a11yTitle="Toggle navigation"
        />
        <Box height="24px" width="93px" flex={false}>
          <Image
            src="/greenlake_by_hpe.svg"
            fit="contain"
            alt="GreenLake by HPE"
          />
        </Box>
        {!compact && (
          <>
            <Menu
              size="small"
              label="Workspace Name"
              icon={<Down />}
              reverse
              items={[
                { label: 'Acme Production' },
                { label: 'Acme Staging' },
                { label: 'Switch workspace…' },
              ]}
            />
            <Box width="288px">
              <TextInput
                size="small"
                icon={<Search id="global-header-v3-search" />}
                placeholder="Search"
                aria-labelledby="global-header-v3-search"
              />
            </Box>
          </>
        )}
      </Box>
      <Box direction="row" align="center" gap="3xsmall" flex={false}>
        <Button
          icon={<AIGenFill color="brand" />}
          size="small"
          a11yTitle="AI assistant"
        />
        <Button
          icon={<Notification />}
          size="small"
          a11yTitle="Notifications"
        />
        <Button icon={<Help />} size="small" a11yTitle="Help" />
        <Button icon={<Catalog />} size="small" a11yTitle="Documentation" />
        <DropButton
          icon={<User />}
          size="small"
          a11yTitle="Account"
          dropAlign={{ top: 'bottom', right: 'right' }}
          dropContent={
            <Box pad="medium" width="small">
              <Text weight={500}>Alex Morgan</Text>
              <Text size="small" color="text-weak">
                Acme Production
              </Text>
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

// Global Header V2, application variant (HPE DS template → "Global Header",
// Figma mNCeAPPHJ2E8NtLaJlqSpM / 103:11776): HPE logo + "HPE <app name>"
// leading, a single account button trailing. No search, workspace or tools.
const GlobalHeaderApp = ({ appName }) => {
  const size = useContext(ResponsiveContext);
  const compact = ['xsmall', 'small'].includes(size);
  return (
    <Box
      as="header"
      direction="row"
      align="center"
      justify="between"
      height="60px"
      flex={false}
      background="background-front"
      border={{ side: 'bottom', color: 'border-weak' }}
      style={{ position: 'sticky', top: 0, zIndex: 2 }}
      pad={{ horizontal: compact ? 'medium' : 'xlarge', vertical: 'xsmall' }}
    >
      <Box direction="row" align="center" gap="medium" flex={false}>
        <Box height="24px" width="48px" flex={false}>
          <Image src="/hpe_logo.svg" fit="contain" alt="HPE" />
        </Box>
        <Text>
          <Text weight={600}>HPE</Text> {appName}
        </Text>
      </Box>
      <DropButton
        icon={<User />}
        size="small"
        a11yTitle="Account"
        dropAlign={{ top: 'bottom', right: 'right' }}
        dropContent={
          <Box pad="medium" width="small">
            <Text weight={500}>Alex Morgan</Text>
            <Text size="small" color="text-weak">
              alex.morgan@hpe.com
            </Text>
          </Box>
        }
      />
    </Box>
  );
};

// Nav item: 36px min height, radius small, 4×24 brand bar when selected
const NavItemV3 = ({ item, selected, onSelect }) => (
  <Button
    plain
    onClick={() => onSelect(item)}
    aria-current={selected ? 'page' : undefined}
    hoverIndicator="background-contrast"
    style={{ borderRadius: 8 }}
  >
    <Box
      direction="row"
      align="center"
      gap="xxsmall"
      height={{ min: '36px' }}
      pad={{ left: '3xsmall', right: 'xxsmall', vertical: '3xsmall' }}
      round="small"
      background={selected ? 'background-contrast' : undefined}
    >
      <Box
        width="4px"
        height="24px"
        round="medium"
        background={selected ? 'brand' : undefined}
        flex={false}
      />
      <Text weight={selected ? 500 : undefined}>{item.label}</Text>
    </Box>
  </Button>
);

const NavPaneV3 = ({ title = 'Menu title', items = navItems }) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(() =>
    activeNavItem(navItems.Anatomy),
  );
  const onSelect = (item) => selectNavItem(item, setSelected);
  return (
    <Box
      as="nav"
      aria-label="Primary"
      width={open ? '256px' : undefined}
      flex={false}
      background="background-back"
      round="large"
      pad={{ horizontal: '3xsmall' }}
      style={stickyBelowHeader(12, { alignSelf: 'flex-start' })}
      height="calc(100vh - 84px)"
    >
      <Box
        direction="row"
        align="center"
        justify="between"
        gap="xxsmall"
        pad={{
          top: 'xsmall',
          bottom: 'xxsmall',
          horizontal: open ? 'small' : 'none',
        }}
        height={{ min: '36px' }}
        flex={false}
      >
        {open && (
          <Text size="large" weight={500} color="text-heading">
            {title}
          </Text>
        )}
        <Button
          icon={<SidebarIcon />}
          secondary
          a11yTitle={open ? 'Collapse navigation' : 'Expand navigation'}
          onClick={() => setOpen(!open)}
        />
      </Box>
      {open && (
        <Nav gap="xsmall" pad={{ bottom: 'small' }} overflow="auto">
          {Object.entries(items).map(([group, value]) =>
            Array.isArray(value) ? (
              <Box key={group} gap="4xsmall">
                <Box
                  pad={{
                    left: '18px',
                    right: 'xsmall',
                    top: 'xsmall',
                    bottom: '4xsmall',
                  }}
                >
                  <Text size="xsmall" weight={500}>
                    {group}
                  </Text>
                </Box>
                {value.map((item) => (
                  <NavItemV3
                    key={item.key}
                    item={item}
                    selected={selected.key === item.key}
                    onSelect={onSelect}
                  />
                ))}
              </Box>
            ) : (
              <NavItemV3
                key={value.key}
                item={value}
                selected={selected.key === value.key}
                onSelect={onSelect}
              />
            ),
          )}
        </Nav>
      )}
    </Box>
  );
};

// `appName` swaps the GreenLake platform header for the application variant.
export const V3Shell = ({ appName, children }) => (
  <ShellContext.Provider value="v3">
    <Box background="background" fill="vertical" flex>
      {appName ? <GlobalHeaderApp appName={appName} /> : <GlobalHeaderV3 />}
      <Box direction="row" gap="xsmall" pad="xsmall" align="start" flex>
        <NavPaneV3 />
        <Box as="main" flex style={{ minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  </ShellContext.Provider>
);
