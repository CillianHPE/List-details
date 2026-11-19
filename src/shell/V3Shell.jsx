import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapsible,
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
  Up,
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
  usePersistedState,
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
            src={`${import.meta.env.BASE_URL}greenlake_by_hpe.svg`}
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
          <Image
            src={`${import.meta.env.BASE_URL}hpe_logo.svg`}
            fit="contain"
            alt="HPE"
          />
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

// Nav item (NavigationMenu/NavItem): 36px min height, radius small, 4×24
// brand bar when selected. `level` indents children of an expandable parent
// by widening the gap after the marker, as ItemContainer does.
const levelGap = ['xxsmall', 'small', 'medium', 'large'];
const NavItemV3 = ({
  item,
  selected,
  onSelect,
  level = 0,
  actions,
  ...rest
}) => (
  <Button
    plain
    onClick={() => onSelect(item)}
    aria-current={selected ? 'page' : undefined}
    hoverIndicator="background-contrast"
    style={{ borderRadius: 8 }}
    {...rest}
  >
    <Box
      direction="row"
      align="center"
      gap={levelGap[Math.min(level, levelGap.length - 1)]}
      height={{ min: '36px' }}
      pad={{ left: '3xsmall', right: 'xxsmall', vertical: '3xsmall' }}
      round="small"
      background={selected ? 'background-contrast' : undefined}
    >
      <Box
        width="4px"
        round="medium"
        background={selected ? 'brand' : undefined}
        flex={false}
        alignSelf="stretch"
      />
      <Box flex>
        <Text weight={selected ? 500 : undefined}>{item.label}</Text>
      </Box>
      {actions}
    </Box>
  </Button>
);

// Expandable parent (NavigationMenu/NavList): a regular nav item whose
// trailing action is the Up/Down chevron; children sit one level deeper.
// Parents start open and re-open whenever the route moves into them.
const NavGroupV3 = ({ group, items, open, onToggle, selected, onSelect }) => (
  <Box>
    <NavItemV3
      item={{ label: group }}
      onSelect={onToggle}
      aria-expanded={open}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) onToggle();
      }}
      actions={open ? <Up aria-hidden="true" /> : <Down aria-hidden="true" />}
    />
    <Collapsible open={open}>
      <Box gap="4xsmall">
        {items.map((item) => (
          <NavItemV3
            key={item.key}
            item={item}
            level={1}
            selected={selected.key === item.key}
            onSelect={onSelect}
          />
        ))}
      </Box>
    </Collapsible>
  </Box>
);

const groupOf = (items, selected) =>
  Object.entries(items).find(
    ([, v]) => Array.isArray(v) && v.some((i) => i.key === selected.key),
  )?.[0];

const NavPaneV3 = ({ title = 'Menu title', items = navItems }) => {
  const [open, setOpen] = usePersistedState('nav.open', true);
  const [selected, setSelected] = useState(() =>
    activeNavItem(navItems.Anatomy[0]),
  );
  const [expanded, setExpanded] = usePersistedState(
    'nav.expanded',
    Object.keys(items),
  );
  // Keep selection in step with in-page links that change the route.
  useEffect(() => {
    const onHash = () => setSelected((s) => activeNavItem(s));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    const g = groupOf(items, selected);
    if (g) setExpanded((e) => (e.includes(g) ? e : [...e, g]));
  }, [items, selected]);
  const onSelect = (item) => selectNavItem(item, setSelected);
  const toggle = (g) =>
    setExpanded((e) => (e.includes(g) ? e.filter((i) => i !== g) : [...e, g]));
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
        <Nav gap="4xsmall" pad={{ bottom: 'small' }} overflow="auto">
          {Object.entries(items).map(([group, value]) =>
            Array.isArray(value) ? (
              <NavGroupV3
                key={group}
                group={group}
                items={value}
                open={expanded.includes(group)}
                onToggle={() => toggle(group)}
                selected={selected}
                onSelect={onSelect}
              />
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
