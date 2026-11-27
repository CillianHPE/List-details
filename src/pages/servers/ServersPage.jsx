import { Add } from '@hpe-design/icons-grommet';
import { needsAttention, servers } from '../../data/servers';
import { ListDetailPage } from '../../pattern/ListDetailPage';
import { ServerDetail } from './ServerDetail';
import { ServerList } from './ServerList';

// Servers · Fleet Manager. Pure list–detail: no summary charts or activity
// pane, so the surface stands alone. The list sorts by health, worst first.
const HEALTH_ORDER = { Critical: 0, Warning: 1, Unknown: 2, OK: 3 };
const serversByHealth = [...servers].sort(
  (a, b) =>
    HEALTH_ORDER[a.health] - HEALTH_ORDER[b.health] ||
    a.name.localeCompare(b.name),
);

const QUICK_FILTERS = [
  { label: 'All', value: 'all', test: () => true },
  { label: 'OK', value: 'ok', test: (s) => s.health === 'OK' },
  { label: 'Attention', value: 'attention', test: needsAttention },
  {
    label: 'Not connected',
    value: 'disconnected',
    test: (s) => s.state !== 'Connected',
  },
];

const matches = (s, q) =>
  [s.name, s.serial, s.model, s.group, s.mgmtIp].some((v) =>
    v.toLowerCase().includes(q),
  );

export const ServersPage = () => (
  <ListDetailPage
    title="Servers"
    backLabel="Servers"
    items={serversByHealth}
    matches={matches}
    quickFilters={QUICK_FILTERS}
    searchPlaceholder="Search servers"
    collectionAction={{ label: 'Add server', icon: <Add /> }}
    renderList={({ items, selectedId, onSelect }) => (
      <ServerList servers={items} selectedId={selectedId} onSelect={onSelect} />
    )}
    renderDetail={(server) => <ServerDetail key={server.id} server={server} />}
    noResultsText="No servers match your search or filter."
    noSelectionText="Select a server to see its overview, health, firmware and hardware."
  />
);
