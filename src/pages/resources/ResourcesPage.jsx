import { Add, Refresh } from '@hpe-design/icons-grommet';
import { AVAILABILITIES, resources } from '../../data/resources';
import { ListDetailPage } from '../../pattern/ListDetailPage';
import { ResourceDetail } from './ResourceDetail';
import { ResourceList } from './ResourceList';
import { AVAILABILITY_STATUS } from './ResourceStatus';

// Monitored resources. Availability counts become quick filters carrying the
// status icon. Refresh acts on the page, so it stays in the page header;
// adding a resource acts on the collection, so it sits in the list toolbar
// beside search.
const statusIcon = (a) => {
  const { Icon, color } = AVAILABILITY_STATUS[a];
  return <Icon color={color} size="xsmall" aria-hidden />;
};

const QUICK_FILTERS = [
  { label: 'All', value: 'all', test: () => true },
  ...AVAILABILITIES.map((a) => ({
    label: a,
    value: a.toLowerCase(),
    icon: statusIcon(a),
    test: (r) => r.availability === a,
  })),
];

const matches = (r, q) =>
  [r.name, r.ip, r.make, r.model, r.cluster].some((v) =>
    v.toLowerCase().includes(q),
  );

export const ResourcesPage = () => (
  <ListDetailPage
    title="Clusters"
    backLabel="Resource categories"
    items={resources}
    matches={matches}
    quickFilters={QUICK_FILTERS}
    searchPlaceholder="Search resources"
    pageAction={{ label: 'Refresh', icon: <Refresh /> }}
    collectionAction={{ label: 'Add resource', icon: <Add /> }}
    renderList={({ items, selectedId, onSelect }) => (
      <ResourceList
        resources={items}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    )}
    renderDetail={(resource) => (
      <ResourceDetail key={resource.id} resource={resource} />
    )}
    noResultsText="No resources match your search or filter."
    noSelectionText="Select a resource to see its alerts, overview and related resources."
  />
);
