import { Grommet, Box } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { GlobalHeader } from './components/GlobalHeader';
import { NavSidebar } from './components/NavSidebar';
import { UsersPage } from './pages/users/UsersPage';

const App = () => (
  <Grommet
    theme={hpe}
    themeMode="light"
    background="background-back"
    full="min"
    options={{ box: { cssGap: true } }}
  >
    <Box height="100vh">
      <GlobalHeader />
      <Box direction="row" flex overflow="hidden" pad="xsmall" gap="xsmall">
        <NavSidebar />
        <Box flex overflow="hidden">
          <UsersPage />
        </Box>
      </Box>
    </Box>
  </Grommet>
);

export default App;
