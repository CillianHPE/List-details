import { useEffect, useState } from 'react';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { DefaultShell } from './shell/DefaultShell';
import { V3Shell } from './shell/V3Shell';
import { UsersPage } from './pages/users/UsersPage';
import { AnatomyPage } from './pages/anatomy/AnatomyPage';

// Versions are addressed by URL hash so they can be linked directly:
//   #/default  → Users in the default HPE shell
//   #/v3       → Users in App Shell V3.1 (Figma 3250:15494)
//   #/anatomy  → lo-fi region/role map of the pattern
const VERSIONS = ['anatomy', 'default', 'v3'];
const readVersion = () => {
  const v = window.location.hash.replace(/^#\/?/, '');
  return VERSIONS.includes(v) ? v : 'default';
};

const App = () => {
  const [version, setVersion] = useState(readVersion);
  // Anatomy only: hide the global header + nav so the page can be studied alone.
  const [chrome, setChrome] = useState(true);

  useEffect(() => {
    const onHash = () => setVersion(readVersion());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

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
      {version === 'anatomy' &&
        (chrome ? (
          <DefaultShell>
            <AnatomyPage chrome={chrome} onChromeChange={setChrome} />
          </DefaultShell>
        ) : (
          <AnatomyPage chrome={chrome} onChromeChange={setChrome} />
        ))}
      {version === 'default' && (
        <DefaultShell>
          <UsersPage />
        </DefaultShell>
      )}
    </Grommet>
  );
};

export default App;
