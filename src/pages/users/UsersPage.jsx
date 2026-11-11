import { useContext, useMemo, useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  Grid,
  Page,
  PageContent,
  PageHeader,
  ResponsiveContext,
  Text,
  TextInput,
  ToggleGroup,
} from 'grommet';
import { LinkPrev, Search } from '@hpe-design/icons-grommet';
import { users } from '../../data/users';
import { UserList } from './UserList';
import { UserDetail } from './UserDetail';

const QUICK_FILTERS = [
  { label: 'All', value: 'all', test: () => true },
  { label: 'Active', value: 'active', test: (u) => u.status === 'Active' },
  { label: 'Invited', value: 'invited', test: (u) => u.status === 'Invited' },
];

// Contained surface, as hpe-design-system/sandbox/grommet-app ContentPane
const ContentPane = (props) => (
  <Box background="background-front" pad="medium" round="small" {...props} />
);

// Zones: A page header · B list toolbar · C list body · D/E/F detail column.
// On small screens the two columns become a drill-in (list → detail).
export const UsersPage = () => {
  const size = useContext(ResponsiveContext);
  const stacked = ['xsmall', 'small', 'medium'].includes(size);
  const [query, setQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(users[0].id);
  const [showDetail, setShowDetail] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesFilter = QUICK_FILTERS.find(
        (f) => f.value === quickFilter,
      ).test(u);
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, quickFilter]);

  const selected = users.find((u) => u.id === selectedId) ?? null;
  const listVisible = !stacked || !showDetail;
  const detailVisible = !stacked || showDetail;

  const onSelect = (id) => {
    setSelectedId(id);
    setShowDetail(true);
  };

  return (
    <Page pad={{ bottom: 'xlarge' }}>
      <PageContent>
        {/* A · Page header — Grommet PageHeader (title / parent / actions slots) */}
        <PageHeader
          title="Users"
          subtitle="Manage who has access to this workspace."
          parent={
            stacked && showDetail ? (
              <Anchor
                icon={<LinkPrev />}
                label="All users"
                onClick={() => setShowDetail(false)}
              />
            ) : undefined
          }
          actions={<Button label="Invite user" primary />}
        />

        <Grid
          columns={stacked ? ['auto'] : ['auto', 'flex']}
          gap="medium"
          align="start"
        >
          {/* B + C · List pane */}
          {listVisible && (
            <ContentPane
              gap="small"
              width={stacked ? undefined : { min: 'medium', max: 'large' }}
              style={stacked ? undefined : { position: 'sticky', top: 24 }}
              height={stacked ? undefined : { max: 'calc(100vh - 48px)' }}
            >
              <Box gap="xsmall" flex={false}>
                <TextInput
                  icon={<Search />}
                  placeholder="Search users"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Box
                  overflow={{ horizontal: 'auto' }}
                  flex={false}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <ToggleGroup
                    options={QUICK_FILTERS.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                    value={quickFilter}
                    onToggle={({ value }) => value && setQuickFilter(value)}
                  />
                </Box>
                <Text size="small" color="text-weak">
                  {visible.length} items
                </Text>
              </Box>
              <Box overflow="auto" flex>
                <UserList
                  users={visible}
                  selectedId={selectedId}
                  onSelect={onSelect}
                />
              </Box>
            </ContentPane>
          )}

          {/* D + E · Detail pane */}
          {detailVisible && (
            <ContentPane>
              {selected ? (
                <UserDetail key={selected.id} user={selected} />
              ) : (
                <Box pad="large" align="center" justify="center">
                  <Text color="text-weak">Select a user to see details</Text>
                </Box>
              )}
            </ContentPane>
          )}
        </Grid>
      </PageContent>
    </Page>
  );
};
