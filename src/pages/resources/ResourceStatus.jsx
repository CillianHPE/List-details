import { Box, Text } from 'grommet';
import {
  StatusCritical,
  StatusGood,
  StatusInfo,
  StatusUnknown,
  StatusWarning,
} from '@hpe-design/icons-grommet';

// OpsRamp availability → HPE DS status indicator (icon + label).
export const AVAILABILITY_STATUS = {
  Down: { Icon: StatusCritical, color: 'status-critical' },
  Up: { Icon: StatusGood, color: 'status-ok' },
  Unknown: { Icon: StatusUnknown, color: 'status-unknown' },
  Undefined: { Icon: StatusUnknown, color: 'text-weak' },
};

// Alert severities shown in the detail's Resource alerts strip
export const ALERT_STATUS = {
  critical: {
    label: 'Critical',
    Icon: StatusCritical,
    color: 'status-critical',
  },
  warning: { label: 'Warning', Icon: StatusWarning, color: 'status-warning' },
  ok: { label: 'OK', Icon: StatusGood, color: 'status-ok' },
  info: { label: 'Info', Icon: StatusInfo, color: 'status-unknown' },
  observed: {
    label: 'Observed',
    Icon: StatusUnknown,
    color: 'text-weak',
  },
};

export const ResourceStatus = ({ availability, iconOnly, weight }) => {
  const { Icon, color } =
    AVAILABILITY_STATUS[availability] ?? AVAILABILITY_STATUS.Unknown;
  return (
    <Box direction="row" align="center" gap="3xsmall" flex={false}>
      <Icon
        color={color}
        size="xsmall"
        aria-label={iconOnly ? `Availability: ${availability}` : undefined}
        aria-hidden={!iconOnly}
      />
      {!iconOnly && <Text weight={weight}>{availability}</Text>}
    </Box>
  );
};
