import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Button,
  CheckBox,
  Collapsible,
  DropButton,
  Image,
  Layer,
  Menu,
  Nav,
  ResponsiveContext,
  Text,
  TextInput,
} from "grommet";
import {
  AIGenFill,
  Catalog,
  Close,
  Configure,
  Down,
  Up,
  Help,
  Menu as MenuIcon,
  Notification,
  Search,
  Sidebar as SidebarIcon,
  User,
} from "@hpe-design/icons-grommet";
import {
  activeNavItem,
  navItems,
  selectNavItem,
  usePersistedState,
} from "../components/NavSidebar";
import {
  APP_HEADER_HEIGHT,
  PrototypeContext,
  ShellContext,
  stickyBelowHeader,
  usePrototype,
} from "./ShellContext";

// Prototype switches for the list–detail surface. Tucked behind 1 icon button
// in the global header so they stay out of the way but are 1 click to reach.
const PrototypeSwitches = ({ chrome, onChromeChange }) => {
  const {
    contained,
    containedDetail,
    containedContent,
    wrapped,
    contextPane,
    keepTab,
    pageScroll,
    setContained,
    setContainedDetail,
    setContainedContent,
    setWrapped,
    setContextPane,
    setKeepTab,
    setPageScroll,
  } = usePrototype();
  const [open, setOpen] = useState(false);
  // Grouped by what they change: how the 2 zones are framed, how the page
  // behaves while in use, and the shell around the page.
  const groups = [
    [
      "Containment",
      [
        ["Contained list", contained, setContained],
        ["Contained detail", containedDetail, setContainedDetail],
        ["Contained content", containedContent, setContainedContent],
        ["Grey wrapper (experimental)", wrapped, setWrapped],
      ],
    ],
    [
      "Behaviour",
      [
        ["Keep tab across records", keepTab, setKeepTab],
        ["Detail-pane scroll", !pageScroll, (v) => setPageScroll(!v)],
      ],
    ],
    [
      "Shell",
      [
        ["Context pane", contextPane, setContextPane],
        ...(onChromeChange ? [["App chrome", chrome, onChromeChange]] : []),
      ],
    ],
  ];
  return (
    <DropButton
      icon={<Configure />}
      size="small"
      a11yTitle="Prototype options"
      tip="Prototype options"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      dropAlign={{ top: "bottom", right: "right" }}
      dropProps={{ round: "small", margin: { top: "xsmall" } }}
      dropContent={
        <Box pad="medium" gap="medium" width="small">
          <Text size="small" weight={500} color="text-weak">
            Prototype options
          </Text>
          {groups.map(([heading, switches]) => (
            <Box key={heading} gap="small">
              <Text size="xsmall" weight={500} color="text-weak">
                {heading}
              </Text>
              {switches.map(([label, value, set]) => (
                <CheckBox
                  key={label}
                  toggle
                  label={label}
                  checked={value}
                  onChange={(e) => set(e.target.checked)}
                />
              ))}
            </Box>
          ))}
        </Box>
      }
    />
  );
};

// App Shell V3.1 (Figma: Landmark Surface examples → 3250:15494).
// White canvas · 60px bordered global header · 12px wrapper holding a rounded
// grey navigation pane (256px, radius large) beside the main content column.

const GlobalHeaderV3 = ({ switches }) => {
  const size = useContext(ResponsiveContext);
  const compact = ["xsmall", "small"].includes(size);
  return (
    <Box
      as="header"
      direction="row"
      align="center"
      gap="xsmall"
      height="60px"
      flex={false}
      background="background-front"
      border={{ side: "bottom", color: "border-weak" }}
      style={{ position: "sticky", top: 0, zIndex: 2 }}
      pad={{ horizontal: compact ? "medium" : "xlarge" }}
    >
      <Box direction="row" align="center" gap="medium" flex>
        <Button
          icon={<MenuIcon />}
          size="small"
          a11yTitle="Toggle navigation"
        />
        <Box height="24px" width="93px" flex={false}>
          <Image
            src={`${import.meta.env.BASE_URL}greenlake_by_hpe.svg`}
            fit="contain"
            alt="GreenLake by HPE"
          />
        </Box>
        {!compact && (
          <>
            <Menu
              size="small"
              label="Workspace Name"
              icon={<Down />}
              reverse
              items={[
                { label: "Acme Production" },
                { label: "Acme Staging" },
                { label: "Switch workspace…" },
              ]}
            />
            <Box width="288px">
              <TextInput
                size="small"
                icon={<Search id="global-header-v3-search" />}
                placeholder="Search"
                aria-labelledby="global-header-v3-search"
              />
            </Box>
          </>
        )}
      </Box>
      <Box direction="row" align="center" gap="3xsmall" flex={false}>
        {switches}
        <Button
          icon={<AIGenFill color="brand" />}
          size="small"
          a11yTitle="AI assistant"
        />
        <Button
          icon={<Notification />}
          size="small"
          a11yTitle="Notifications"
        />
        <Button icon={<Help />} size="small" a11yTitle="Help" />
        <Button icon={<Catalog />} size="small" a11yTitle="Documentation" />
        <DropButton
          icon={<User />}
          size="small"
          a11yTitle="Account"
          dropAlign={{ top: "bottom", right: "right" }}
          dropContent={
            <Box pad="medium" width="small">
              <Text weight={500}>Alex Morgan</Text>
              <Text size="small" color="text-weak">
                Acme Production
              </Text>
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

// Global Header V2, application variant (HPE DS template → "Global Header",
// Figma mNCeAPPHJ2E8NtLaJlqSpM / 103:11776): HPE logo + "HPE <app name>"
// leading, a single account button trailing. No search, workspace or tools.
const GlobalHeaderApp = ({ appName, switches }) => {
  const size = useContext(ResponsiveContext);
  const compact = ["xsmall", "small"].includes(size);
  return (
    <Box
      as="header"
      direction="row"
      align="center"
      justify="between"
      height="60px"
      flex={false}
      background="background-front"
      border={{ side: "bottom", color: "border-weak" }}
      style={{ position: "sticky", top: 0, zIndex: 2 }}
      pad={{ horizontal: compact ? "medium" : "xlarge", vertical: "xsmall" }}
    >
      <Box direction="row" align="center" gap="medium" flex={false}>
        <Box height="24px" width="48px" flex={false}>
          <Image
            src={`${import.meta.env.BASE_URL}hpe_logo.svg`}
            fit="contain"
            alt="HPE"
          />
        </Box>
        <Text>
          <Text weight={600}>HPE</Text> {appName}
        </Text>
      </Box>
      <Box direction="row" align="center" gap="3xsmall" flex={false}>
        {switches}
        <DropButton
          icon={<User />}
          size="small"
          a11yTitle="Account"
          dropAlign={{ top: "bottom", right: "right" }}
          dropContent={
            <Box pad="medium" width="small">
              <Text weight={500}>Alex Morgan</Text>
              <Text size="small" color="text-weak">
                alex.morgan@hpe.com
              </Text>
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

// Nav item (NavigationMenu/NavItem): 36px min height, radius small, 4×24
// brand bar when selected. `level` indents children of an expandable parent
// by widening the gap after the marker, as ItemContainer does.
const levelGap = ["xxsmall", "small", "medium", "large"];
const NavItemV3 = ({
  item,
  selected,
  onSelect,
  level = 0,
  actions,
  ...rest
}) => (
  <Button
    plain
    onClick={() => onSelect(item)}
    aria-current={selected ? "page" : undefined}
    hoverIndicator="background-contrast"
    style={{ borderRadius: 8 }}
    {...rest}
  >
    <Box
      direction="row"
      align="center"
      gap={levelGap[Math.min(level, levelGap.length - 1)]}
      height={{ min: "36px" }}
      pad={{
        left: "3xsmall",
        right: "xxsmall",
        vertical: item.description ? "xxsmall" : "3xsmall",
      }}
      round="small"
      background={selected ? "background-contrast" : undefined}
    >
      <Box
        width="4px"
        round="medium"
        background={selected ? "brand" : undefined}
        flex={false}
        alignSelf="stretch"
      />
      <Box flex>
        <Text weight={selected ? 500 : undefined}>{item.label}</Text>
        {item.description && (
          <Text size="small" color="text-weak">
            {item.description}
          </Text>
        )}
      </Box>
      {actions}
    </Box>
  </Button>
);

// Expandable parent (NavigationMenu/NavList): a regular nav item whose
// trailing action is the Up/Down chevron; children sit one level deeper.
// Parents start open and re-open whenever the route moves into them.
// Groups that start a new section of the nav, separated by a divider.
const NAV_DIVIDER_BEFORE = ["Anatomy", "Examples", "Design crit"];
// Groups rendered as a static header with top-level links, not a collapsible.
const NAV_HEADER_GROUPS = ["Pattern", "Examples"];

const NavGroupHeader = ({ label }) => (
  <Box
    pad={{ left: "xsmall", right: "xxsmall", top: "xxsmall" }}
    height={{ min: "36px" }}
    justify="center"
  >
    <Text size="small" weight={500} color="text-weak">
      {label}
    </Text>
  </Box>
);

const NavDivider = () => (
  <Box
    border={{ side: "bottom", color: "border-weak" }}
    margin={{ vertical: "xsmall", horizontal: "xsmall" }}
    flex={false}
  />
);

const NavGroupV3 = ({ group, items, open, onToggle, selected, onSelect }) => (
  <Box>
    <NavItemV3
      item={{ label: group }}
      onSelect={onToggle}
      aria-expanded={open}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) onToggle();
      }}
      actions={open ? <Up aria-hidden="true" /> : <Down aria-hidden="true" />}
    />
    <Collapsible open={open}>
      <Box gap="4xsmall">
        {items.map((item) =>
          item.children ? (
            <NavParentV3
              key={item.key}
              item={item}
              selected={selected}
              onSelect={onSelect}
            />
          ) : (
            <NavItemV3
              key={item.key}
              item={item}
              level={1}
              selected={selected.key === item.key}
              onSelect={onSelect}
            />
          ),
        )}
      </Box>
    </Collapsible>
  </Box>
);

// A nav item that is also a page and has its own children. Clicking the
// label navigates and opens it; the chevron only toggles.
const NavParentV3 = ({ item, level = 1, selected, onSelect }) => {
  const hasActiveChild = item.children.some((c) => c.key === selected.key);
  const [expanded, setExpanded] = usePersistedState(
    `nav.expanded.${item.key}`,
    false,
  );
  // Re-open when the route moves into this item, but let the user collapse it.
  useEffect(() => {
    if (hasActiveChild || selected.key === item.key) setExpanded(true);
  }, [hasActiveChild, selected.key, item.key, setExpanded]);
  const open = expanded;
  return (
    <Box>
      <NavItemV3
        item={item}
        level={level}
        selected={selected.key === item.key}
        onSelect={(i) => {
          // Without a page of its own, the label just toggles the children.
          if (!item.href) return setExpanded(!open);
          setExpanded(true);
          onSelect(i);
        }}
        actions={
          // Not a Button: NavItemV3 is already a button and they cannot nest.
          <Box
            role="button"
            aria-label={`${open ? "Collapse" : "Expand"} ${item.label}`}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!open);
            }}
          >
            {open ? <Up aria-hidden="true" /> : <Down aria-hidden="true" />}
          </Box>
        }
      />
      <Collapsible open={open}>
        <Box gap="4xsmall">
          {item.children.map((child) => (
            <NavItemV3
              key={child.key}
              item={child}
              level={level + 1}
              selected={selected.key === child.key}
              onSelect={onSelect}
            />
          ))}
        </Box>
      </Collapsible>
    </Box>
  );
};

const inGroup = (v, selected) =>
  v.some(
    (i) =>
      i.key === selected.key ||
      (i.children ?? []).some((c) => c.key === selected.key),
  );

const groupOf = (items, selected) =>
  Object.entries(items).find(
    ([, v]) => Array.isArray(v) && inGroup(v, selected),
  )?.[0];

// Responsive ladder (crit 19 Nov): the navigation gives way first. Under
// `xlarge` (1440px) it drops to an icon rail as soon as the context pane
// opens; from `medium` (1080px) down it starts as a rail regardless, so content
// and the context pane keep their width; below `small` (768px) opening it
// overlays the shell instead of pushing content. The wide-screen preference
// is kept separately so returning to a wide window restores it.
const NavPaneV3 = ({ title = "Menu title", items = navItems }) => {
  const size = useContext(ResponsiveContext);
  const { contextPane } = usePrototype();
  const autoCollapse =
    ["xsmall", "small", "medium"].includes(size) ||
    (contextPane && size !== "xlarge");
  const overlay = ["xsmall", "small"].includes(size);
  const [wideOpen, setWideOpen] = usePersistedState("nav.open", true);
  const [narrowOpen, setNarrowOpen] = useState(false);
  const open = autoCollapse ? narrowOpen : wideOpen;
  const setOpen = autoCollapse ? setNarrowOpen : setWideOpen;
  const [selected, setSelected] = useState(() =>
    activeNavItem(navItems.Anatomy[0]),
  );
  // Groups start collapsed; the active item's group is opened below.
  const [expanded, setExpanded] = usePersistedState("nav.expanded", []);
  // Keep selection in step with in-page links that change the route.
  useEffect(() => {
    const onHash = () => setSelected((s) => activeNavItem(s));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    const g = groupOf(items, selected);
    if (g) setExpanded((e) => (e.includes(g) ? e : [...e, g]));
  }, [items, selected]);
  const onSelect = (item) => {
    selectNavItem(item, setSelected);
    if (overlay) setNarrowOpen(false);
  };
  const toggle = (g) =>
    setExpanded((e) => (e.includes(g) ? e.filter((i) => i !== g) : [...e, g]));
  const pane = (
    <Box
      as="nav"
      aria-label="Primary"
      width={open ? "256px" : undefined}
      flex={false}
      background="background-back"
      round="large"
      pad={{ horizontal: "3xsmall" }}
      style={stickyBelowHeader(12, { alignSelf: "flex-start" })}
      height="calc(100vh - 84px)"
    >
      <Box
        direction="row"
        align="center"
        justify="between"
        gap="xxsmall"
        pad={{
          top: "xsmall",
          bottom: "xxsmall",
          horizontal: open ? "small" : "none",
        }}
        height={{ min: "36px" }}
        flex={false}
      >
        {open && (
          <Text size="large" weight={500} color="text-heading">
            {title}
          </Text>
        )}
        <Button
          icon={<SidebarIcon />}
          secondary
          a11yTitle={open ? "Collapse navigation" : "Expand navigation"}
          onClick={() => setOpen(!open)}
        />
      </Box>
      {open && (
        <Nav gap="4xsmall" pad={{ bottom: "small" }} overflow="auto">
          {Object.entries(items).map(([group, value]) =>
            NAV_HEADER_GROUPS.includes(group) ? (
              <Fragment key={group}>
                {NAV_DIVIDER_BEFORE.includes(group) && <NavDivider />}
                <NavGroupHeader label={group} />
                {value.map((item) =>
                  item.children ? (
                    <NavParentV3
                      key={item.key}
                      item={item}
                      level={0}
                      selected={selected}
                      onSelect={onSelect}
                    />
                  ) : (
                    <NavItemV3
                      key={item.key}
                      item={item}
                      selected={selected.key === item.key}
                      onSelect={onSelect}
                    />
                  ),
                )}
              </Fragment>
            ) : Array.isArray(value) ? (
              <Fragment key={group}>
                {NAV_DIVIDER_BEFORE.includes(group) && <NavDivider />}
                <NavGroupV3
                  group={group}
                  items={value}
                  open={expanded.includes(group)}
                  onToggle={() => toggle(group)}
                  selected={selected}
                  onSelect={onSelect}
                />
              </Fragment>
            ) : (
              <NavItemV3
                key={value.key}
                item={value}
                selected={selected.key === value.key}
                onSelect={onSelect}
              />
            ),
          )}
        </Nav>
      )}
    </Box>
  );
  if (overlay && open) {
    // Rail keeps its slot so content does not jump; the open pane floats over
    // it from the same corner.
    return (
      <>
        <Box width="48px" flex={false} />
        <Layer
          position="top-left"
          modal
          animation="slide"
          margin={{ top: `${APP_HEADER_HEIGHT + 12}px`, left: "xsmall" }}
          onEsc={() => setNarrowOpen(false)}
          onClickOutside={() => setNarrowOpen(false)}
          background="none"
        >
          {pane}
        </Layer>
      </>
    );
  }
  return pane;
};

// Context pane (Figma: Slot builds → AppShell - V3 → ContextPane). At medium
// and up it is a 425px sibling after main in the wrapper row, so it pushes
// content rather than overlaying it; at small and xsmall it covers the shell
// full-width, like the mobile navigation.
export const CONTEXT_PANE_WIDTH = 425;

const ContextPaneBody = ({ onClose, fill }) => (
  <Box
    as="aside"
    aria-label="Context"
    width={fill ? undefined : `${CONTEXT_PANE_WIDTH}px`}
    fill={fill}
    flex={false}
    background="background-back"
    round={fill ? undefined : "large"}
    style={
      fill ? undefined : stickyBelowHeader(12, { alignSelf: "flex-start" })
    }
    height={fill ? undefined : "calc(100vh - 84px)"}
  >
    <Box
      direction="row"
      align="center"
      justify="between"
      gap="xxsmall"
      pad={{ top: "xsmall", bottom: "xxsmall", horizontal: "small" }}
      height={{ min: "36px" }}
      flex={false}
    >
      <Text size="large" weight={500} color="text-heading">
        Context
      </Text>
      <Button
        icon={<Close />}
        secondary
        a11yTitle="Close context pane"
        onClick={onClose}
      />
    </Box>
    <Box
      pad={{ horizontal: "small", bottom: "small" }}
      gap="small"
      overflow="auto"
    >
      <Text size="small" color="text-weak">
        Slot for contextual help, AI assistance or activity for the current
        page.
      </Text>
    </Box>
  </Box>
);

const ContextPaneV3 = () => {
  const size = useContext(ResponsiveContext);
  const { contextPane, setContextPane } = usePrototype();
  if (!contextPane) return null;
  const close = () => setContextPane(false);
  if (["xsmall", "small"].includes(size)) {
    return (
      <Layer full animation="fadeIn" onEsc={close}>
        <ContextPaneBody fill onClose={close} />
      </Layer>
    );
  }
  return <ContextPaneBody onClose={close} />;
};

// `appName` swaps the GreenLake platform header for the application variant.
const STORAGE_PREFIX = "ld-proto:";
const useStoredToggle = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
      return raw === null ? initial : raw === "true";
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, String(value));
    } catch {
      // storage unavailable: keep in-memory value only
    }
  }, [key, value]);
  return [value, setValue];
};

export const V3Shell = ({
  appName,
  chrome = true,
  onChromeChange,
  children,
}) => {
  // Prototype toggles persist in localStorage so they stay consistent when
  // flicking between examples (each route mounts its own shell).
  // Default since the 25 Nov review: contained list, uncontained detail;
  // containment inside the detail depends on its content.
  const [contained, setContained] = useStoredToggle("contained", true);
  const [containedDetail, setContainedDetail] = useStoredToggle(
    "containedDetail",
    false,
  );
  const [containedContent, setContainedContent] = useStoredToggle(
    "containedContent",
    false,
  );
  const [wrapped, setWrapped] = useStoredToggle("wrapped", false);
  const [contextPane, setContextPane] = useStoredToggle("contextPane", false);
  const [keepTab, setKeepTab] = useStoredToggle("keepTab", true);
  // Default since the 23 Nov 1:1: the page scrolls as 1 while the list
  // toolbar and detail tabs stay pinned; "Detail-pane scroll" in prototype
  // options restores the bounded pane for comparison.
  const [pageScroll, setPageScroll] = useStoredToggle("pageScroll", true);
  const [detailTabs, setDetailTabs] = useState({});
  const setDetailTab = useCallback(
    (page, i) => setDetailTabs((t) => ({ ...t, [page]: i })),
    [],
  );
  const prototype = useMemo(
    () => ({
      contained,
      containedDetail,
      containedContent,
      wrapped,
      contextPane,
      keepTab,
      pageScroll,
      detailTabs,
      setContained,
      setContainedDetail,
      setContainedContent,
      setWrapped,
      setContextPane,
      setKeepTab,
      setPageScroll,
      setDetailTab,
    }),
    [
      contained,
      containedDetail,
      containedContent,
      wrapped,
      contextPane,
      keepTab,
      pageScroll,
      detailTabs,
      setDetailTab,
    ],
  );
  const switches = (
    <PrototypeSwitches chrome={chrome} onChromeChange={onChromeChange} />
  );
  if (!chrome) {
    // Shell hidden: bare page, with the options button floating so the
    // chrome can be switched back on.
    return (
      <ShellContext.Provider value="v3">
        <PrototypeContext.Provider value={prototype}>
          <Box style={{ position: "fixed", top: 12, right: 12, zIndex: 10 }}>
            {switches}
          </Box>
          {children}
        </PrototypeContext.Provider>
      </ShellContext.Provider>
    );
  }
  return (
    <ShellContext.Provider value="v3">
      <PrototypeContext.Provider value={prototype}>
        <Box background="background" fill="vertical" flex>
          {appName ? (
            <GlobalHeaderApp appName={appName} switches={switches} />
          ) : (
            <GlobalHeaderV3 switches={switches} />
          )}
          <Box direction="row" gap="xsmall" pad="xsmall" align="start" flex>
            <NavPaneV3 />
            <Box as="main" flex style={{ minWidth: 0 }}>
              {children}
            </Box>
            <ContextPaneV3 />
          </Box>
        </Box>
      </PrototypeContext.Provider>
    </ShellContext.Provider>
  );
};
