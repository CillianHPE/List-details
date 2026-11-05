import { Box, Button, Text } from 'grommet';
import {
  Menu,
  Search,
  Notification,
  Help,
  Catalog,
  User,
} from '@hpe-design/icons-grommet';

export const GlobalHeader = () => (
  <Box
    as="header"
    direction="row"
    align="center"
    justify="between"
    background="background-front"
    border={{ side: 'bottom', color: 'border-weak' }}
    pad={{ horizontal: 'small', vertical: 'xsmall' }}
    height="60px"
    flex={false}
  >
    <Box direction="row" align="center" gap="small">
      <Button icon={<Menu />} a11yTitle="Toggle navigation" />
      <Box border={{ side: 'left', color: 'border-weak' }} height="24px" />
      <Text weight={500} size="large">
        HPE GreenLake
      </Text>
    </Box>
    <Box direction="row" align="center" gap="xsmall">
      <Button icon={<Search />} a11yTitle="Search" />
      <Button icon={<Catalog />} a11yTitle="Documentation" />
      <Button icon={<Help />} a11yTitle="Help" />
      <Button icon={<Notification />} a11yTitle="Notifications" />
      <Button icon={<User />} a11yTitle="Account" />
    </Box>
  </Box>
);
