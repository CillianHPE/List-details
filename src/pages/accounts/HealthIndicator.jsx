import { Box, Text } from 'grommet';
import {
  StatusCritical,
  StatusGood,
  StatusWarning,
} from '@hpe-design/icons-grommet';

// HPE DS status indicator template: semantic icon + visible label that names
// the status. Colour and icon alone are not enough, and neither is a bare
// score (crit 19 Nov), so the compact list form shows the tier and tucks the
// score in as secondary text.
// Health tiers from the portfolio pages: Healthy 61–100 · Neutral 41–60 ·
// At risk 0–40.
const TIERS = {
  Healthy: { Icon: StatusGood, color: 'status-ok' },
  Neutral: { Icon: StatusWarning, color: 'status-warning' },
  'At risk': { Icon: StatusCritical, color: 'status-critical' },
};

export const HealthIndicator = ({ health, compact }) => {
  const { Icon, color } = TIERS[health.tier];
  return (
    <Box direction="row" align="center" gap="3xsmall" flex={false}>
      <Icon color={color} size="xsmall" aria-hidden />
      {compact ? (
        <Text size="small">
          {health.tier}{' '}
          <Text size="small" color="text-weak">
            {health.score}
          </Text>
        </Text>
      ) : (
        <Text>
          {health.tier} · {health.score}/100
        </Text>
      )}
    </Box>
  );
};
