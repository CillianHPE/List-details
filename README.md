# design-to-code
Design to Code: turning HPE Figma designs into working prototypes built on the HPE Design System (grommet + hpe-design-system)

## Prototypes

### Users · list–detail page (`src/pages/users`)

A list–detail (master–detail) page built with Grommet + `grommet-theme-hpe`, following the zoning model from the
list–detail research (Figma: *Landmark Surface examples → List details*):

| Zone | Component | Holds |
| --- | --- | --- |
| A · Page header | `UsersPage` → Grommet `PageHeader` | Title, `parent` back link (drill‑in only), primary **Invite user** |
| B · List toolbar | `UsersPage` | Full‑width search, `ToggleGroup` quick filters (All / Active / Invited), item count |
| C · List body | `UserList` | 2‑line rows (avatar, name, role, date top‑right); selected row = contrast fill |
| D · Detail header | `UserDetail` | Name (h2) + inline rename, `…` overflow menu (Reset password / Suspend / Remove), **Edit**, sub‑tabs |
| E · Detail body | `UserDetail` | Grommet `Tabs` own the panels (tab ↔ tabpanel wired by Grommet); each panel carries a visually hidden h3. One section per tab: Details (`NameValueList`, row pairs that stack when the pane is narrower than 480px) / Roles & groups (`List` + row menu) / Activity (`List`) |

Below the `medium` breakpoint (1080px) the two columns collapse into a drill‑in (list → detail; `PageHeader.parent` holds the back link).

#### HPE Design System alignment

Components come only from `grommet`, `grommet-theme-hpe` and `@hpe-design/icons-grommet` — the same packages (and
compatible versions) as `hpe-design-system/sandbox/grommet-app`. The app shell mirrors that sandbox:

- `GlobalHeader` ← `sandbox/grommet-app/src/components/GlobalHeader` (`Page kind="full"`, logo, global search, Help/Catalog/Notification/User)
- `NavSidebar` ← `sandbox/grommet-app/src/components/NavSidebar` + `CollapsibleMenu` (titled Grommet `Sidebar` with collapse toggle, expandable text items; collapses to a rail)
- Page anatomy ← `GlobalHeader` → `Box direction="row"` (`NavSidebar` + `Page`) → `PageContent` → `PageHeader`, as in `sandbox/grommet-app/src/pages/layouts/kinds/NavigationalSidebar`
- List and detail panes ← `ContentPane` (`background-front`, `pad="medium"`, rounded) laid out in a `Grid`, as in `.../kinds/Collection`; the list pane is sticky and scrolls internally while the page scrolls

```sh
npm install
npm run dev
```
