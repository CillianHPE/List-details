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
| D · Detail header | `UserDetail` | Name + inline rename, `…` overflow menu (Reset password / Suspend / Remove), **Edit**, sub‑tabs |
| E · Detail body | `UserDetail` | Contained **Details** (`NameValueList`) → Roles & groups (`List` + row menu) → Recent activity (`List`) |

Below the `medium` breakpoint (1080px) the two columns collapse into a drill‑in (list → detail; `PageHeader.parent` holds the back link).

#### HPE Design System alignment

Components come only from `grommet`, `grommet-theme-hpe` and `@hpe-design/icons-grommet` — the same packages (and
compatible versions) as `hpe-design-system/sandbox/grommet-app`. The app shell mirrors that sandbox:

- `GlobalHeader` ← `sandbox/grommet-app/src/components/GlobalHeader` (`Page kind="full"`, logo, global search, Help/Catalog/Notification/User)
- `NavSidebar` ← `sandbox/grommet-app/src/components/NavSidebar` (Grommet `Sidebar` + `Nav`, collapsed icon‑only)
- Page header ← Grommet `PageHeader` as used in `sandbox/grommet-app/src/pages/layouts/kinds/Collection`

```sh
npm install
npm run dev
```
