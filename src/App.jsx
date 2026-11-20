import { useEffect, useState } from 'react';
import { Grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { hpe } from 'grommet-theme-hpe';
import { V3Shell } from './shell/V3Shell';
import { UsersPage } from './pages/users/UsersPage';
import { CockpitPage } from './pages/cockpit/CockpitPage';
import { ServersPage } from './pages/servers/ServersPage';
import { ResourcesPage } from './pages/resources/ResourcesPage';
import { AnatomyPage, PAGES } from './pages/anatomy/AnatomyPage';
import { sparseUsers } from './data/users';

// Figma Notification (HPE DS Components V2) stacks title and message with no
// gap; grommet-theme-hpe 8.2 puts 'medium' between them, so align to Figma.
const theme = deepMerge(hpe, {
  notification: { textContainer: { gap: 'none' } },
});

// Versions are addressed by URL hash so they can be linked directly:
//   #/anatomy  → Structure: lo-fi region/role map of the pattern
//   #/behaviour/<key>, #/responsive/<key>, #/states/<key> → documentation pages
//   #/v3       → Users in App Shell V3.1 (Figma 3250:15494)
//   #/v3-sparse → four users, little data yet (empty states, unavailable values)
//   #/accounts-cockpit → Accounts with Sales Cockpit content (Figma mNCeAPPHJ2E8NtLaJlqSpM)
//   #/compute-servers → Servers with Compute Ops Management content (FigJam FoohSpgNF5QhNv5d0se2ot)
//   #/opsramp-resources → Kubernetes resources, adapted from hpe-theme-preview detail-opsramp
const VERSIONS = [
  'anatomy',
  'v3',
  'v3-sparse',
  'accounts-cockpit',
  'compute-servers',
  'opsramp-resources',
];
// Old and group-level routes land on each group's first page
const REDIRECTS = {
  behaviour: 'behaviour/scroll',
  'behaviour/responsive': 'responsive/breakpoints',
  'behaviour/states': 'states/loading',
  responsive: 'responsive/breakpoints',
  'responsive/shell': 'responsive/shell-configs',
  states: 'states/loading',
  crit: 'crit/2026-11-19',
  pattern: 'pattern/what',
};
const readVersion = () => {
  const v = window.location.hash.replace(/^#\/?/, '');
  if (REDIRECTS[v]) return REDIRECTS[v];
  if (PAGES[v]) return v;
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
      theme={theme}
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
      {version === 'compute-servers' && (
        <V3Shell appName="Compute Ops Management">
          <ServersPage />
        </V3Shell>
      )}
      {version === 'opsramp-resources' && (
        <V3Shell appName="OpsRamp">
          <ResourcesPage />
        </V3Shell>
      )}
      {PAGES[version] &&
        (chrome ? (
          <V3Shell>
            <AnatomyPage
              route={version}
              chrome={chrome}
              onChromeChange={setChrome}
            />
          </V3Shell>
        ) : (
          <AnatomyPage
            route={version}
            chrome={chrome}
            onChromeChange={setChrome}
          />
        ))}
    </Grommet>
  );
};

export default App;
