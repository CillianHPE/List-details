import { Add } from "@hpe-design/icons-grommet";
import { cockpitAccounts } from "../../data/cockpit";
import { ListDetailPage } from "../../pattern/ListDetailPage";
import { AccountList } from "../accounts/AccountList";
import { TIERS } from "../accounts/HealthIndicator";
import { CockpitDetail } from "./CockpitDetail";

const accountsByName = [...cockpitAccounts].sort((a, b) =>
  a.name.localeCompare(b.name),
);

// Accounts · Sales Cockpit. Pure list–detail: the Figma collection page's
// portfolio KPIs, tier chart and Data notes are intentionally left out so the
// surface stands alone.
const statusIcon = (tier) => {
  const { Icon, color } = TIERS[tier];
  return <Icon color={color} size="xsmall" aria-hidden />;
};

const QUICK_FILTERS = [
  { label: "All", value: "all", test: () => true },
  ...Object.keys(TIERS).map((tier) => ({
    label: tier,
    value: tier.toLowerCase().replace(" ", "-"),
    icon: statusIcon(tier),
    test: (a) => a.health.tier === tier,
  })),
];

const matches = (a, q) =>
  [a.name, a.industryLabel, a.location, a.type].some((v) =>
    v.toLowerCase().includes(q),
  );

export const CockpitPage = () => (
  <ListDetailPage
    title="Accounts"
    backLabel="Accounts"
    items={accountsByName}
    matches={matches}
    quickFilters={QUICK_FILTERS}
    searchPlaceholder="Search accounts"
    collectionAction={{ label: "Add account", icon: <Add /> }}
    renderList={({ items, selectedId, onSelect }) => (
      <AccountList
        accounts={items}
        selectedId={selectedId}
        onSelect={onSelect}
        statusLeading
      />
    )}
    renderDetail={(account) => (
      <CockpitDetail key={account.id} account={account} />
    )}
    noResultsText="No accounts match your search or filter."
    noSelectionText="Select an account to see its health, engagement and adoption."
  />
);
