import { createContext, useContext } from 'react';

// Which app-shell variant the page is rendered in. Pages can use it to adapt
// containment (e.g. a bordered pane on a white V3 canvas vs. a filled pane on
// the default grey canvas).
export const ShellContext = createContext('default');

export const useShell = () => useContext(ShellContext);
