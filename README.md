# design-to-code
Design to Code: turning HPE Figma designs into working prototypes built on the HPE Design System (grommet + hpe-design-system)

## Prototypes

### Users · list–detail page (`src/pages/users`)

A list–detail (master–detail) page built with Grommet + `grommet-theme-hpe`, following the zoning model from the
list–detail research (Figma: *Landmark Surface examples → List details*):

| Zone | Component | Holds |
| --- | --- | --- |
| A · Page header | `UsersPage` | Collection title, `Actions ▾` menu, primary **Invite user** |
| B · List toolbar | `UsersPage` | Search, filter, `Action ▾`, item count |
| C · List body | `UserList` | 2‑line rows (avatar, name, role, date); selected row = contrast fill |
| D · Detail header | `UserDetail` | Eyebrow (ID), name + inline rename ✎, status, secondary action, sub‑tabs |
| E · Detail body | `UserDetail` | Properties (`NameValueList`) → related entities (`DataTable` + section CTA) → activity |
| F · Sticky footer | `UserDetail` | Destructive leftmost (Remove user), item actions, last‑active timestamp |

Below the `medium` breakpoint (1080px) the two columns collapse into a drill‑in (list → detail with a Back button).

```sh
npm install
npm run dev
```
