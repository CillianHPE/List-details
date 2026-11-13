import { Box, Grid, Heading, Text } from 'grommet';

// Extra page content around the list–detail surface, for studying scroll &
// height when the surface is not the only thing on the page.
const Metric = ({ label, value }) => (
  <Box background="background-front" round="xlarge" pad="medium" gap="xsmall">
    <Text size="small" color="text-weak">
      {label}
    </Text>
    <Heading level={3} margin="none" size="large">
      {value}
    </Heading>
  </Box>
);

export const UsersSummary = ({ users }) => {
  const active = users.filter((u) => u.status === 'Active').length;
  return (
    <Grid
      columns={{ count: 'fit', size: 'small' }}
      gap="small"
      margin={{ bottom: 'medium' }}
    >
      <Metric label="Total users" value={users.length} />
      <Metric label="Active" value={active} />
      <Metric label="Invited" value={users.length - active} />
    </Grid>
  );
};

const ACTIVITY = [
  ['Ava Williams', 'was assigned Workspace administrator', '2 hours ago'],
  ['Benjamin Schultz', 'joined user group Platform', 'Yesterday'],
  ['Charlotte Nguyen', 'was invited', 'Yesterday'],
  ['Daniel Okafor', 'signed in from a new device', '3 days ago'],
  ['Elena Rossi', 'role Security analyst removed', 'Last week'],
];

export const RecentActivity = () => (
  <Box
    background="background-front"
    round="xlarge"
    pad="medium"
    gap="small"
    margin={{ top: 'medium' }}
  >
    <Heading level={2} size="small" margin="none">
      Recent activity
    </Heading>
    <Box>
      {ACTIVITY.map(([who, what, when], i) => (
        <Box
          key={who}
          direction="row"
          justify="between"
          gap="medium"
          pad={{ vertical: 'small' }}
          border={
            i < ACTIVITY.length - 1
              ? { side: 'bottom', color: 'border-weak' }
              : false
          }
        >
          <Text>
            <Text weight={500}>{who}</Text> {what}
          </Text>
          <Text color="text-weak" size="small">
            {when}
          </Text>
        </Box>
      ))}
    </Box>
  </Box>
);
