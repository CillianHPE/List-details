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
import { useShell } from '../../shell/ShellContext';

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
  // V3.1 shell: content sits directly on the white canvas, so the list–detail
  // surface drops its own container chrome (border, outer padding).
  const bare = useShell() === 'v3';
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

        {/* One contained surface holding both columns, split by a divider */}
        <ContentPane
          pad="none"
          overflow={bare ? undefined : 'hidden'}
          round={bare ? false : 'xlarge'}
        >
          <Grid columns={stacked ? ['auto'] : ['auto', 'flex']} align="start">
            {/* B + C · List pane */}
            {listVisible && (
              <Box
                width={stacked ? undefined : { min: 'medium', max: 'large' }}
                pad={stacked || bare ? undefined : { vertical: 'medium' }}
              >
                {/* Divider lives on the sticky inner box so it stops short of
                    the container edges rather than spanning its full height */}
                <Box
                  pad={
                    bare
                      ? stacked
                        ? { vertical: 'medium' }
                        : { right: 'medium' }
                      : stacked
                        ? 'medium'
                        : { horizontal: 'medium' }
                  }
                  gap="xsmall"
                  border={
                    stacked
                      ? undefined
                      : { side: 'right', color: 'border-weak' }
                  }
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
                  <Box overflow="auto" flex style={{ scrollbarColor: 'auto' }}>
                    <UserList
                      users={visible}
                      selectedId={selectedId}
                      onSelect={onSelect}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {/* D + E · Detail pane */}
            {detailVisible && (
              <Box
                pad={
                  bare ? (stacked ? undefined : { left: 'medium' }) : 'medium'
                }
              >
                {selected ? (
                  <UserDetail key={selected.id} user={selected} />
                ) : (
                  <Box pad="large" align="center" justify="center">
                    <Text color="text-weak">Select a user to see details</Text>
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </ContentPane>
      </PageContent>
    </Page>
  );
};
