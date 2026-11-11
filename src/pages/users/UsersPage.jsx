import { useContext, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Menu,
  ResponsiveContext,
  Text,
  TextInput,
  Toolbar,
} from 'grommet';
import { Filter, LinkPrev, Search } from '@hpe-design/icons-grommet';
import { users } from '../../data/users';
import { UserList } from './UserList';
import { UserDetail } from './UserDetail';

// Zones: A page header · B list toolbar · C list body · D/E/F detail column.
// On small screens the two columns become a drill-in (list → detail).
export const UsersPage = () => {
  const size = useContext(ResponsiveContext);
  const stacked = ['xsmall', 'small', 'medium'].includes(size);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(users[0].id);
  const [showDetail, setShowDetail] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [query]);

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
        <Box direction="row" gap="small">
          <Menu
            label="Actions"
            kind="toolbar"
            items={[
              { label: 'Export users (CSV)' },
              { label: 'Bulk import' },
              { label: 'Manage invitations' },
            ]}
          />
          <Button label="Invite user" primary />
        </Box>
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
              <Toolbar>
                <Box flex>
                  <TextInput
                    icon={<Search />}
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </Box>
                <Button icon={<Filter />} kind="toolbar" a11yTitle="Filter" />
                <Menu
                  label="Action"
                  kind="toolbar"
                  items={[{ label: 'Select all' }, { label: 'Export selection' }]}
                />
              </Toolbar>
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
