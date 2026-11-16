import { useEffect, useState } from 'react';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { DefaultShell } from './shell/DefaultShell';
import { V3Shell } from './shell/V3Shell';
import { UsersPage } from './pages/users/UsersPage';
import { AccountsPage } from './pages/accounts/AccountsPage';
import { CockpitPage } from './pages/cockpit/CockpitPage';
import { AnatomyPage } from './pages/anatomy/AnatomyPage';
import { users } from './data/users';
import { RecentActivity, UsersSummary } from './pages/users/PageContext';

// Versions are addressed by URL hash so they can be linked directly:
//   #/default  → Users in the default HPE shell
//   #/v3       → Users in App Shell V3.1 (Figma 3250:15494)
//   #/v3-few   → same, with only three users (short list, long detail)
//   #/v3-short → long list, one-facet detail (no tabs)
//   #/v3-context → list–detail with other page content above and below
//   #/accounts → Accounts (portfolio health data) in App Shell V3.1
//   #/accounts-cockpit → Accounts with Sales Cockpit content (Figma mNCeAPPHJ2E8NtLaJlqSpM)
//   #/anatomy  → lo-fi region/role map of the pattern
const VERSIONS = [
  'anatomy',
  'default',
  'v3',
  'v3-few',
  'v3-short',
  'v3-context',
  'accounts',
  'accounts-cockpit',
];
const fewUsers = users.slice(0, 3);
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
      {version === 'v3-few' && (
        <V3Shell>
          <UsersPage users={fewUsers} />
        </V3Shell>
      )}
      {version === 'v3-short' && (
        <V3Shell>
          <UsersPage detailVariant="short" />
        </V3Shell>
      )}
      {version === 'v3-context' && (
        <V3Shell>
          <UsersPage
            before={<UsersSummary users={users} />}
            after={<RecentActivity />}
          />
        </V3Shell>
      )}
      {version === 'accounts' && (
        <V3Shell>
          <AccountsPage />
        </V3Shell>
      )}
      {version === 'accounts-cockpit' && (
        <V3Shell appName="Sales Cockpit">
          <CockpitPage />
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
