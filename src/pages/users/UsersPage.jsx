import { ListDetailPage } from '../../pattern/ListDetailPage';
import { users as allUsers } from '../../data/users';
import { UserList } from './UserList';
import { UserDetail } from './UserDetail';

const QUICK_FILTERS = [
  { label: 'All', value: 'all', test: () => true },
  { label: 'Active', value: 'active', test: (u) => u.status === 'Active' },
  { label: 'Invited', value: 'invited', test: (u) => u.status === 'Invited' },
];

const matches = (u, q) =>
  u.name.toLowerCase().includes(q) ||
  u.email.toLowerCase().includes(q) ||
  u.role.toLowerCase().includes(q);

// Users list–detail page: the pattern surface comes from ListDetailPage;
// this file only supplies the user-specific data, row and detail.
// `users` lets a route render a sparse variant (e.g. three users) to study
// how the list zone behaves with little data.
export const UsersPage = ({
  users = allUsers,
  detailVariant = 'full',
  copy = {},
  before,
  after,
}) => (
  <ListDetailPage
    title={copy.title ?? 'Users'}
    subtitle={copy.subtitle ?? 'Manage who has access to this workspace.'}
    backLabel={copy.backLabel ?? 'All users'}
    items={users}
    matches={matches}
    quickFilters={QUICK_FILTERS}
    searchPlaceholder={copy.searchPlaceholder ?? 'Search users'}
    collectionAction={{ label: copy.addLabel ?? 'Add users' }}
    renderList={({ items, selectedId, onSelect }) => (
      <UserList users={items} selectedId={selectedId} onSelect={onSelect} />
    )}
    renderDetail={(user) => (
      <UserDetail key={user.id} user={user} variant={detailVariant} />
    )}
    noResultsText={copy.noResultsText ?? 'No users match your search.'}
    noSelectionText={copy.noSelectionText ?? 'Select a user to see details'}
    before={before}
    after={after}
  />
);

// Sparse route copy: a team page with its own wording.
export const SPARSE_COPY = {
  title: 'Team members',
  subtitle: 'People who can sign in to this team and what they can do.',
  backLabel: 'All members',
  searchPlaceholder: 'Search members',
  addLabel: 'Invite members',
  noResultsText: 'No members match your search.',
  noSelectionText: 'Select a member to see details',
};
