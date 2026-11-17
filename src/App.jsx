import { useEffect, useState } from 'react';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { V3Shell } from './shell/V3Shell';
import { UsersPage } from './pages/users/UsersPage';
import { CockpitPage } from './pages/cockpit/CockpitPage';
import { AnatomyPage } from './pages/anatomy/AnatomyPage';
import { sparseUsers } from './data/users';

// Versions are addressed by URL hash so they can be linked directly:
//   #/anatomy  → Structure: lo-fi region/role map of the pattern
//   #/behaviour → Behaviour: how the surface responds
//   #/v3       → Users in App Shell V3.1 (Figma 3250:15494)
//   #/v3-sparse → four users, little data yet (empty states, unavailable values)
//   #/accounts-cockpit → Accounts with Sales Cockpit content (Figma mNCeAPPHJ2E8NtLaJlqSpM)
const VERSIONS = [
  'anatomy',
  'behaviour',
  'v3',
  'v3-sparse',
  'accounts-cockpit',
];
const readVersion = () => {
  const v = window.location.hash.replace(/^#\/?/, '');
  return VERSIONS.includes(v) ? v : 'v3';
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
      {version === 'v3-sparse' && (
        <V3Shell>
          <UsersPage users={sparseUsers} detailVariant="sparse" />
        </V3Shell>
      )}
      {version === 'accounts-cockpit' && (
        <V3Shell appName="Sales Cockpit">
          <CockpitPage />
        </V3Shell>
      )}
      {(version === 'anatomy' || version === 'behaviour') &&
        (chrome ? (
          <V3Shell>
            <AnatomyPage
              section={version === 'behaviour' ? 'behaviour' : 'structure'}
              chrome={chrome}
              onChromeChange={setChrome}
            />
          </V3Shell>
        ) : (
          <AnatomyPage
            section={version === 'behaviour' ? 'behaviour' : 'structure'}
            chrome={chrome}
            onChromeChange={setChrome}
          />
        ))}
    </Grommet>
  );
};

export default App;
