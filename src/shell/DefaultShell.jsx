import { Box } from 'grommet';
import { GlobalHeader } from '../components/GlobalHeader';
import { NavSidebar } from '../components/NavSidebar';
import { ShellContext } from './ShellContext';

// Default HPE app shell (hpe-design-system/sandbox/grommet-app):
// Global header → [ NavSidebar | Page → PageContent → PageHeader + content ]
const appHeaderHeight = '60px';
export const appHeight = `calc(100vh - ${appHeaderHeight})`;

export const DefaultShell = ({ children }) => (
  <ShellContext.Provider value="default">
    <Box background="background-back" fill="vertical" flex>
      <GlobalHeader />
      <Box direction="row">
        <NavSidebar height={appHeight} />
        {children}
      </Box>
    </Box>
  </ShellContext.Provider>
);
