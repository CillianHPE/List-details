import { Grommet, Box } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { GlobalHeader } from './components/GlobalHeader';
import { NavSidebar } from './components/NavSidebar';
import { UsersPage } from './pages/users/UsersPage';

// Default HPE app shell (hpe-design-system/sandbox/grommet-app):
// Global header → [ NavSidebar | Page → PageContent → PageHeader + content ]
const appHeaderHeight = '60px';
export const appHeight = `calc(100vh - ${appHeaderHeight})`;

const App = () => (
  <Grommet
    theme={hpe}
    themeMode="light"
    background="background-back"
    full="min"
    options={{ box: { cssGap: true } }}
  >
    <GlobalHeader />
    <Box direction="row">
      <NavSidebar height={appHeight} />
      <UsersPage />
    </Box>
  </Grommet>
);

export default App;
