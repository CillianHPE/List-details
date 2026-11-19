import { Box, Text } from 'grommet';
import {
  StatusCritical,
  StatusGood,
  StatusUnknown,
  StatusWarning,
} from '@hpe-design/icons-grommet';

// HPE DS status indicator template: semantic icon + visible label.
// Mirrors the COM Servers health legend: Critical · Warning · OK · Unknown.
export const HEALTH_STATUS = {
  OK: { Icon: StatusGood, color: 'status-ok' },
  Warning: { Icon: StatusWarning, color: 'status-warning' },
  Critical: { Icon: StatusCritical, color: 'status-critical' },
  Unknown: { Icon: StatusUnknown, color: 'status-unknown' },
};

export const SEVERITY_STATUS = {
  ok: HEALTH_STATUS.OK,
  warning: HEALTH_STATUS.Warning,
  critical: HEALTH_STATUS.Critical,
  unknown: HEALTH_STATUS.Unknown,
};

export const ServerHealth = ({ health, iconOnly, label }) => {
  const { Icon, color } = HEALTH_STATUS[health] ?? HEALTH_STATUS.Unknown;
  return (
    <Box direction="row" align="center" gap="3xsmall" flex={false}>
      <Icon
        color={color}
        size="xsmall"
        aria-label={iconOnly ? `Health: ${health}` : undefined}
        aria-hidden={!iconOnly}
      />
      {!iconOnly && <Text>{label ?? health}</Text>}
    </Box>
  );
};

// Status text for component / security rows: label with its severity icon
export const StatusText = ({ severity, children }) => {
  const { Icon, color } = SEVERITY_STATUS[severity] ?? SEVERITY_STATUS.unknown;
  return (
    <Box direction="row" align="center" gap="3xsmall" flex={false}>
      <Icon color={color} size="xsmall" aria-hidden />
      <Text>{children}</Text>
    </Box>
  );
};
