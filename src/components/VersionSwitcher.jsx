import { Box, Text, ToggleGroup } from 'grommet';

export const VERSIONS = [
  { label: 'Default shell', value: 'default' },
  { label: 'Shell V3.1', value: 'v3' },
  { label: 'Anatomy', value: 'anatomy' },
];

// Prototype-only floating switcher; not part of the product UI
export const VersionSwitcher = ({ value, onChange }) => (
  <Box
    direction="row"
    align="center"
    gap="small"
    pad={{ vertical: 'xsmall', horizontal: 'small' }}
    background="background-floating"
    round="full"
    elevation="medium"
    style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 10 }}
    role="region"
    aria-label="Prototype version"
  >
    <Text size="small" color="text-weak">
      Version
    </Text>
    <ToggleGroup
      options={VERSIONS}
      value={value}
      onToggle={({ value: next }) => next && onChange(next)}
    />
  </Box>
);
