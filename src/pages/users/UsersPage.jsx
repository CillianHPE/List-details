import { forwardRef, useMemo, useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  CheckBox,
  Grid,
  Menu,
  Page,
  PageContent,
  PageHeader,
  Text,
  TextInput,
  ToggleGroup,
} from 'grommet';
import { Add, LinkPrev, More, Search } from '@hpe-design/icons-grommet';
import { useSurfaceTier } from '../../pattern/listDetail';
import { users } from '../../data/users';
import { UserList } from './UserList';
import { UserDetail } from './UserDetail';
import {
  APP_HEADER_HEIGHT,
  stickyBelowHeader,
  useShell,
} from '../../shell/ShellContext';

const QUICK_FILTERS = [
  { label: 'All', value: 'all', test: () => true },
  { label: 'Active', value: 'active', test: (u) => u.status === 'Active' },
  { label: 'Invited', value: 'invited', test: (u) => u.status === 'Invited' },
];

// Contained surface, as hpe-design-system/sandbox/grommet-app ContentPane
const ContentPane = forwardRef((props, ref) => (
  <Box
    ref={ref}
    background="background-front"
    pad="medium"
    round="small"
    {...props}
  />
));

// Zones: A page header · B list toolbar · C list body · D/E/F detail column.
// The surface sizes itself from its own width (not the viewport) because the
// shell's nav / context panes take width first — see Anatomy › Responsive:
//   comfortable ≥ 1000px  list clamps size.small–size.medium
//   compact     760–999px list pinned to size.small
//   drill-in    < 760px   one column, list → detail
export const UsersPage = () => {
  const { ref: surfaceRef, tier } = useSurfaceTier();
  const stacked = tier === 'drillIn';
  // V3.1 shell: content sits directly on the white canvas, so the list–detail
  // surface drops its own container chrome (border, outer padding).
  const bare = useShell() === 'v3';
  const [query, setQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(users[0].id);
  // Prototype control: show/hide the divider between list and detail.
  const [divider, setDivider] = useState(true);
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
  const clearFilters = () => {
    setQuery('');
    setQuickFilter('all');
  };

  // Page header actions fold by tier: comfortable shows everything; compact
  // moves secondaries to an overflow menu; drill-in reduces the primary to an
  // icon button as well.
  const dividerItem = {
    label: divider ? 'Hide divider' : 'Show divider',
    onClick: () => setDivider((d) => !d),
  };
  const headerActions =
    tier === 'comfortable' ? (
      <Box direction="row" align="center" gap="medium">
        <CheckBox
          toggle
          label="Divider"
          checked={divider}
          onChange={(e) => setDivider(e.target.checked)}
        />
        <Button label="Add users" secondary />
      </Box>
    ) : (
      <Box direction="row" align="center" gap="small">
        {tier === 'compact' ? (
          <Button label="Add users" secondary />
        ) : (
          <Button icon={<Add />} a11yTitle="Add users" secondary />
        )}
        <Menu
          icon={<More />}
          a11yTitle="More actions"
          dropAlign={{ top: 'bottom', right: 'right' }}
          items={[dividerItem]}
        />
      </Box>
    );

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
          actions={headerActions}
        />

        {/* One contained surface holding both columns, split by a divider */}
        <ContentPane
          ref={surfaceRef}
          pad="none"
          overflow={bare ? undefined : 'hidden'}
          round={bare ? false : 'xlarge'}
        >
          <Grid columns={stacked ? ['auto'] : ['auto', 'flex']} align="start">
            {/* B + C · List pane */}
            {listVisible && (
              <Box
                width={
                  stacked
                    ? undefined
                    : tier === 'compact'
                      ? 'small'
                      : { min: 'small', max: 'medium' }
                }
                pad={stacked || bare ? undefined : { vertical: 'medium' }}
                // Grid items default to min-width:auto, which would let the
                // toolbar's intrinsic width push the column past its token.
                style={stacked ? undefined : { minWidth: 0 }}
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
                    stacked || !divider
                      ? undefined
                      : { side: 'right', color: 'border-weak' }
                  }
                  style={stacked ? undefined : stickyBelowHeader(24)}
                  // Pinned 24px below the sticky global header; max height leaves
                  // room for that gap plus the pane and page bottom padding (72px)
                  // so the column never slides under the header at full scroll.
                  height={
                    stacked
                      ? undefined
                      : { max: `calc(100vh - ${APP_HEADER_HEIGHT + 96}px)` }
                  }
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
                    {visible.length ? (
                      <UserList
                        users={visible}
                        selectedId={selectedId}
                        onSelect={onSelect}
                      />
                    ) : (
                      // No results: message replaces the rows, toolbar stays,
                      // detail keeps the last selection.
                      <Box
                        pad={{ vertical: 'medium' }}
                        gap="small"
                        align="start"
                      >
                        <Text color="text-weak">
                          No users match your search.
                        </Text>
                        <Button label="Clear filters" onClick={clearFilters} />
                      </Box>
                    )}
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
