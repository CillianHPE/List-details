import { Button, Nav, Sidebar } from 'grommet';
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

// Collapsed, icon-only side nav (AppShell "Navigation - Collapsed").
// Uses Grommet Sidebar + Nav like hpe-design-system/sandbox/grommet-app NavSidebar.
export const NavSidebar = (props) => (
  <Sidebar
    background="background-front"
    pad={{ vertical: 'small', horizontal: 'xsmall' }}
    flex={false}
    width="xxsmall"
    style={{ position: 'sticky', top: 0 }}
    {...props}
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
  </Sidebar>
);
