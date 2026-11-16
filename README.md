# design-to-code
Design to Code: turning HPE Figma designs into working prototypes built on the HPE Design System (grommet + hpe-design-system)

## Prototypes

Versions are addressed by URL hash and switchable from the floating **Version** pill (bottom-right):

| Hash | What | Shell |
| --- | --- | --- |
| `#/default` | Users list–detail page | Default HPE app shell (`src/shell/DefaultShell.jsx`, mirrors `hpe-design-system/sandbox/grommet-app`) |
| `#/v3` | Same page | App Shell V3.1 (`src/shell/V3Shell.jsx`, Figma *Landmark Surface examples → 3250:15494*): white canvas, 60px bordered header with workspace switcher, 12px wrapper, rounded grey 256px nav pane |
| `#/v3-few` | Same page, three users | Short list + long detail (`UsersPage users={…}`); the list column stretches to the detail height so the divider runs the full surface |
| `#/v3-short` | Same page, one-facet detail | Long list + short detail (`UserDetail variant="short"`: no tabs, identity only); the list scrolls within the viewport while the detail stays short |
| `#/v3-context` | Same page, among other content | List–detail with summary metrics above and a Recent activity section below (`UsersPage before={…} after={…}`), to study page scroll when the surface is not the whole page |
| `#/accounts` | Accounts in App Shell V3.1 (`src/pages/accounts`) | A second record type on the same `ListDetailPage` surface (`src/pattern/ListDetailPage.jsx`), built from the portfolio health data in the HPE-DS-aligned Accounts / User insights redesigns. The redesign's account dropdown becomes the list zone (name · industry · users · health score), its metadata row becomes the detail header, and its tab bar becomes the detail facets (Summary · User engagement · Adoption · Configuration · Subscriptions). Quick filters by health tier; collection action "Add account"; section actions (Re-score users, Add subscription) kept out of the record menu |
| `#/anatomy` | Lo-fi zoom explorer for the pattern (`src/pages/anatomy`) | Four tabbed zoom levels — **Page** (where the surface sits; Default / Shell v3), **Zones** (list vs detail and how width is shared; Fixed list 256–384px / **Proportional 40–60 (current)**), **List zone** (toolbar, body, row) and **Detail zone** (heading + actions header, optional tabs, generic content area). Each level pairs a dashed wireframe with a legend of role, owns, **why** (the user-benefit rationale behind the region, per stand-up feedback), controls and layout, linking to the Behaviour tab that covers how it acts. A second **Behaviour** group answers the developer questions — **Scroll & height** (sticky global header in every shell; Page scrolls vs Panes scroll), **Responsive** (Comfortable / Compact / Drill-in tiers by surface width — the same rules the Users prototype runs on, plus a **Shell configuration** explorer: browser width × nav expanded (256px) / collapsed rail (48px) / hidden × context pane open, computing the px left for the surface from the V3.1 shell measurements and the resulting Comfortable / Compact / Drill-in tier, with a nav–context mutual-exclusion rule under 1536px), **States** (loading, empty, no results, no selection, error, read-only), **Actions & ownership** (collection / record / section / row scopes) — each flagging open questions for the team. A **Data & performance** tab (fetch points and caching) exists but is hidden for now via `BEHAVIOUR_TABS` in `primitives.jsx` |

Pages read the active shell via `ShellContext` so containment can adapt (the list–detail pane gains a `border-weak` border on the white V3 canvas).

### Users · list–detail page (`src/pages/users`)

A list–detail (master–detail) page built with Grommet + `grommet-theme-hpe`, following the zoning model from the
list–detail research (Figma: *Landmark Surface examples → List details*):

| Zone | Component | Holds |
| --- | --- | --- |
| A · Page header | `UsersPage` → Grommet `PageHeader` | Title, `parent` back link (drill‑in only), page‑level controls only (Divider toggle, prototype control); folds to an overflow menu below Comfortable |
| B · List toolbar | `UsersPage` | Search with trailing secondary **Add users** (collection action; icon‑only below Comfortable), `ToggleGroup` quick filters (All / Active / Invited), item count |
| C · List body | `UserList` | 2‑line rows (avatar, name, role, date top‑right); selected row = contrast fill |
| D · Detail header | `UserDetail` | Name (h2) + inline rename, **Actions** `Menu` grouped per DS guidance (Edit name / Change role / Reset password / Resend invite · Suspend · Remove user last), sub‑tabs |
| E · Detail body | `UserDetail` | Grommet `Tabs` own the panels (tab ↔ tabpanel wired by Grommet); each panel carries a visually hidden h3. Tabs mirror GreenLake user detail: Details (grouped `NameValueList`s — Identity / Account / Membership & activity — separated by weak dividers; row pairs stack when the pane is narrower than 480px) / Role assignments (`List`: role link, service · scope, source, remove) / User group membership (`List`: group link, lifecycle source, remove) / Organization workspace membership (`List` or empty state) |

The surface follows the Anatomy **Responsive** tiers, measured on its own width (a `ResizeObserver`, not the viewport — the shell's nav/context panes take width first). Rules live once in `src/pattern/listDetail.js` and are read by both the prototype and the Anatomy page:

- **Comfortable** ≥ 1000px — zones are **proportional 40 / 60** (`Grid [40% in px, flex]`, the Anatomy *Proportional* variant); all page‑header actions labelled.
- **Compact** 760–999px — same 40 / 60 split (list floored at 256px, `size.small`); the Divider toggle folds into an overflow `Menu`; **Add users** (in the list toolbar) becomes an icon button.
- **Drill‑in** < 760px — one column (list → detail); `PageHeader.parent` holds the **All users** back link; **Add users** stays icon‑only in the toolbar.

Detail tabs never wrap (Grommet `Tabs` scrolls them with arrows on overflow), and a filter that matches nothing shows a **No users match** message with **Clear filters** in place of the rows while the detail keeps its last selection.

#### HPE Design System alignment

Components come only from `grommet`, `grommet-theme-hpe` and `@hpe-design/icons-grommet` — the same packages (and
compatible versions) as `hpe-design-system/sandbox/grommet-app`. The app shell mirrors that sandbox:

- `GlobalHeader` ← `sandbox/grommet-app/src/components/GlobalHeader` (`Page kind="full"`, logo, global search, Help/Catalog/Notification/User)
- `NavSidebar` ← `sandbox/grommet-app/src/components/NavSidebar` + `CollapsibleMenu` (titled Grommet `Sidebar` with collapse toggle, expandable text items; collapses to a rail)
- Page anatomy ← `GlobalHeader` → `Box direction="row"` (`NavSidebar` + `Page`) → `PageContent` → `PageHeader`, as in `sandbox/grommet-app/src/pages/layouts/kinds/NavigationalSidebar`
- List + detail ← a single `ContentPane` (`background-front`, rounded) wrapping a `Grid`; the two columns are split by a `border-weak` divider on a full-height rail (the Grid uses `align="stretch"`, so the divider runs the height of the surface, inset by the pane padding), each padding itself `medium`. Inside the rail the toolbar + rows box is sticky and scrolls internally while the page scrolls

```sh
npm install
npm run dev
```
