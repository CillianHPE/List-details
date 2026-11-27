import { useEffect, useState } from 'react';
import { Grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { hpe } from 'grommet-theme-hpe';
import { V3Shell } from './shell/V3Shell';
import { UsersPage, TEAM_COPY } from './pages/users/UsersPage';
import { CockpitPage } from './pages/cockpit/CockpitPage';
import { ServersPage } from './pages/servers/ServersPage';
import { ResourcesPage } from './pages/resources/ResourcesPage';
import { AnatomyPage, PAGES } from './pages/anatomy/AnatomyPage';
import { teamMembers } from './data/users';

// Figma Notification (HPE DS Components V2) stacks title and message with no
// gap; grommet-theme-hpe 8.2 puts 'medium' between them, so align to Figma.
const theme = deepMerge(hpe, {
  notification: { textContainer: { gap: 'none' } },
  // Crit 19 Nov: name–value rows read loose at the theme's xsmall (12px);
  // tighten to xxsmall (8px) so pairs group as 1 list (Micro tier).
  nameValueList: { gap: { row: 'xxsmall' } },
});

// Versions are addressed by URL hash so they can be linked directly:
//   #/anatomy  → Structure: lo-fi region/role map of the pattern
//   #/behaviour/<key>, #/responsive/<key>, #/states/<key> → documentation pages
//   #/v3       → Users in App Shell V3.1 (Figma 3250:15494)
//   #/team-members → Team members, a generic team-access page (24 members)
//   #/accounts-cockpit → Accounts with Sales Cockpit content (Figma mNCeAPPHJ2E8NtLaJlqSpM)
//   #/compute-servers → Fleet servers: health, firmware, hardware, storage, support
//   #/opsramp-resources → Monitored cluster nodes: alerts, overview, related, attributes
const VERSIONS = [
  'anatomy',
  'v3',
  'team-members',
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
  'v3-sparse': 'team-members',
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
      {version === 'team-members' && (
        <V3Shell>
          <UsersPage
            users={teamMembers}
            detailVariant="team"
            copy={TEAM_COPY}
          />
        </V3Shell>
      )}
      {version === 'accounts-cockpit' && (
        <V3Shell appName="Sales Cockpit">
          <CockpitPage />
        </V3Shell>
      )}
      {version === 'compute-servers' && (
        <V3Shell appName="Fleet Manager">
          <ServersPage />
        </V3Shell>
      )}
      {version === 'opsramp-resources' && (
        <V3Shell appName="Monitoring">
          <ResourcesPage />
        </V3Shell>
      )}
      {PAGES[version] && (
        <V3Shell chrome={chrome} onChromeChange={setChrome}>
          <AnatomyPage route={version} />
        </V3Shell>
      )}
    </Grommet>
  );
};

export default App;
