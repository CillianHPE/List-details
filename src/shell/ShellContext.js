import { createContext, useContext } from 'react';

// Which app-shell variant the page is rendered in. Pages can use it to adapt
// containment (e.g. a bordered pane on a white V3 canvas vs. a filled pane on
// the default grey canvas).
export const ShellContext = createContext('default');

export const useShell = () => useContext(ShellContext);

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
