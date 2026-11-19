import { Box, List, Text } from 'grommet';
import { ResourceStatus } from './ResourceStatus';

// C · List body — availability icon + name leading; secondary line ordered by
// importance: availability (what's wrong), IP (how to reach it), then model.
const ResourceRow = ({ resource }) => (
  <Box direction="row" align="center" gap="small" fill="horizontal">
    <ResourceStatus availability={resource.availability} iconOnly />
    <Box flex>
      <Text weight={500} truncate>
        {resource.name}
      </Text>
      <Text size="small" color="text-weak" truncate>
        {resource.availability} · {resource.ip} · {resource.model}
      </Text>
    </Box>
  </Box>
);

export const ResourceList = ({ resources, selectedId, onSelect }) => (
  <List
    data={resources}
    pad="none"
    border={false}
    itemKey="id"
    onClickItem={({ item }) => onSelect(item.id)}
  >
    {(resource, index) => {
      const selected = resource.id === selectedId;
      const last = index === resources.length - 1;
      return (
        <Box
          pad={{ horizontal: 'small', vertical: 'small' }}
          border={last ? undefined : { side: 'bottom', color: 'border-weak' }}
          background={selected ? 'background-contrast' : undefined}
          aria-selected={selected}
        >
          <ResourceRow resource={resource} />
        </Box>
      );
    }}
  </List>
);
