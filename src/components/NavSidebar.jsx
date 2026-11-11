import { useState } from 'react';
import { Box, Button, Collapsible, Nav, Sidebar, Text } from 'grommet';
import { Down, LinkNext, Sidebar as SidebarIcon, Up } from '@hpe-design/icons-grommet';

// Mirrors hpe-design-system/sandbox/grommet-app NavSidebar + CollapsibleMenu:
// title header with collapse toggle, divider, then plain or expandable text items.
export const navItems = {
  Dashboard: { key: 'dashboard', label: 'Dashboard' },
  'Identity & access': [
    { key: 'users', label: 'Users' },
    { key: 'groups', label: 'Groups' },
    { key: 'roles', label: 'Roles' },
  ],
  'API keys': { key: 'api-keys', label: 'API keys' },
  Security: { key: 'security', label: 'Security' },
  'Audit log': { key: 'audit', label: 'Audit log' },
};

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

const ExpandableMenuItem = ({ item, value, open, toggle, selected, onSelect }) => (
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
                  <Box width="24px">{active && <LinkNext />}</Box>
                  <Text>{subItem.label}</Text>
                </Box>
                {subItem.count !== undefined && <Text>{subItem.count}</Text>}
              </Box>
            }
            onClick={() => onSelect(subItem)}
            active={active}
          />
        );
      })}
    </Collapsible>
  </Box>
);

const CollapsibleMenu = ({ items, selected, onSelect, ...rest }) => {
  const [expanded, setExpanded] = useState(Object.keys(items));
  return (
    <Box width={{ min: 'small', max: 'medium' }} {...rest}>
      {Object.entries(items).map(([item, value]) =>
        Array.isArray(value) ? (
          <ExpandableMenuItem
            key={item}
            item={item}
            value={value}
            open={expanded.includes(item) || value.some((v) => v.key === selected.key)}
            toggle={() =>
              setExpanded((e) => (e.includes(item) ? e.filter((i) => i !== item) : [...e, item]))
            }
            selected={selected}
            onSelect={onSelect}
          />
        ) : (
          <MenuItem key={value.key} item={value} selected={selected} onSelect={onSelect} />
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
  active = navItems['Identity & access'][0],
  sideBarOpen = true,
  ...rest
}) => {
  const [open, setOpen] = useState(sideBarOpen);
  const [selected, setSelected] = useState(active);

  return (
    <Sidebar
      background="background-front"
      gap="small"
      header={<SidebarHeader expanded={open} setExpanded={setOpen} title={title} />}
      pad={open ? 'small' : { vertical: 'small', horizontal: 'xsmall' }}
      flex={false}
      style={{ position: 'sticky', top: 0 }}
      {...rest}
    >
      {open && (
        <Nav border={{ side: 'top', color: 'border-weak' }} gap="small" pad={{ vertical: 'small' }}>
          <CollapsibleMenu items={items} selected={selected} onSelect={setSelected} gap="small" />
        </Nav>
      )}
    </Sidebar>
  );
};
