import { Box, Button, Nav } from 'grommet';
import {
  Home,
  Group,
  Shield,
  Key,
  Lock,
  Catalog,
} from '@hpe-design/icons-grommet';

const items = [
  { icon: Home, label: 'Home' },
  { icon: Group, label: 'Users', active: true },
  { icon: Shield, label: 'Roles' },
  { icon: Key, label: 'API keys' },
  { icon: Lock, label: 'Security' },
  { icon: Catalog, label: 'Audit log' },
];

// Collapsed, icon-only side nav (AppShell "Navigation - Collapsed")
export const NavSidebar = () => (
  <Box
    as="aside"
    background="background-front"
    round="small"
    pad="xsmall"
    flex={false}
    width="xxsmall"
  >
    <Nav gap="xxsmall" align="center">
      {items.map(({ icon: Icon, label, active }) => (
        <Button
          key={label}
          icon={<Icon />}
          a11yTitle={label}
          tip={label}
          active={active}
        />
      ))}
    </Nav>
  </Box>
);
