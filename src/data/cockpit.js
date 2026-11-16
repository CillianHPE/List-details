import { accounts } from './accounts';

// Sales Cockpit dataset (Figma mNCeAPPHJ2E8NtLaJlqSpM · 180:24254 collection,
// 180:24255 detail pages). Content mirrors the Cosmote example and is
// derived for the other accounts so every row has a complete detail.

export const PERIODS = ['30 days', '3 months', '6 months', '12 months'];

// Portfolio-level figures shown above the list–detail surface.
export const portfolio = {
  kpis: [
    { label: 'User scored', value: '114', note: 'Across 15 workspaces' },
    { label: 'Power users', value: '0', note: '0.0% of users' },
    {
      label: 'At-risk or inactive',
      value: '100',
      unit: '%',
      note: '87.7% of users',
    },
    {
      label: 'Users with Amplitude',
      value: '10',
      unit: 'of 114',
      note: 'vs ~28% platform-wide',
    },
  ],
  tierDistribution: {
    caption: 'Scored monthly · May – Oct 2026',
    months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, i) => ({
      month,
      inactive: 1200 + i * 40,
      atRisk: 1000 - i * 30,
      powerUser: 1300 + i * 20,
      active: 500 + i * 25,
    })),
  },
  dataNotes: [
    'Scores are computed nightly from platform access events, device activity and workspace configuration. They may lag source systems by up to 24 hours.',
    'User identifiers are masked. Amplitude coverage is limited to users who opted into product analytics.',
    'Login counts are platform access events and may not correspond one-to-one with authentication sign-ins.',
  ],
};

export const TIERS = [
  { key: 'inactive', label: 'Inactive', color: 'status-critical' },
  { key: 'atRisk', label: 'At-risk', color: 'status-warning' },
  { key: 'powerUser', label: 'Power user', color: 'status-ok' },
  { key: 'active', label: 'Active', color: 'status-unknown' },
];

export const SERVICES = [
  { key: 'pcai', label: 'PCAI', color: 'graph-0' },
  { key: 'opsramp', label: 'OPSRAMP', color: 'graph-1' },
  { key: 'dataServices', label: 'Data Services', color: 'graph-2' },
  { key: 'consumption', label: 'Consumption Analytics', color: 'graph-3' },
  { key: 'other', label: 'Other', color: 'status-unknown' },
];

const CONFIG_CHECKS = [
  ['MFA enabled', 'Add an extra layer of sign-in security.'],
  ['Custom roles in use', 'Tailor permissions with custom roles.'],
  ['Device location coverage', 'Assign locations to organize your devices.'],
  ['Device tag coverage', 'Tag devices for easy grouping and filtering.'],
  ['Default region set', 'Choose a default region for your services.'],
  ['Quick links configured', 'Set up shortcuts to frequently used pages.'],
  ['SSO / SAML', 'Sign in with your identity provider.'],
  ['IP access rules', 'Control access by IP address.'],
];

const PROVISIONED_APPS = [
  ['Data services', 'Manage and protect data'],
  ['Opsramp', 'Monitor IT operations'],
  ['Consumption Analytics', 'Track usage and costs'],
  ['PCAI', 'Build and deploy AI'],
];

// Deterministic pseudo-random so derived accounts look varied but stable.
const seeded = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const tierOf = (score) =>
  score > 60 ? 'Healthy' : score > 40 ? 'Neutral' : 'At risk';

const configStatus = (ok, warn) =>
  ok ? 'Configured' : warn ? 'Warning' : 'Not configured';

const domainOf = (name) =>
  `${name
    .split(/\s|\./)[0]
    .toLowerCase()
    .replace(/[^a-z]/g, '')}.gr`;

const buildAccount = (a, index) => {
  const rnd = seeded(index + 7);
  const admins = Math.max(1, Math.round(a.userCount * 0.5));
  const activeAdmins = Math.min(admins, a.activeUsers);
  const logins = Math.round(a.activeUsers * 24 + rnd() * 40);
  const domain = domainOf(a.name);
  const city =
    a.country === 'Greece'
      ? 'Athens'
      : a.country === 'Cyprus'
        ? 'Nicosia'
        : 'Thessaloniki';

  const tierMix = {
    inactive: Math.round(30 + rnd() * 20),
    atRisk: Math.round(20 + rnd() * 35),
    powerUser: Math.round(rnd() * 5),
  };
  tierMix.active = 100 - tierMix.inactive - tierMix.atRisk - tierMix.powerUser;

  const loginActivity = Array.from({ length: 16 }, (_, i) => ({
    day: i * 2,
    value: Math.round(
      Math.min(100, Math.max(0, 10 + i * 5 + (rnd() - 0.5) * 40)),
    ),
  }));

  const configResults = CONFIG_CHECKS.map(([name, description], i) => {
    const r = rnd();
    const ok = a.health.tier === 'Healthy' ? r > 0.25 : r > 0.65;
    const critical = !ok && i < 2;
    return {
      name,
      description,
      status: configStatus(ok, !critical && r > 0.3),
      severity: ok ? 'ok' : critical ? 'critical' : 'warning',
    };
  });
  const gaps = configResults.filter((c) => c.severity !== 'ok');

  const nextSteps = [
    gaps.find((g) => g.name === 'MFA enabled') && {
      title: 'Verify/enforce MFA with the workspace admin',
      description: 'Ask your admin to require two-step sign-in.',
    },
    gaps.find((g) => g.name === 'IP access rules') && {
      title: 'Review IP access rule configuration',
      description: 'Check which IP addresses have access.',
    },
    a.activeDevices / a.devices < 0.5 && {
      title: 'Activate claimed devices',
      description: `${a.devices - a.activeDevices} claimed devices have never reported in.`,
    },
    a.activeUsers / a.userCount < 0.3 && {
      title: 'Re-engage dormant administrators',
      description: 'Most admins have not signed in during the last 30 days.',
    },
  ].filter(Boolean);

  const mostActiveUsers = a.users.map((u, i) => ({
    ...u,
    roles: [
      'Administrator',
      i % 2 ? 'Private Cloud AI Administrator' : 'Workspace Administrator',
    ],
    moreRoles: Math.round(rnd() * 9),
    mfa: rnd() > 0.4 ? 'Yes' : 'No',
    anomaly: i === 0 && a.anomalies.length ? 'Excessive logins' : '--',
  }));

  const amplitude = a.users.slice(0, 5).map((u) => {
    const days = Math.round(1 + rnd() * 11);
    return {
      handle: u.handle,
      app: 'OpsRamp',
      clicks: days + Math.round(rnd() * 2),
      days,
    };
  });

  const serviceLaunches = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map(
    (month) => ({
      month,
      pcai: 800 + Math.round(rnd() * 200),
      opsramp: 700 + Math.round(rnd() * 200),
      dataServices: 500 + Math.round(rnd() * 200),
      consumption: 300 + Math.round(rnd() * 100),
      other: 100 + Math.round(rnd() * 100),
    }),
  );

  const subscriptions = [
    {
      name: 'CENTRAL_STORAGE — FOUNDATION_STORAGE',
      productType: 'Device',
      evaluation: 'Paid',
      quantity: 1,
      endDate: '2115-06-03',
      status: 'Started',
    },
    {
      name: 'OPSRAMP — ET',
      productType: 'Service',
      evaluation: 'Paid',
      quantity: 1,
      endDate: '2115-08-25',
      status: 'Started',
    },
    ...[
      'ADVANCE_72XX',
      'ADVANCED_AP',
      'ADVANCE_70XX',
      'ADVANCED_92XX_SEC',
      'ADVANCED_SWITCH_6300',
      'ADVANCED_91XX',
    ]
      .slice(0, 2 + Math.round(rnd() * 4))
      .map((sku) => ({
        name: `CENTRAL_${sku.includes('AP') ? 'AP' : sku.includes('SWITCH') ? 'SWITCH' : 'GW'} — ${sku}`,
        productType: 'Device',
        evaluation: 'Evaluation',
        quantity: sku.includes('AP') ? 10 : sku.includes('SWITCH') ? 5 : 2,
        endDate: '2023-10-08',
        status: 'Ended',
      })),
  ];

  const signals = [
    [
      `Only `,
      `${a.activeUsers} of ${a.userCount}`,
      ` users active in the last `,
      `30 days`,
    ],
    [`Only `, `${a.activeDevices} of ${a.devices}`, ` devices active`],
    [
      `Workspace configuration incomplete `,
      `(${a.health.dimensions.configuration}/100)`,
    ],
  ];

  return {
    ...a,
    domain,
    location: `${city}, ${a.country}`,
    industryLabel:
      a.industry === 'Technology & Digital' ? 'Telecommunications' : a.industry,
    signals,
    nextSteps,
    kpis: {
      users: {
        total: a.userCount,
        active: a.activeUsers,
        dormant: a.userCount - a.activeUsers,
      },
      admins: {
        total: admins,
        active: activeAdmins,
        dormant: admins - activeAdmins,
      },
      logins: { total: logins, delta: Math.round((rnd() - 0.6) * 40) },
    },
    tierMix,
    loginActivity,
    mostActiveUsers,
    adoptionChecks: [
      {
        name: 'Seats assigned to devices',
        result: `${Math.min(a.activeDevices, 2)} of 2`,
        gaps: 2 - Math.min(a.activeDevices, 2),
      },
      {
        name: 'Claimed devices fully active',
        result: `${a.activeDevices} of ${a.devices}`,
        gaps: a.devices - a.activeDevices,
      },
      {
        name: 'New devices activated (last 90 days)',
        result: '--',
        gaps: null,
      },
    ],
    provisionedApps: PROVISIONED_APPS.map(([name, description]) => ({
      name,
      description,
    })),
    serviceLaunches,
    amplitude,
    configChecks: configResults,
    subscriptions,
    benchmark: {
      score: a.benchmark ? Math.round(a.benchmark.account) : a.health.score,
      tier: tierOf(
        a.benchmark ? Math.round(a.benchmark.account) : a.health.score,
      ),
    },
  };
};

export const cockpitAccounts = accounts.map(buildAccount);
