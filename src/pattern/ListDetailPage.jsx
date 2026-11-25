import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Anchor,
  Box,
  Button,
  Grid,
  Page,
  PageContent,
  PageHeader,
  Select,
  Text,
  TextInput,
  ToggleGroup,
} from "grommet";
import { Add, LinkPrev, Search } from "@hpe-design/icons-grommet";
import { listWidthFor, useSurfaceTier } from "./listDetail";
import {
  APP_HEADER_HEIGHT,
  stickyBelowHeader,
  usePrototype,
  useShell,
} from "../shell/ShellContext";

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

// Quick filters: a ToggleGroup while the list column can hold every option
// on one line; otherwise a Select, so nothing scrolls or clips. The group's
// natural width is measured once (the options do not change), then compared
// with the column on every resize.
const QuickFilters = ({ options, value, onChange }) => {
  const wrapRef = useRef(null);
  const groupRef = useRef(null);
  const [naturalWidth, setNaturalWidth] = useState(null);
  const [available, setAvailable] = useState(Infinity);
  useLayoutEffect(() => {
    if (groupRef.current && naturalWidth === null) {
      setNaturalWidth(groupRef.current.scrollWidth);
    }
  }, [naturalWidth]);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) =>
      setAvailable(entry.contentRect.width),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const collapse = naturalWidth !== null && naturalWidth > available;
  return (
    <Box ref={wrapRef} flex={false}>
      {collapse ? (
        <Select
          options={options}
          labelKey="label"
          valueKey={{ key: "value", reduce: true }}
          value={value}
          onChange={({ value: next }) => onChange(next)}
          icon
          a11yTitle="Quick filter"
        />
      ) : (
        <Box ref={groupRef} alignSelf="start" style={{ whiteSpace: "nowrap" }}>
          <ToggleGroup
            options={options}
            value={value}
            onToggle={({ value: next }) => next && onChange(next)}
          />
        </Box>
      )}
    </Box>
  );
};

// The list–detail page, independent of what the records are. Zones:
//   A page header (page-level actions) · B list toolbar (collection actions)
//   C list body · D/E detail column.
// The surface sizes itself from its own width (not the viewport) because the
// shell's nav / context panes take width first — see Anatomy › Responsive:
//   comfortable ≥ 1000px  proportional 40 / 60
//   compact     784–999px same split, list floored at size.small
//   drill-in    < 784px   one column, list → detail
// Pages supply the data and the record-specific renderers:
//   items            records; each needs a stable `id`
//   matches(item,q)  free-text search predicate (q already lower-cased)
//   quickFilters     [{ label, value, icon?, test(item) }], first is the default
//   renderList       ({ items, selectedId, onSelect }) → list body
//   renderDetail     (item) → detail column content
//   collectionAction { label, icon } — trailing in the toolbar, beside search
//   pageAction       { label, icon } — page-level action in the page header
export const ListDetailPage = ({
  title,
  subtitle,
  backLabel,
  items,
  matches,
  quickFilters,
  searchPlaceholder = "Search",
  collectionAction,
  pageAction,
  renderList,
  renderDetail,
  noResultsText = "Nothing matches your search.",
  noSelectionText = "Select an item to see details",
  before,
  after,
}) => {
  const { ref: surfaceRef, width: surfaceWidth, tier } = useSurfaceTier();
  const stacked = tier === "drillIn";
  // V3.1 shell: content sits directly on the white canvas, so the list–detail
  // surface drops its own container chrome (border, outer padding).
  const bare = useShell() === "v3";
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState(quickFilters[0].value);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  // Prototype controls (contained list, scroll) live in the global header.
  const {
    contained,
    containedDetail,
    wrapped,
    pageScroll,
    smallGap,
    mediumGap,
  } = usePrototype();
  // Grey wrapper: the whole surface is 1 background-back container, the list
  // sits on it bare and the detail becomes a white card, so the list's own
  // contained surface is dropped while this is on.
  const listContained = contained && !wrapped;
  const detailContained = containedDetail && !wrapped;
  const [showDetail, setShowDetail] = useState(false);
  // Narrow entry (crit 19 Nov): when the surface drops to 1 column with a
  // record already selected, land on that record, matching the wide view;
  // the page header's back link returns to the list.
  useEffect(() => {
    if (stacked && selectedId !== null) setShowDetail(true);
  }, [stacked]); // eslint-disable-line react-hooks/exhaustive-deps
  // The surface always fills the available view height: measure its distance
  // from the document top so it can end level with the side nav (12px above
  // the viewport edge) without the page needing to scroll.
  const [surfaceTop, setSurfaceTop] = useState(0);
  useLayoutEffect(() => {
    if (stacked || !surfaceRef.current) return undefined;
    const measure = () => {
      const r = surfaceRef.current.getBoundingClientRect();
      setSurfaceTop(Math.ceil(r.top + window.scrollY));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [surfaceRef, stacked, showDetail]);
  // Stacked (narrow) layouts fall back to the page as scroll container, as
  // does the default full-page scroll: the list toolbar and the
  // detail tab bar then pin below the global header instead.
  const fillHeight = !stacked && !pageScroll;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filter = quickFilters.find((f) => f.value === quickFilter);
    return items.filter(
      (item) => filter.test(item) && (!q || matches(item, q)),
    );
  }, [items, query, quickFilter, quickFilters, matches]);

  const quickFilterOptions = useMemo(
    () =>
      quickFilters.map(({ label, value, icon }) => ({ label, value, icon })),
    [quickFilters],
  );

  const selected = items.find((i) => i.id === selectedId) ?? null;
  const listVisible = !stacked || !showDetail;
  const detailVisible = !stacked || showDetail;

  const onSelect = (id) => {
    setSelectedId(id);
    setShowDetail(true);
  };
  const clearFilters = () => {
    setQuery("");
    setQuickFilter(quickFilters[0].value);
  };

  // Page header carries page-level controls only (things that act on the
  // surface, not the data). Collection actions live in the list toolbar.
  const pageActionButton =
    pageAction &&
    (tier === "comfortable" ? (
      <Button label={pageAction.label} icon={pageAction.icon} />
    ) : (
      <Button
        icon={pageAction.icon}
        a11yTitle={pageAction.label}
        tip={pageAction.label}
      />
    ));
  const headerActions = pageActionButton ? (
    <Box flex={false} style={{ whiteSpace: "nowrap", minWidth: "max-content" }}>
      {pageActionButton}
    </Box>
  ) : undefined;

  // Collection action: adds to the set the toolbar controls, so it sits
  // trailing in the toolbar beside search. Labelled when comfortable,
  // icon-only when the list column is narrow.
  const collectionButton =
    collectionAction &&
    (tier === "comfortable" ? (
      <Button label={collectionAction.label} secondary />
    ) : (
      <Button
        icon={collectionAction.icon ?? <Add />}
        a11yTitle={collectionAction.label}
        secondary
      />
    ));

  return (
    <Page pad={fillHeight ? undefined : { bottom: "xlarge" }}>
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

        {/* One surface holding both columns, separated by the gutter */}
        <ContentPane
          ref={surfaceRef}
          pad={wrapped && !stacked ? "medium" : "none"}
          overflow={bare && !wrapped ? undefined : "hidden"}
          round={wrapped ? "large" : bare ? false : "xlarge"}
          background={wrapped ? "background-back" : "background-front"}
        >
          {/* Proportional zones (Anatomy › Zones): list 40% / detail 60%,
              list floored at 256px (size.small), in whole px. */}
          <Grid
            columns={
              stacked
                ? ["auto"]
                : [`${listWidthFor(surfaceWidth ?? 1440)}px`, "flex"]
            }
            // Columns stretch to the row height, so a short list still owns
            // the full height of the surface beside a long detail
            // (Anatomy › Scroll & height).
            align="stretch"
            // List and detail are sibling content sections inside the primary
            // content area, so the gutter between them is a true gap:
            // 48px (edgeSize.xlarge). No divider, no split padding. The gutter
            // prototype options swap in small (16px) or medium (24px) to compare.
            gap={
              stacked
                ? undefined
                : wrapped || mediumGap
                  ? "medium"
                  : smallGap
                    ? "small"
                    : "xlarge"
            }
            height={
              fillHeight
                ? `calc(100vh - ${surfaceTop + 12 + (wrapped ? 48 : 0)}px)`
                : undefined
            }
            style={fillHeight ? { minHeight: 0 } : undefined}
          >
            {/* B + C · List pane */}
            {listVisible && (
              <Box
                pad={
                  stacked || bare || wrapped
                    ? undefined
                    : { vertical: "medium" }
                }
                // Grid items default to min-width:auto, which would let the
                // toolbar's intrinsic width override the fr share.
                style={stacked ? undefined : { minWidth: 0 }}
              >
                {/* Rail: fills the column; the sticky toolbar + rows box
                    pins inside it. */}
                <Box flex>
                  <Box
                    pad={
                      listContained
                        ? "small"
                        : bare || wrapped
                          ? stacked
                            ? { vertical: "medium" }
                            : undefined
                          : stacked
                            ? "medium"
                            : { left: "medium" }
                    }
                    gap="xsmall"
                    style={
                      stacked
                        ? undefined
                        : fillHeight
                          ? { minHeight: 0 }
                          : stickyBelowHeader(24)
                    }
                    flex={fillHeight ? true : undefined}
                    // Contained: the whole list zone (toolbar, filters, count,
                    // rows) sits on a background-contrast surface, same
                    // treatment as the detail cards
                    background={listContained ? "background-back" : undefined}
                    round={listContained ? "medium" : undefined}
                    margin={
                      listContained && !stacked
                        ? bare
                          ? { right: "medium" }
                          : { horizontal: "medium" }
                        : undefined
                    }
                    // Pinned 24px below the sticky global header; max height leaves
                    // room for that gap plus the pane and page bottom padding (72px)
                    // so the column never slides under the header at full scroll.
                    height={
                      stacked
                        ? undefined
                        : fillHeight
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
                      <QuickFilters
                        options={quickFilterOptions}
                        value={quickFilter}
                        onChange={setQuickFilter}
                      />
                      <Text size="small" color="text-weak">
                        {visible.length} items
                      </Text>
                    </Box>
                    <Box
                      overflow="auto"
                      flex
                      style={{ scrollbarColor: "auto" }}
                    >
                      {visible.length ? (
                        renderList({ items: visible, selectedId, onSelect })
                      ) : (
                        // No results: message replaces the rows, toolbar stays,
                        // detail keeps the last selection.
                        <Box
                          pad={{ vertical: "medium" }}
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
                // List and detail are sibling zones inside the primary
                // content area; the 48px gutter is the Grid gap above.
                pad={
                  wrapped
                    ? "medium"
                    : detailContained
                      ? "small"
                      : bare
                        ? undefined
                        : {
                            vertical: "medium",
                            right: "medium",
                            left: stacked ? "medium" : undefined,
                          }
                }
                // Contained detail: the zone sits on its own background-back
                // surface, same treatment as the contained list, so the
                // outer offset moves from padding to margin.
                margin={
                  detailContained && !bare
                    ? {
                        vertical: "medium",
                        right: "medium",
                        left: stacked ? "medium" : undefined,
                      }
                    : undefined
                }
                // Grey wrapper: detail is the 1 white card on the grey
                // surface (Oliver's sketch), so it carries its own chrome.
                background={
                  wrapped
                    ? "background-front"
                    : detailContained
                      ? "background-back"
                      : undefined
                }
                round={wrapped || detailContained ? "medium" : undefined}
                overflow={fillHeight ? "auto" : undefined}
                style={fillHeight ? { minHeight: 0 } : undefined}
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
