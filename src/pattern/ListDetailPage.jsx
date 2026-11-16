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
import { listWidthFor, useSurfaceTier } from './listDetail';
import {
  APP_HEADER_HEIGHT,
  stickyBelowHeader,
  useShell,
} from '../shell/ShellContext';

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

// The list–detail page, independent of what the records are. Zones:
//   A page header (page-level actions) · B list toolbar (collection actions)
//   C list body · D/E detail column.
// The surface sizes itself from its own width (not the viewport) because the
// shell's nav / context panes take width first — see Anatomy › Responsive:
//   comfortable ≥ 1000px  proportional 40 / 60
//   compact     760–999px same split, list floored at size.small
//   drill-in    < 760px   one column, list → detail
// Pages supply the data and the record-specific renderers:
//   items            records; each needs a stable `id`
//   matches(item,q)  free-text search predicate (q already lower-cased)
//   quickFilters     [{ label, value, test(item) }], first is the default
//   renderList       ({ items, selectedId, onSelect }) → list body
//   renderDetail     (item) → detail column content
//   collectionAction { label, icon } — trailing in the toolbar, beside search
export const ListDetailPage = ({
  title,
  subtitle,
  backLabel,
  items,
  matches,
  quickFilters,
  searchPlaceholder = 'Search',
  collectionAction,
  renderList,
  renderDetail,
  noResultsText = 'Nothing matches your search.',
  noSelectionText = 'Select an item to see details',
  before,
  after,
}) => {
  const { ref: surfaceRef, width: surfaceWidth, tier } = useSurfaceTier();
  const stacked = tier === 'drillIn';
  // V3.1 shell: content sits directly on the white canvas, so the list–detail
  // surface drops its own container chrome (border, outer padding).
  const bare = useShell() === 'v3';
  const [query, setQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState(quickFilters[0].value);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  // Prototype control: show/hide the divider between list and detail.
  const [divider, setDivider] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filter = quickFilters.find((f) => f.value === quickFilter);
    return items.filter(
      (item) => filter.test(item) && (!q || matches(item, q)),
    );
  }, [items, query, quickFilter, quickFilters, matches]);

  const selected = items.find((i) => i.id === selectedId) ?? null;
  const listVisible = !stacked || !showDetail;
  const detailVisible = !stacked || showDetail;

  const onSelect = (id) => {
    setSelectedId(id);
    setShowDetail(true);
  };
  const clearFilters = () => {
    setQuery('');
    setQuickFilter(quickFilters[0].value);
  };

  // Page header carries page-level controls only (things that act on the
  // surface, not the data). Collection actions live in the list toolbar.
  const dividerItem = {
    label: divider ? 'Hide divider' : 'Show divider',
    onClick: () => setDivider((d) => !d),
  };
  const headerActions =
    tier === 'comfortable' ? (
      <CheckBox
        toggle
        label="Divider"
        checked={divider}
        onChange={(e) => setDivider(e.target.checked)}
      />
    ) : (
      <Menu
        icon={<More />}
        a11yTitle="More actions"
        dropAlign={{ top: 'bottom', right: 'right' }}
        items={[dividerItem]}
      />
    );

  // Collection action: adds to the set the toolbar controls, so it sits
  // trailing in the toolbar beside search. Labelled when comfortable,
  // icon-only when the list column is narrow.
  const collectionButton =
    collectionAction &&
    (tier === 'comfortable' ? (
      <Button label={collectionAction.label} secondary />
    ) : (
      <Button
        icon={collectionAction.icon ?? <Add />}
        a11yTitle={collectionAction.label}
        secondary
      />
    ));

  return (
    <Page pad={{ bottom: 'xlarge' }}>
      <PageContent>
        {/* A · Page header — Grommet PageHeader (title / parent / actions slots) */}
        <PageHeader
          title={title}
          subtitle={subtitle}
          parent={
            stacked && showDetail ? (
              <Anchor
                icon={<LinkPrev />}
                label={backLabel}
                onClick={() => setShowDetail(false)}
              />
            ) : undefined
          }
          actions={headerActions}
        />

        {/* Page context describes the collection, so it steps aside while a
            single record is drilled into on the narrow tier. */}
        {!(stacked && showDetail) && before}

        {/* One contained surface holding both columns, split by a divider */}
        <ContentPane
          ref={surfaceRef}
          pad="none"
          overflow={bare ? undefined : 'hidden'}
          round={bare ? false : 'xlarge'}
        >
          {/* Proportional zones (Anatomy › Zones): list 40% / detail 60%,
              list floored at 256px (size.small), in whole px. */}
          <Grid
            columns={
              stacked
                ? ['auto']
                : [`${listWidthFor(surfaceWidth ?? 1440)}px`, 'flex']
            }
            // Columns stretch to the row height, so a short list still owns
            // the full height of the surface beside a long detail
            // (Anatomy › Scroll & height).
            align="stretch"
          >
            {/* B + C · List pane */}
            {listVisible && (
              <Box
                pad={stacked || bare ? undefined : { vertical: 'medium' }}
                // Grid items default to min-width:auto, which would let the
                // toolbar's intrinsic width override the fr share.
                style={stacked ? undefined : { minWidth: 0 }}
              >
                {/* Rail: fills the column so the divider runs the full height
                    of the surface (inset by the pane padding); the sticky
                    toolbar + rows box pins inside it. */}
                <Box
                  flex
                  border={
                    stacked || !divider
                      ? undefined
                      : { side: 'right', color: 'border-weak' }
                  }
                >
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
                      <Box direction="row" gap="small" align="center">
                        <Box flex>
                          <TextInput
                            icon={<Search />}
                            placeholder={searchPlaceholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                        </Box>
                        {collectionButton}
                      </Box>
                      <Box
                        overflow={{ horizontal: 'auto' }}
                        flex={false}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <ToggleGroup
                          options={quickFilters.map(({ label, value }) => ({
                            label,
                            value,
                          }))}
                          value={quickFilter}
                          onToggle={({ value }) =>
                            value && setQuickFilter(value)
                          }
                        />
                      </Box>
                      <Text size="small" color="text-weak">
                        {visible.length} items
                      </Text>
                    </Box>
                    <Box
                      overflow="auto"
                      flex
                      style={{ scrollbarColor: 'auto' }}
                    >
                      {visible.length ? (
                        renderList({ items: visible, selectedId, onSelect })
                      ) : (
                        // No results: message replaces the rows, toolbar stays,
                        // detail keeps the last selection.
                        <Box
                          pad={{ vertical: 'medium' }}
                          gap="small"
                          align="start"
                        >
                          <Text color="text-weak">{noResultsText}</Text>
                          <Button
                            label="Clear filters"
                            onClick={clearFilters}
                          />
                        </Box>
                      )}
                    </Box>
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
                  renderDetail(selected)
                ) : (
                  <Box pad="large" align="center" justify="center">
                    <Text color="text-weak">{noSelectionText}</Text>
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </ContentPane>

        {after}
      </PageContent>
    </Page>
  );
};
