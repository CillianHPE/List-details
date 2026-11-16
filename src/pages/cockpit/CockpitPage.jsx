import { Box, DataChart, Text } from 'grommet';
import { Add } from '@hpe-design/icons-grommet';
import { TIERS, cockpitAccounts, portfolio } from '../../data/cockpit';
import { ListDetailPage } from '../../pattern/ListDetailPage';
import { AccountList } from '../accounts/AccountList';
import { CockpitDetail } from './CockpitDetail';
import {
  Card,
  DataNotes,
  KpiCard,
  KpiRow,
  Legend,
  PeriodToggle,
  usePeriod,
} from './primitives';

// Accounts · Sales Cockpit. Content follows the Figma collection page
// (180:24254): portfolio KPIs and the engagement tier distribution sit above
// the list–detail surface as page context; Data notes sit below it once, as
// provenance for the whole page rather than per record.
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

const PortfolioContext = () => {
  const [period, setPeriod] = usePeriod();
  const { kpis, tierDistribution } = portfolio;
  const last = tierDistribution.months.at(-1);
  const total = TIERS.reduce((n, t) => n + last[t.key], 0);
  return (
    <Box gap="medium" margin={{ bottom: 'medium' }}>
      <KpiRow>
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </KpiRow>
      <Card
        title="Engagement tier distribution"
        subtitle={tierDistribution.caption}
        action={<PeriodToggle value={period} onChange={setPeriod} />}
      >
        <DataChart
          data={tierDistribution.months}
          series={[
            { property: 'month' },
            ...TIERS.map((t) => ({ property: t.key, label: t.label })),
          ]}
          chart={[
            {
              property: TIERS.map((t) => ({ property: t.key, color: t.color })),
              type: 'bars',
              thickness: 'medium',
            },
          ]}
          axis={{
            x: { property: 'month', granularity: 'fine' },
            y: { granularity: 'medium' },
          }}
          guide={{ y: { granularity: 'medium' } }}
          size={{ width: 'fill', height: 'small' }}
          legend={false}
        />
        <Legend
          items={TIERS.map((t) => ({
            ...t,
            value: `${Math.round((last[t.key] / total) * 100)}%`,
          }))}
        />
      </Card>
    </Box>
  );
};

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
    before={<PortfolioContext />}
    after={<DataNotes notes={portfolio.dataNotes} />}
  />
);
