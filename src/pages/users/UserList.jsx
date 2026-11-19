import { Avatar, Box, List, Text } from 'grommet';
import { StatusIndicator } from './UserDetail';

const UserRow = ({ user }) => (
  <Box direction="row" align="center" gap="small" fill="horizontal">
    <Avatar size="medium" background="background-contrast">
      <Text size="small" weight={500}>
        {user.initials}
      </Text>
    </Avatar>
    <Box flex>
      <Text weight={500} truncate>
        {user.name}
      </Text>
      <Text size="small" color="text-weak" truncate>
        {user.role}
      </Text>
    </Box>
    {/* Trailing: account status as the HPE DS status indicator */}
    <StatusIndicator status={user.status} size="small" />
  </Box>
);

// C · List body — 2-line rows, selected row carried by background fill
export const UserList = ({ users, selectedId, onSelect }) => (
  <List
    data={users}
    pad="none"
    border={false}
    itemKey="id"
    onClickItem={({ item }) => onSelect(item.id)}
  >
    {(user, index) => {
      const selected = user.id === selectedId;
      const last = index === users.length - 1;
      return (
        <Box
          pad={{ horizontal: 'small', vertical: 'small' }}
          border={last ? undefined : { side: 'bottom', color: 'border-weak' }}
          background={selected ? 'background-contrast' : undefined}
          aria-selected={selected}
        >
          <UserRow user={user} />
        </Box>
      );
    }}
  </List>
);
