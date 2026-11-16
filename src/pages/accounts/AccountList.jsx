import { Avatar, Box, List, Text } from 'grommet';
import { HealthIndicator } from './HealthIndicator';

// C · List body — one account per row: identity on the left, health score on
// the right. Just enough to choose; everything else lives in the detail zone.
const AccountRow = ({ account }) => (
  <Box direction="row" align="center" gap="small" fill="horizontal">
    <Avatar size="medium" background="background-contrast">
      <Text size="small" weight={500}>
        {account.initials}
      </Text>
    </Avatar>
    <Box flex>
      <Text weight={500} truncate>
        {account.name}
      </Text>
      <Text size="small" color="text-weak" truncate>
        {account.industry} · {account.userCount} users
      </Text>
    </Box>
    <HealthIndicator health={account.health} compact />
  </Box>
);

export const AccountList = ({ accounts, selectedId, onSelect }) => (
  <List
    data={accounts}
    pad="none"
    border={false}
    itemKey="id"
    onClickItem={({ item }) => onSelect(item.id)}
  >
    {(account, index) => {
      const selected = account.id === selectedId;
      const last = index === accounts.length - 1;
      return (
        <Box
          pad={{ horizontal: 'small', vertical: 'small' }}
          border={last ? undefined : { side: 'bottom', color: 'border-weak' }}
          background={selected ? 'background-contrast' : undefined}
          aria-selected={selected}
        >
          <AccountRow account={account} />
        </Box>
      );
    }}
  </List>
);
