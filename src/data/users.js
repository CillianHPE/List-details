const baseUsers = [
  {
    id: 'usr_01HX2K',
    name: 'Alex Morgan',
    initials: 'AM',
    email: 'alex.morgan@acme.com',
    role: 'Workspace administrator',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 24th, 2024',
    lastActive: '2 minutes ago',
    groups: [
      { name: 'Platform admins', type: 'Group', members: 6 },
      { name: 'Billing owners', type: 'Group', members: 3 },
    ],
    activity: [
      { when: 'Today, 09:14', what: 'Signed in from Dublin, IE' },
      {
        when: 'Yesterday, 17:02',
        what: 'Assigned role "Workspace administrator" to Casey Turner',
      },
      { when: 'Mar 21st, 2024', what: 'Created API key "ci-deploy"' },
    ],
  },
  {
    id: 'usr_02JQ8M',
    name: 'Ava Williams',
    initials: 'AW',
    email: 'ava.williams@acme.com',
    role: 'DevOps engineer',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 24th, 2024',
    lastActive: '1 hour ago',
    groups: [{ name: 'Infra on-call', type: 'Group', members: 9 }],
    activity: [
      { when: 'Today, 08:40', what: 'Signed in from London, UK' },
      { when: 'Mar 22nd, 2024', what: 'Rotated API key "terraform"' },
    ],
  },
  {
    id: 'usr_03LP7R',
    name: 'Benjamin Schultz',
    initials: 'BS',
    email: 'benjamin.schultz@acme.com',
    role: 'Workspace administrator',
    status: 'Invited',
    mfa: 'Not set up',
    created: 'Mar 24th, 2024',
    lastActive: 'Never',
    groups: [{ name: 'Platform admins', type: 'Group', members: 6 }],
    activity: [
      { when: 'Mar 24th, 2024', what: 'Invitation sent by Alex Morgan' },
    ],
  },
  {
    id: 'usr_04MN3T',
    name: 'Casey Turner',
    initials: 'CT',
    email: 'casey.turner@acme.com',
    role: 'Workspace administrator',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 24th, 2024',
    lastActive: '3 days ago',
    groups: [
      { name: 'Platform admins', type: 'Group', members: 6 },
      { name: 'Support', type: 'Group', members: 12 },
    ],
    activity: [{ when: 'Mar 25th, 2024', what: 'Signed in from Austin, US' }],
  },
  {
    id: 'usr_05PQ9V',
    name: 'Charlotte Nguyen',
    initials: 'CN',
    email: 'charlotte.nguyen@acme.com',
    role: 'Workspace administrator',
    status: 'Suspended',
    mfa: 'Enabled',
    created: 'Mar 24th, 2024',
    lastActive: '2 weeks ago',
    groups: [],
    activity: [
      { when: 'Mar 10th, 2024', what: 'Account suspended by Alex Morgan' },
      { when: 'Mar 9th, 2024', what: '5 failed sign-in attempts' },
    ],
  },

  {
    id: 'usr_06DOX',
    name: 'Daniel Okafor',
    initials: 'DO',
    email: 'daniel.okafor@acme.com',
    role: 'DevOps engineer',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 25th, 2024',
    lastActive: '4 hours ago',
    groups: [{ name: 'DevOps engineers', type: 'Group', members: 10 }],
    activity: [{ when: 'Mar 25th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_07ERX',
    name: 'Elena Rossi',
    initials: 'ER',
    email: 'elena.rossi@acme.com',
    role: 'Security analyst',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 25th, 2024',
    lastActive: 'Yesterday',
    groups: [{ name: 'Security analysts', type: 'Group', members: 11 }],
    activity: [{ when: 'Mar 25th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_08FKX',
    name: 'Farah Khan',
    initials: 'FK',
    email: 'farah.khan@acme.com',
    role: 'Workspace administrator',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 26th, 2024',
    lastActive: '3 hours ago',
    groups: [{ name: 'Workspace administrators', type: 'Group', members: 12 }],
    activity: [{ when: 'Mar 26th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_09GSX',
    name: 'Gabriel Silva',
    initials: 'GS',
    email: 'gabriel.silva@acme.com',
    role: 'Developer',
    status: 'Invited',
    mfa: 'Not set up',
    created: 'Mar 26th, 2024',
    lastActive: 'Never',
    groups: [{ name: 'Developers', type: 'Group', members: 13 }],
    activity: [{ when: 'Mar 26th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_10HLX',
    name: 'Hannah Lee',
    initials: 'HL',
    email: 'hannah.lee@acme.com',
    role: 'Developer',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 27th, 2024',
    lastActive: '20 minutes ago',
    groups: [{ name: 'Developers', type: 'Group', members: 14 }],
    activity: [{ when: 'Mar 27th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_11ICX',
    name: 'Isaac Cohen',
    initials: 'IC',
    email: 'isaac.cohen@acme.com',
    role: 'Billing owner',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 27th, 2024',
    lastActive: '5 days ago',
    groups: [{ name: 'Billing owners', type: 'Group', members: 15 }],
    activity: [{ when: 'Mar 27th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_12JPX',
    name: 'Jasmine Patel',
    initials: 'JP',
    email: 'jasmine.patel@acme.com',
    role: 'Security analyst',
    status: 'Suspended',
    mfa: 'Enabled',
    created: 'Mar 28th, 2024',
    lastActive: '3 weeks ago',
    groups: [{ name: 'Security analysts', type: 'Group', members: 16 }],
    activity: [{ when: 'Mar 28th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_13KTX',
    name: 'Kenji Tanaka',
    initials: 'KT',
    email: 'kenji.tanaka@acme.com',
    role: 'DevOps engineer',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 28th, 2024',
    lastActive: '1 day ago',
    groups: [{ name: 'DevOps engineers', type: 'Group', members: 17 }],
    activity: [{ when: 'Mar 28th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_14LWX',
    name: 'Liam Walsh',
    initials: 'LW',
    email: 'liam.walsh@acme.com',
    role: 'Developer',
    status: 'Active',
    mfa: 'Not set up',
    created: 'Mar 29th, 2024',
    lastActive: '6 hours ago',
    groups: [{ name: 'Developers', type: 'Group', members: 18 }],
    activity: [{ when: 'Mar 29th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_15MJX',
    name: 'Maya Johansson',
    initials: 'MJ',
    email: 'maya.johansson@acme.com',
    role: 'Workspace administrator',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Mar 29th, 2024',
    lastActive: 'Just now',
    groups: [{ name: 'Workspace administrators', type: 'Group', members: 19 }],
    activity: [{ when: 'Mar 29th, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_16NFX',
    name: 'Noah Fischer',
    initials: 'NF',
    email: 'noah.fischer@acme.com',
    role: 'Support agent',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Apr 1st, 2024',
    lastActive: '2 days ago',
    groups: [{ name: 'Support agents', type: 'Group', members: 20 }],
    activity: [{ when: 'Apr 1st, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_17OMX',
    name: 'Olivia Martin',
    initials: 'OM',
    email: 'olivia.martin@acme.com',
    role: 'Support agent',
    status: 'Invited',
    mfa: 'Not set up',
    created: 'Apr 1st, 2024',
    lastActive: 'Never',
    groups: [{ name: 'Support agents', type: 'Group', members: 21 }],
    activity: [{ when: 'Apr 1st, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_18PSX',
    name: 'Priya Sharma',
    initials: 'PS',
    email: 'priya.sharma@acme.com',
    role: 'Developer',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Apr 2nd, 2024',
    lastActive: '45 minutes ago',
    groups: [{ name: 'Developers', type: 'Group', members: 22 }],
    activity: [{ when: 'Apr 2nd, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_19RGX',
    name: 'Rafael Gomez',
    initials: 'RG',
    email: 'rafael.gomez@acme.com',
    role: 'Billing owner',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Apr 2nd, 2024',
    lastActive: '1 week ago',
    groups: [{ name: 'Billing owners', type: 'Group', members: 23 }],
    activity: [{ when: 'Apr 2nd, 2024', what: 'Invitation accepted' }],
  },
  {
    id: 'usr_20SDX',
    name: 'Sophie Dubois',
    initials: 'SD',
    email: 'sophie.dubois@acme.com',
    role: 'Security analyst',
    status: 'Active',
    mfa: 'Enabled',
    created: 'Apr 3rd, 2024',
    lastActive: '8 hours ago',
    groups: [{ name: 'Security analysts', type: 'Group', members: 24 }],
    activity: [{ when: 'Apr 3rd, 2024', what: 'Invitation accepted' }],
  },
];

// Enrich each record with the GreenLake user-detail fields (Details, Role
// assignments, User group membership, Organization workspace membership).
const hex = (seed, length) => {
  let h = 2166136261;
  let out = '';
  for (let i = 0; out.length < length; i += 1) {
    h = Math.imul(h ^ (seed.charCodeAt(i % seed.length) + i), 16777619) >>> 0;
    out += h.toString(16).padStart(8, '0');
  }
  return out.slice(0, length);
};

const GREENLAKE = 'GreenLake Platform';

export const users = baseUsers.map((u, i) => {
  const [firstName, ...rest] = u.name.split(' ');
  const id = hex(u.id, 24);
  const invited = u.status === 'Invited';
  const direct = [
    u.role,
    ...(u.role === 'Workspace administrator' ? ['Workspace observer'] : []),
  ].map((role) => ({
    role,
    service: GREENLAKE,
    scope: 'Entire workspace',
    source: 'Direct',
  }));
  const inherited = [
    {
      role: 'Intelligence registry user',
      service: GREENLAKE,
      scope: 'Copilot built-in read access',
      source: 'Baseline access',
    },
    ...u.groups.slice(0, 1).map((g) => ({
      role: 'Workspace member',
      service: GREENLAKE,
      scope: 'Entire workspace',
      source: g.name,
    })),
  ];
  return {
    ...u,
    firstName,
    lastName: rest.join(' '),
    userId: id,
    principalId: `user:${id}`,
    verified: invited ? 'No' : 'Yes',
    authorizationSource: 'Local',
    lifecycleSource: i % 5 === 0 ? 'SCIM' : 'Local',
    joinedOrganization: 'April 14, 2025',
    joinedWorkspace: invited ? '—' : u.created,
    lastLaunch: invited ? '—' : u.lastActive,
    lastSignIn: invited ? 'Never' : u.lastActive,
    roleAssignments: [...direct, ...inherited],
    groups: u.groups.map((g) => ({ ...g, lifecycleSource: 'Local' })),
    orgWorkspaces: i % 4 === 1 ? [{ name: 'Acme — EMEA', role: 'Member' }] : [],
  };
});

// Team members: a generic team-access page with its own people, fields and
// wording so it reads as an example, not a copy of a product screen.
// Used by Examples › Team members.
const TEAM_DOMAIN = 'northwind.io';

const TEAM_PEOPLE = [
  ['Riya Mehta', 'Account owner', 'Active', 'Enabled', 'Single sign-on', 'Nov 3rd, 2025', '5 minutes ago', 'Self (created the team)'],
  ['Tomás Ferreira', 'Engineer', 'Active', 'Enabled', 'Single sign-on', 'Nov 4th, 2025', 'Yesterday', 'Riya Mehta'],
  ['Ingrid Lund', 'Analyst', 'Invited', 'Not set up', 'Email and password', 'Nov 5th, 2025', 'Never', 'Riya Mehta'],
  ['Marcus Adeyemi', 'Viewer', 'Active', 'Not set up', 'Email and password', 'Nov 6th, 2025', '2 days ago', 'Tomás Ferreira'],
  ['Hana Kobayashi', 'Engineer', 'Active', 'Enabled', 'Single sign-on', 'Nov 6th, 2025', '20 minutes ago', 'Riya Mehta'],
  ['Luca Bianchi', 'Engineer', 'Active', 'Enabled', 'Single sign-on', 'Nov 7th, 2025', '1 hour ago', 'Tomás Ferreira'],
  ['Amara Osei', 'Team admin', 'Active', 'Enabled', 'Single sign-on', 'Nov 7th, 2025', 'Just now', 'Riya Mehta'],
  ['Felix Bauer', 'Analyst', 'Active', 'Enabled', 'Email and password', 'Nov 10th, 2025', '3 hours ago', 'Amara Osei'],
  ['Zoe Lambert', 'Viewer', 'Invited', 'Not set up', 'Email and password', 'Nov 10th, 2025', 'Never', 'Amara Osei'],
  ['Omar Haddad', 'Engineer', 'Active', 'Enabled', 'Single sign-on', 'Nov 11th, 2025', '4 hours ago', 'Tomás Ferreira'],
  ['Sienna Park', 'Designer', 'Active', 'Enabled', 'Single sign-on', 'Nov 11th, 2025', 'Yesterday', 'Amara Osei'],
  ['Mateo Álvarez', 'Engineer', 'Deactivated', 'Enabled', 'Single sign-on', 'Nov 12th, 2025', '3 weeks ago', 'Riya Mehta'],
  ['Nadia Petrova', 'Analyst', 'Active', 'Enabled', 'Single sign-on', 'Nov 12th, 2025', '2 days ago', 'Felix Bauer'],
  ['Kwame Mensah', 'Viewer', 'Active', 'Not set up', 'Email and password', 'Nov 13th, 2025', '1 week ago', 'Amara Osei'],
  ['Elin Johansson', 'Team admin', 'Active', 'Enabled', 'Single sign-on', 'Nov 13th, 2025', '30 minutes ago', 'Riya Mehta'],
  ['Arjun Nair', 'Engineer', 'Active', 'Enabled', 'Single sign-on', 'Nov 14th, 2025', '6 hours ago', 'Elin Johansson'],
  ['Chloé Martin', 'Designer', 'Invited', 'Not set up', 'Single sign-on', 'Nov 17th, 2025', 'Never', 'Sienna Park'],
  ['Daniel Novak', 'Engineer', 'Active', 'Enabled', 'Single sign-on', 'Nov 17th, 2025', 'Yesterday', 'Elin Johansson'],
  ['Yara Saleh', 'Analyst', 'Active', 'Enabled', 'Email and password', 'Nov 18th, 2025', '5 days ago', 'Felix Bauer'],
  ['Björn Eriksson', 'Viewer', 'Deactivated', 'Not set up', 'Email and password', 'Nov 18th, 2025', '2 weeks ago', 'Amara Osei'],
  ['Priyanka Rao', 'Engineer', 'Active', 'Enabled', 'Single sign-on', 'Nov 19th, 2025', '45 minutes ago', 'Arjun Nair'],
  ['Samuel Okoro', 'Analyst', 'Active', 'Enabled', 'Single sign-on', 'Nov 20th, 2025', '8 hours ago', 'Elin Johansson'],
  ['Mia Chen', 'Designer', 'Active', 'Enabled', 'Single sign-on', 'Nov 20th, 2025', '2 hours ago', 'Sienna Park'],
  ['Jonas Weber', 'Viewer', 'Invited', 'Not set up', 'Email and password', 'Nov 21st, 2025', 'Never', 'Kwame Mensah'],
];

// Permission sets by job title; admins and owners get the broadest set.
const PERMISSIONS = {
  'Account owner': [
    ['Billing and plan', 'Manage'],
    ['Members and teams', 'Manage'],
    ['Projects', 'Manage'],
    ['Audit log', 'View'],
  ],
  'Team admin': [
    ['Members and teams', 'Manage'],
    ['Projects', 'Manage'],
    ['Audit log', 'View'],
  ],
  Engineer: [
    ['Projects', 'Edit'],
    ['Deployments', 'Run'],
    ['Secrets', 'View'],
  ],
  Designer: [
    ['Projects', 'Edit'],
    ['Design assets', 'Manage'],
  ],
  Analyst: [
    ['Projects', 'View'],
    ['Reports', 'Manage'],
    ['Data exports', 'Run'],
  ],
  Viewer: [['Projects', 'View']],
};

const TEAMS = {
  'Account owner': ['Leadership', 'Platform'],
  'Team admin': ['Leadership', 'Platform'],
  Engineer: ['Platform', 'Backend guild'],
  Designer: ['Product design'],
  Analyst: ['Insights'],
  Viewer: [],
};

const TEAM_SIZES = {
  Leadership: 3,
  Platform: 11,
  'Backend guild': 7,
  'Product design': 4,
  Insights: 6,
};

const PROJECTS = [
  ['Checkout redesign', 'Active'],
  ['Data warehouse migration', 'Active'],
  ['Mobile app 2.0', 'Planning'],
  ['Partner API', 'Active'],
  ['Billing platform', 'On hold'],
];

export const teamMembers = TEAM_PEOPLE.map(
  ([name, role, status, mfa, signIn, created, lastActive, invitedBy], i) => {
    const [firstName, ...rest] = name.split(' ');
    const username = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(' ', '.');
    const invited = status === 'Invited';
    const projectCount = invited ? 0 : role === 'Viewer' ? 1 : 1 + (i % 3);
    return {
      id: `mbr_${(0x7f3a + i * 0x2b1).toString(16)}`,
      name,
      firstName,
      lastName: rest.join(' '),
      initials: name
        .split(' ')
        .map((p) => p[0])
        .join(''),
      username,
      email: `${username}@${TEAM_DOMAIN}`,
      role,
      status,
      mfa,
      signIn,
      created,
      lastActive,
      invitedBy,
      memberSince: invited ? 'Invite pending' : created,
      permissions: invited
        ? []
        : PERMISSIONS[role].map(([area, level]) => ({ area, level })),
      teams: invited
        ? []
        : TEAMS[role].map((t) => ({ name: t, members: TEAM_SIZES[t] })),
      projects: Array.from({ length: projectCount }, (_, k) => {
        const [title, state] = PROJECTS[(i + k) % PROJECTS.length];
        return { name: title, state, role: role === 'Viewer' ? 'Viewer' : 'Contributor' };
      }),
      // Fields the shared list row and search expect
      groups: [],
      activity: [],
    };
  },
);
