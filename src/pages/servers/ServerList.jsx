import { Box, List, Text } from 'grommet';
import { ServerHealth } from './ServerHealth';

// C · List body — one server per row: health + name leading, model and serial
// underneath, power state trailing. Just enough to choose; the record's
// facets live in the detail zone.
const ServerRow = ({ server }) => (
  <Box direction="row" align="center" gap="small" fill="horizontal">
    <ServerHealth health={server.health} iconOnly />
    <Box flex>
      <Text weight={500} truncate>
        {server.name}
      </Text>
      <Text size="small" color="text-weak" truncate>
        {server.model} · {server.serial}
      </Text>
    </Box>
    <Text size="small" color="text-weak" flex={false}>
      {server.state === 'Connected' ? server.power : 'Not connected'}
    </Text>
  </Box>
);

export const ServerList = ({ servers, selectedId, onSelect }) => (
  <List
    data={servers}
    pad="none"
    border={false}
    itemKey="id"
    onClickItem={({ item }) => onSelect(item.id)}
  >
    {(server, index) => {
      const selected = server.id === selectedId;
      const last = index === servers.length - 1;
      return (
        <Box
          pad={{ horizontal: 'small', vertical: 'small' }}
          border={last ? undefined : { side: 'bottom', color: 'border-weak' }}
          background={selected ? 'background-contrast' : undefined}
          aria-selected={selected}
        >
          <ServerRow server={server} />
        </Box>
      );
    }}
  </List>
);
