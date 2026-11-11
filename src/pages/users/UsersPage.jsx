import { useContext, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Heading,
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
  {
    label: 'Suspended',
    value: 'suspended',
    test: (u) => u.status === 'Suspended',
  },
  { label: 'MFA off', value: 'nomfa', test: (u) => u.mfa !== 'Enabled' },
];

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
    <Box
      as="main"
      background="background-front"
      round="small"
      flex
      overflow="hidden"
    >
      {/* A · Page header — collection-level actions */}
      <Box
        direction="row"
        align="center"
        justify="between"
        pad={{ horizontal: 'medium', top: 'medium', bottom: 'small' }}
        gap="small"
        flex={false}
      >
        <Box direction="row" align="center" gap="xsmall">
          {stacked && showDetail && (
            <Button
              icon={<LinkPrev />}
              a11yTitle="Back to users"
              onClick={() => setShowDetail(false)}
            />
          )}
          <Heading level={1} size="small" margin="none">
            Users
          </Heading>
        </Box>
        <Button label="Invite user" primary />
      </Box>

      <Box direction="row" flex overflow="hidden">
        {/* B + C · List column */}
        {listVisible && (
          <Box
            width={stacked ? undefined : 'medium'}
            flex={stacked ? true : false}
            border={stacked ? undefined : { side: 'right', color: 'border-weak' }}
            overflow="hidden"
          >
            <Box
              pad={{ horizontal: 'medium', vertical: 'small' }}
              gap="xsmall"
              flex={false}
            >
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
          </Box>
        )}

        {/* D + E + F · Detail column */}
        {detailVisible && (
          <Box flex overflow="hidden">
            {selected ? (
              <UserDetail key={selected.id} user={selected} />
            ) : (
              <Box flex align="center" justify="center">
                <Text color="text-weak">Select a user to see details</Text>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
