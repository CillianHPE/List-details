import { cloneElement } from 'react';
import { Box, Heading, Paragraph } from 'grommet';

// HPE DS empty state template: icon · heading · description · actions.
// Ported from @shared/aries-core EmptyState so the prototype matches
// https://design-system.hpe.design/templates/empty-state
// Icon defaults to xxlarge (32px, icon.size.xxlarge): in the HPE theme the
// icon scale tracks text, so xlarge is only 20px.
export const EmptyState = ({
  actions,
  align = 'center',
  description,
  icon: iconProp,
  level = 2,
  title,
}) => {
  const icon =
    iconProp && !iconProp.props.size
      ? cloneElement(iconProp, { size: 'xxlarge' })
      : iconProp;

  return (
    <Box gap="medium" align={align} flex={false} pad={{ vertical: 'large' }}>
      {icon}
      <Box align={align} gap="3xsmall">
        <Heading margin="none" level={level}>
          {title}
        </Heading>
        {description && (
          <Paragraph margin="none" textAlign={align}>
            {description}
          </Paragraph>
        )}
      </Box>
      {actions}
    </Box>
  );
};
