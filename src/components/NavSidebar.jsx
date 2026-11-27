import { useEffect, useState } from 'react';

// The sidebar remounts whenever the route switches shells, so its collapse
// state lives in sessionStorage to stay in sync across views.
export const usePersistedState = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.sessionStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable; keep in-memory state only
    }
  }, [key, value]);
  return [value, setValue];
};
import { Box, Button, Collapsible, Nav, Sidebar, Text } from 'grommet';
import {
  Down,
  LinkNext,
  Sidebar as SidebarIcon,
  Up,
} from '@hpe-design/icons-grommet';

// Mirrors hpe-design-system/sandbox/grommet-app NavSidebar + CollapsibleMenu:
// title header with collapse toggle, divider, then plain or expandable text items.
export const navItems = {
  "Usage guidelines": [
    {
      key: 'proto-pattern-what',
      label: 'Overview',
      href: '#/pattern/what',
    },
    {
      key: 'proto-pattern-use',
      label: 'When to use',
      href: '#/pattern/use',
    },
    {
      key: 'proto-pattern-when-not',
      label: 'When not to use',
      href: '#/pattern/when-not',
    },
    {
      key: 'proto-pattern-jtbd',
      label: 'JTBD',
      href: '#/pattern/jtbd',
    },
    {
      key: 'proto-pattern-when',
      label: 'User stories',
      children: [
        {
          key: 'proto-pattern-when-gather',
          label: 'Gather',
          description: 'Work through a queue',
          href: '#/pattern/when/gather',
        },
        {
          key: 'proto-pattern-when-compare',
          label: 'Compare',
          description: 'Spot what differs',
          href: '#/pattern/when/compare',
        },
        {
          key: 'proto-pattern-when-triage',
          label: 'Triage',
          description: 'Find the few that matter',
          href: '#/pattern/when/triage',
        },
        {
          key: 'proto-pattern-when-quick-edit',
          label: 'Quick edit',
          description: 'Same edit, many records',
          href: '#/pattern/when/quick-edit',
        },
      ],
    },
  ],
  Anatomy: [
    {
      key: 'proto-anatomy',
      label: 'Structure',
      href: '#/anatomy',
    },
  ],
  Behaviour: [
    {
      key: 'proto-behaviour-scroll',
      label: 'Scroll & height',
      href: '#/behaviour/scroll',
    },
    {
      key: 'proto-behaviour-actions',
      label: 'Actions & ownership',
      href: '#/behaviour/actions',
    },
  ],
  Responsive: [
    {
      key: 'proto-responsive-breakpoints',
      label: 'Breakpoints',
      href: '#/responsive/breakpoints',
    },
    {
      key: 'proto-responsive-regions',
      label: 'Regions by width',
      href: '#/responsive/regions',
    },
    {
      key: 'proto-responsive-drill-in',
      label: 'Drill-in',
      href: '#/responsive/drill-in',
    },
    {
      key: 'proto-responsive-shell-configs',
      label: 'Shell configurations',
      href: '#/responsive/shell-configs',
    },
  ],
  States: [
    {
      key: 'proto-states-loading',
      label: 'Loading',
      href: '#/states/loading',
    },
    {
      key: 'proto-states-empty',
      label: 'Empty',
      href: '#/states/empty',
    },
    {
      key: 'proto-states-no-selection',
      label: 'No selection',
      href: '#/states/no-selection',
    },
    {
      key: 'proto-states-error',
      label: 'Error',
      href: '#/states/error',
    },
    {
      key: 'proto-states-read-only',
      label: 'Read-only',
      href: '#/states/read-only',
    },
  ],
  Examples: [
    {
      key: 'proto-v3',
      label: 'Users',
      href: '#/v3',
    },
    {
      key: 'proto-v3-sparse',
      label: 'Team members (sparse)',
      href: '#/v3-sparse',
    },
    {
      key: 'proto-accounts-cockpit',
      label: 'Sales Cockpit',
      href: '#/accounts-cockpit',
    },
    {
      key: 'proto-compute-servers',
      label: 'Servers (Compute)',
      href: '#/compute-servers',
    },
    {
      key: 'proto-opsramp-resources',
      label: 'Resources (OpsRamp)',
      href: '#/opsramp-resources',
    },
  ],
  'Design crit': [
    {
      key: 'proto-crit-2026-11-19',
      label: '19 Nov 2026',
      href: '#/crit/2026-11-19',
    },
    {
      key: 'proto-crit-tracker',
      label: 'Tracker and changelog',
      href: '#/crit/tracker',
    },
  ],
};

// Items with an href navigate the prototype; others only update selection.
export const selectNavItem = (item, setSelected) => {
  setSelected(item);
  if (item.href) window.location.hash = item.href.replace(/^#/, '');
};

// Flatten groups and any nested children into one list of leaf items.
export const flatNavItems = () =>
  Object.values(navItems)
    .flat()
    .flatMap((i) => [i, ...(i.children ?? [])]);

export const activeNavItem = (fallback) =>
  flatNavItems().find((i) => i.href && i.href === window.location.hash) ??
  fallback;

const MenuItem = ({ item, selected, onSelect }) => (
  <Button
    label={
      <Box direction="row" justify="between" width={{ min: 'small' }}>
        <Text>{item.label}</Text>
        {item.count !== undefined && <Text>{item.count}</Text>}
      </Box>
    }
    onClick={() => onSelect(item)}
    active={selected.key === item.key}
  />
);

const ExpandableMenuItem = ({
  item,
  value,
  open,
  toggle,
  selected,
  onSelect,
}) => (
  <Box gap="xsmall">
    <Button
      label={
        <Box direction="row" align="center" justify="between">
          <Text>{item}</Text>
          {open ? <Up /> : <Down />}
        </Box>
      }
      justify="start"
      onClick={toggle}
    />
    <Collapsible open={open}>
      {value.map((subItem) => {
        const active = selected.key === subItem.key;
        return (
          <Button
            key={subItem.key}
            label={
              <Box direction="row" align="center" justify="between">
                <Box direction="row" align="center" gap="small">
                  <Box width="24px" flex={false}>
                    {active && <LinkNext />}
                  </Box>
                  <Text>{subItem.label}</Text>
                </Box>
                {subItem.count !== undefined && <Text>{subItem.count}</Text>}
              </Box>
            }
            onClick={() => onSelect(subItem)}
            active={active}
            justify="start"
          />
        );
      })}
    </Collapsible>
  </Box>
);

const CollapsibleMenu = ({ items, selected, onSelect, ...rest }) => {
  const [expanded, setExpanded] = usePersistedState(
    'nav.expanded',
    Object.keys(items),
  );
  return (
    <Box width={{ min: 'small', max: 'medium' }} {...rest}>
      {Object.entries(items).map(([item, value]) =>
        Array.isArray(value) ? (
          <ExpandableMenuItem
            key={item}
            item={item}
            value={value}
            open={
              expanded.includes(item) ||
              value.some((v) => v.key === selected.key)
            }
            toggle={() =>
              setExpanded((e) =>
                e.includes(item) ? e.filter((i) => i !== item) : [...e, item],
              )
            }
            selected={selected}
            onSelect={onSelect}
          />
        ) : (
          <MenuItem
            key={value.key}
            item={value}
            selected={selected}
            onSelect={onSelect}
          />
        ),
      )}
    </Box>
  );
};

const SidebarHeader = ({ expanded, setExpanded, title }) => (
  <Box direction="row" align="center" justify="between" gap="large">
    {expanded && <Text size="large">{title}</Text>}
    <Button icon={<SidebarIcon />} onClick={() => setExpanded(!expanded)} />
  </Box>
);

export const NavSidebar = ({
  title = 'Workspace',
  items = navItems,
  active = navItems.Anatomy[0],
  sideBarOpen = true,
  ...rest
}) => {
  const [open, setOpen] = usePersistedState('nav.open', sideBarOpen);
  const [selected, setSelected] = useState(() => activeNavItem(active));
  const onSelect = (item) => selectNavItem(item, setSelected);

  return (
    <Sidebar
      background="background-front"
      gap="small"
      header={
        <SidebarHeader expanded={open} setExpanded={setOpen} title={title} />
      }
      pad={open ? 'small' : { vertical: 'small', horizontal: 'xsmall' }}
      flex={false}
      style={{ position: 'sticky', top: 0 }}
      {...rest}
    >
      {open && (
        <Nav
          border={{ side: 'top', color: 'border-weak' }}
          gap="small"
          pad={{ vertical: 'small' }}
        >
          <CollapsibleMenu
            items={items}
            selected={selected}
            onSelect={onSelect}
            gap="small"
          />
        </Nav>
      )}
    </Sidebar>
  );
};
