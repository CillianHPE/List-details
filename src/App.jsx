import { useEffect, useState } from 'react';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { DefaultShell } from './shell/DefaultShell';
import { V3Shell } from './shell/V3Shell';
import { UsersPage } from './pages/users/UsersPage';
import { AnatomyPage } from './pages/anatomy/AnatomyPage';
import { VersionSwitcher, VERSIONS } from './components/VersionSwitcher';

// Versions are addressed by URL hash so they can be linked directly:
//   #/default  → Users in the default HPE shell
//   #/v3       → Users in App Shell V3.1 (Figma 3250:15494)
//   #/anatomy  → lo-fi region/role map of the pattern
const readVersion = () => {
  const v = window.location.hash.replace(/^#\/?/, '');
  return VERSIONS.some((o) => o.value === v) ? v : 'default';
};

const App = () => {
  const [version, setVersion] = useState(readVersion);

  useEffect(() => {
    const onHash = () => setVersion(readVersion());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (v) => {
    window.location.hash = `/${v}`;
  };

  return (
    <Grommet
      theme={hpe}
      themeMode="light"
      background="background-back"
      full="min"
      options={{ box: { cssGap: true } }}
    >
      {version === 'v3' && (
        <V3Shell>
          <UsersPage />
        </V3Shell>
      )}
      {version === 'anatomy' && (
        <DefaultShell>
          <AnatomyPage />
        </DefaultShell>
      )}
      {version === 'default' && (
        <DefaultShell>
          <UsersPage />
        </DefaultShell>
      )}
      <VersionSwitcher value={version} onChange={go} />
    </Grommet>
  );
};

export default App;
