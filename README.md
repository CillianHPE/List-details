# design-to-code
Design to Code: turning HPE Figma designs into working prototypes built on the HPE Design System (grommet + hpe-design-system)

## Prototypes

Versions are addressed by URL hash and switchable from the floating **Version** pill (bottom-right):

| Hash | What | Shell |
| --- | --- | --- |
| `#/default` | Users list–detail page | Default HPE app shell (`src/shell/DefaultShell.jsx`, mirrors `hpe-design-system/sandbox/grommet-app`) |
| `#/v3` | Same page | App Shell V3.1 (`src/shell/V3Shell.jsx`, Figma *Landmark Surface examples → 3250:15494*): white canvas, 60px bordered header with workspace switcher, 12px wrapper, rounded grey 256px nav pane |
| `#/anatomy` | Lo-fi zoom explorer for the pattern (`src/pages/anatomy`) | Four tabbed zoom levels — **Page** (where the surface sits; Default / Shell v3), **Zones** (list vs detail and how width is shared; Fixed list 192–384px / Proportional 40–60), **List zone** (toolbar, body, row) and **Detail zone** (heading + actions header, optional tabs, generic content area). Each level pairs a dashed wireframe with a legend of role, owns, controls and behaviour |

Pages read the active shell via `ShellContext` so containment can adapt (the list–detail pane gains a `border-weak` border on the white V3 canvas).

### Users · list–detail page (`src/pages/users`)

A list–detail (master–detail) page built with Grommet + `grommet-theme-hpe`, following the zoning model from the
list–detail research (Figma: *Landmark Surface examples → List details*):

| Zone | Component | Holds |
| --- | --- | --- |
| A · Page header | `UsersPage` → Grommet `PageHeader` | Title, `parent` back link (drill‑in only), secondary **Add users** · Divider toggle (prototype control) |
| B · List toolbar | `UsersPage` | Full‑width search, `ToggleGroup` quick filters (All / Active / Invited), item count |
| C · List body | `UserList` | 2‑line rows (avatar, name, role, date top‑right); selected row = contrast fill |
| D · Detail header | `UserDetail` | Name (h2) + inline rename, **Actions** `Menu` grouped per DS guidance (Edit name / Change role / Reset password / Resend invite · Suspend · Remove user last), sub‑tabs |
| E · Detail body | `UserDetail` | Grommet `Tabs` own the panels (tab ↔ tabpanel wired by Grommet); each panel carries a visually hidden h3. Tabs mirror GreenLake user detail: Details (grouped `NameValueList`s — Identity / Account / Membership & activity — separated by weak dividers; row pairs stack when the pane is narrower than 480px) / Role assignments (`List`: role link, service · scope, source, remove) / User group membership (`List`: group link, lifecycle source, remove) / Organization workspace membership (`List` or empty state) |

Below the `medium` breakpoint (1080px) the two columns collapse into a drill‑in (list → detail; `PageHeader.parent` holds the back link).

#### HPE Design System alignment

Components come only from `grommet`, `grommet-theme-hpe` and `@hpe-design/icons-grommet` — the same packages (and
compatible versions) as `hpe-design-system/sandbox/grommet-app`. The app shell mirrors that sandbox:

- `GlobalHeader` ← `sandbox/grommet-app/src/components/GlobalHeader` (`Page kind="full"`, logo, global search, Help/Catalog/Notification/User)
- `NavSidebar` ← `sandbox/grommet-app/src/components/NavSidebar` + `CollapsibleMenu` (titled Grommet `Sidebar` with collapse toggle, expandable text items; collapses to a rail)
- Page anatomy ← `GlobalHeader` → `Box direction="row"` (`NavSidebar` + `Page`) → `PageContent` → `PageHeader`, as in `sandbox/grommet-app/src/pages/layouts/kinds/NavigationalSidebar`
- List + detail ← a single `ContentPane` (`background-front`, rounded) wrapping a `Grid`; the two columns are split by a `border-weak` divider inset from the container edges (it runs the height of the sticky list box, not the full pane), each padding itself `medium`. The list column is sticky and scrolls internally while the page scrolls

```sh
npm install
npm run dev
```
