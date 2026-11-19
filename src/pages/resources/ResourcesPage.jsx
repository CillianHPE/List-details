import { Refresh } from '@hpe-design/icons-grommet';
import { AVAILABILITIES, resources } from '../../data/resources';
import { ListDetailPage } from '../../pattern/ListDetailPage';
import { ResourceDetail } from './ResourceDetail';
import { ResourceList } from './ResourceList';
import { AVAILABILITY_STATUS } from './ResourceStatus';

// Kubernetes · OpsRamp resources. The preview page's availability count
// cards become quick filters carrying the status icon; its Refresh page
// action becomes the toolbar's collection action.
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
    title="Kubernetes"
    backLabel="Resource categories"
    items={resources}
    matches={matches}
    quickFilters={QUICK_FILTERS}
    searchPlaceholder="Search resources"
    collectionAction={{ label: 'Refresh', icon: <Refresh /> }}
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
