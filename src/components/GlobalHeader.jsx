import { useContext } from 'react';
import {
  Box,
  Button,
  DropButton,
  Image,
  Page,
  PageContent,
  ResponsiveContext,
  Text,
  TextInput,
} from 'grommet';
import {
  Catalog,
  Help,
  Menu,
  Notification,
  Search,
  User,
} from '@hpe-design/icons-grommet';

// Mirrors hpe-design-system/sandbox/grommet-app GlobalHeader (v2 theme variant)
export const GlobalHeader = (props) => {
  const breakpoint = useContext(ResponsiveContext);
  return (
    <Page kind="full" flex={false} {...props}>
      <PageContent pad="none">
        <Box
          as="header"
          direction="row"
          justify="between"
          align="center"
          background="background-front"
          pad={{ horizontal: 'xsmall', vertical: 'small' }}
        >
          <Box direction="row" gap="medium" align="center" flex>
            <Box direction="row" gap="xsmall">
              <Button icon={<Menu />} a11yTitle="Toggle navigation" />
              <Box border={{ side: 'left', color: 'border-weak' }} />
            </Box>
            <Box height="32px" width="125px" align="start">
              <Image
                src="/hpe_greenlake_grn_pos_rgb.svg"
                fit="contain"
                alt="HPE GreenLake"
              />
            </Box>
            {!['xsmall', 'small'].includes(breakpoint) && (
              <Box width={breakpoint === 'medium' ? 'medium' : 'large'}>
                <TextInput
                  icon={<Search id="global-header-search" />}
                  placeholder="Type / to search assets, services, and more"
                  aria-labelledby="global-header-search"
                />
              </Box>
            )}
          </Box>
          <Box direction="row" gap="xsmall">
            <Button icon={<Help />} a11yTitle="Help" />
            <Button icon={<Catalog />} a11yTitle="Documentation" />
            <Button icon={<Notification />} a11yTitle="Notifications" />
            <DropButton
              icon={<User />}
              a11yTitle="Account"
              dropAlign={{ top: 'bottom', right: 'right' }}
              dropContent={
                <Box pad="medium" width="small">
                  <Text weight={500}>Alex Morgan</Text>
                  <Text size="small" color="text-weak">
                    Acme Production
                  </Text>
                </Box>
              }
            />
          </Box>
        </Box>
      </PageContent>
    </Page>
  );
};
