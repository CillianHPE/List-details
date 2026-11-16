import { Add } from '@hpe-design/icons-grommet';
import { cockpitAccounts } from '../../data/cockpit';
import { ListDetailPage } from '../../pattern/ListDetailPage';
import { AccountList } from '../accounts/AccountList';
import { CockpitDetail } from './CockpitDetail';

// Accounts · Sales Cockpit. Pure list–detail: the Figma collection page's
// portfolio KPIs, tier chart and Data notes are intentionally left out so the
// surface stands alone.
const QUICK_FILTERS = [
  { label: 'All', value: 'all', test: () => true },
  {
    label: 'Healthy',
    value: 'healthy',
    test: (a) => a.health.tier === 'Healthy',
  },
  {
    label: 'Neutral',
    value: 'neutral',
    test: (a) => a.health.tier === 'Neutral',
  },
  {
    label: 'At risk',
    value: 'at-risk',
    test: (a) => a.health.tier === 'At risk',
  },
];

const matches = (a, q) =>
  [a.name, a.industryLabel, a.location, a.type].some((v) =>
    v.toLowerCase().includes(q),
  );

export const CockpitPage = () => (
  <ListDetailPage
    title="Accounts"
    backLabel="Accounts"
    items={cockpitAccounts}
    matches={matches}
    quickFilters={QUICK_FILTERS}
    searchPlaceholder="Search accounts"
    collectionAction={{ label: 'Add account', icon: <Add /> }}
    renderList={({ items, selectedId, onSelect }) => (
      <AccountList
        accounts={items}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    )}
    renderDetail={(account) => (
      <CockpitDetail key={account.id} account={account} />
    )}
    noResultsText="No accounts match your search or filter."
    noSelectionText="Select an account to see its health, engagement and adoption."
  />
);
