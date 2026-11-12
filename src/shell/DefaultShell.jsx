import { Box } from 'grommet';
import { GlobalHeader } from '../components/GlobalHeader';
import { NavSidebar } from '../components/NavSidebar';
import { ShellContext, appHeight, stickyBelowHeader } from './ShellContext';

// Default HPE app shell (hpe-design-system/sandbox/grommet-app):
// Global header → [ NavSidebar | Page → PageContent → PageHeader + content ]
// The global header is sticky; the nav pins just below it while Main scrolls.
export { appHeight };

export const DefaultShell = ({ children }) => (
  <ShellContext.Provider value="default">
    <Box background="background-back" fill="vertical" flex>
      <GlobalHeader style={{ position: 'sticky', top: 0, zIndex: 2 }} />
      <Box direction="row">
        <NavSidebar height={appHeight} style={stickyBelowHeader()} />
        {children}
      </Box>
    </Box>
  </ShellContext.Provider>
);
