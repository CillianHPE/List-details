import { Avatar, Box, List, Text } from "grommet";
import { HealthIndicator } from "./HealthIndicator";

// C · List body — one account per row. Default: avatar leading, health tier +
// score trailing. `statusLeading` swaps the avatar for the health status icon
// (as Servers / Monitored resources do) and drops the trailing label.
const AccountRow = ({ account, statusLeading }) => (
  <Box direction="row" align="center" gap="small" fill="horizontal">
    {statusLeading ? (
      <HealthIndicator health={account.health} iconOnly />
    ) : (
      <Avatar size="medium" background="background-contrast">
        <Text size="small" weight={500}>
          {account.initials}
        </Text>
      </Avatar>
    )}
    <Box flex>
      <Text weight={500} truncate>
        {account.name}
      </Text>
      <Text size="small" color="text-weak" truncate>
        {account.industry} · {account.userCount} users
      </Text>
    </Box>
    {!statusLeading && <HealthIndicator health={account.health} compact />}
  </Box>
);

export const AccountList = ({
  accounts,
  selectedId,
  onSelect,
  statusLeading,
}) => (
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
          pad={{ horizontal: "small", vertical: "small" }}
          border={last ? undefined : { side: "bottom", color: "border-weak" }}
          background={selected ? "background-contrast" : undefined}
          aria-selected={selected}
        >
          <AccountRow account={account} statusLeading={statusLeading} />
        </Box>
      );
    }}
  </List>
);
