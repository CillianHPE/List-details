import { createContext, useContext } from 'react';

// Which app-shell variant the page is rendered in. Pages can use it to adapt
// containment (e.g. a bordered pane on a white V3 canvas vs. a filled pane on
// the default grey canvas).
export const ShellContext = createContext('default');

export const useShell = () => useContext(ShellContext);

// Prototype-only presentation switches (divider between list and detail,
// contained list surface). Owned by the shell so they sit in the global
// header rather than competing with real page actions.
export const PrototypeContext = createContext({
  divider: true,
  contained: false,
  setDivider: () => {},
  setContained: () => {},
});

export const usePrototype = () => useContext(PrototypeContext);

// Global header is position: sticky at the top of the viewport in every shell;
// page content slides beneath it. Anything else that sticks (nav pane, list
// column) offsets from this so it pins just below the header.
export const APP_HEADER_HEIGHT = 60;
export const appHeight = `calc(100vh - ${APP_HEADER_HEIGHT}px)`;
export const stickyBelowHeader = (offset = 0, extra = {}) => ({
  position: 'sticky',
  top: APP_HEADER_HEIGHT + offset,
  ...extra,
});
