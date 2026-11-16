import { Add } from '@hpe-design/icons-grommet';
import { accounts } from '../../data/accounts';
import { ListDetailPage } from '../../pattern/ListDetailPage';
import { AccountList } from './AccountList';
import { AccountDetail } from './AccountDetail';

// Accounts list–detail: the redesigned account page's dropdown chooser becomes
// the list zone; its metadata row becomes the detail header; its tab bar
// becomes the detail facets.
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
  [a.name, a.industry, a.country, a.type].some((v) =>
    v.toLowerCase().includes(q),
  );

export const AccountsPage = () => (
  <ListDetailPage
    title="Accounts"
    subtitle="Health, adoption and engagement across customer accounts."
    backLabel="All accounts"
    items={accounts}
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
      <AccountDetail key={account.id} account={account} />
    )}
    noResultsText="No accounts match your search or filter."
    noSelectionText="Select an account to see its health and configuration."
  />
);
