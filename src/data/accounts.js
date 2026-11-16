// Customer-portfolio accounts, modelled on the redesigned Portfolio /
// Accounts / User insights pages. Each account carries the facets those
// pages show: health score with its weighted dimensions, usage counts,
// scored users (engagement), configuration gaps and subscriptions.
// Health: Healthy 61–100 · Neutral 41–60 · At risk 0–40.

const healthTier = (score) =>
  score > 60 ? 'Healthy' : score > 40 ? 'Neutral' : 'At risk';

const engagementTier = (score) =>
  score >= 80
    ? 'Power user'
    : score >= 50
      ? 'Active'
      : score >= 20
        ? 'At-risk'
        : 'Inactive';

const user = (handle, role, score, lastAccess) => ({
  handle,
  role,
  score,
  tier: engagementTier(score),
  lastAccess,
});

const account = (a) => {
  const dims = a.dimensions;
  return {
    ...a,
    initials: a.name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase(),
    health: { score: a.score, tier: healthTier(a.score), dimensions: dims },
    users: a.users.map((u) => user(...u)),
  };
};

export const accounts = [
  account({
    id: '3dd8b33a1f4c11eeb0be1aa2f208b367',
    name: 'Cosmote',
    industry: 'Technology & Digital',
    sector: 'Software & SaaS',
    type: 'Standalone',
    country: 'Greece',
    created: '2023-07-10',
    score: 45,
    summary:
      'Only 1 of 9 devices active · Workspace configuration incomplete (33/100)',
    dimensions: { adoption: 32, configuration: 33, engagement: 42, risk: 100 },
    userCount: 38,
    activeUsers: 6,
    devices: 9,
    activeDevices: 1,
    lastLogin: '2026-10-27',
    gaps: ['MFA not configured', 'No IP access rules configured'],
    anomalies: [
      { who: 'NYD6O6Hn@telekom.gr', what: 'Excessive logins' },
      { who: 'H7Uj1K3/@telekom.gr', what: 'High login frequency' },
    ],
    benchmark: { rank: 2, of: 4, account: 60.4, sector: 32.8 },
    subscriptions: [
      {
        name: 'GreenLake Compute Ops Management',
        tier: 'Enhanced',
        devices: 9,
        ends: '2027-06-30',
        status: 'Active',
      },
      {
        name: 'Aruba Central Foundation',
        tier: 'Foundation',
        devices: 0,
        ends: '2026-12-31',
        status: 'Active',
      },
    ],
    users: [
      ['NYD6O6Hn@telekom.gr', 'Admin', 66, '2026-10-27 (1d ago)'],
      ['H7Uj1K3/@telekom.gr', 'Admin', 58, '2026-10-26 (2d ago)'],
      ['pQ2xLm9z@telekom.gr', 'Operator', 31, '2026-08-14 (75d ago)'],
      ['v8RtKe3a@telekom.gr', '2 role(s)', 14, 'Never'],
    ],
  }),
  account({
    id: '7f1c0a4e2b3d11eeb0be1aa2f208b367',
    name: 'Alpha Bank',
    industry: 'Financial Services',
    sector: 'Banking',
    type: 'Standalone',
    country: 'Greece',
    created: '2022-11-02',
    score: 38,
    summary: 'Three of four admins at-risk · No product-usage instrumentation',
    dimensions: { adoption: 24, configuration: 55, engagement: 21, risk: 100 },
    userCount: 61,
    activeUsers: 4,
    devices: 42,
    activeDevices: 30,
    lastLogin: '2026-10-19',
    gaps: ['SSO not enforced'],
    anomalies: [],
    benchmark: { rank: 5, of: 7, account: 28.1, sector: 41.2 },
    subscriptions: [
      {
        name: 'GreenLake Compute Ops Management',
        tier: 'Standard',
        devices: 42,
        ends: '2027-01-15',
        status: 'Active',
      },
    ],
    users: [
      ['EZ/HUli9@alpha', 'Admin', 68, '2026-10-19 (9d ago)'],
      ['+BjHHVTm@alpha.gr', 'Admin', 21, '2023-04-04 (1303d ago)'],
      ['t4Bz5rpG@alpha', 'Admin', 20.5, 'Never'],
      ['wmt3l0CM@alpha.gr', 'Admin', 20.5, '2025-10-24 (369d ago)'],
    ],
  }),
  account({
    id: 'a2e94c7d6f5011eeb0be1aa2f208b367',
    name: 'Anatolia College',
    industry: 'Education',
    sector: 'Higher education',
    type: 'Standalone',
    country: 'Greece',
    created: '2024-02-19',
    score: 71,
    summary: 'All devices active · Both admins active in the last 14 days',
    dimensions: { adoption: 78, configuration: 70, engagement: 65, risk: 20 },
    userCount: 12,
    activeUsers: 7,
    devices: 18,
    activeDevices: 18,
    lastLogin: '2026-10-23',
    gaps: [],
    anomalies: [],
    benchmark: { rank: 1, of: 3, account: 83.3, sector: 47.0 },
    subscriptions: [
      {
        name: 'Aruba Central Advanced',
        tier: 'Advanced',
        devices: 18,
        ends: '2028-02-19',
        status: 'Active',
      },
    ],
    users: [
      ['xR/HtTMj@act.edu', 'Admin', 67.4, '2026-10-15 (13d ago)'],
      ['BTuchlwM@act.edu', '2 role(s)', 63, '2026-10-23 (5d ago)'],
      ['k9LpQw2e@act.edu', 'Observer', 52, '2026-10-20 (8d ago)'],
    ],
  }),
  account({
    id: 'c4b11f8e9a0711eeb0be1aa2f208b367',
    name: 'Creta Farm S.A.',
    industry: 'Manufacturing',
    sector: 'Food & beverage',
    type: 'MSP-managed',
    country: 'Greece',
    created: '2021-06-30',
    score: 22,
    summary: 'No logins in 18 months · Subscription lapsed',
    dimensions: { adoption: 10, configuration: 40, engagement: 8, risk: 100 },
    userCount: 5,
    activeUsers: 0,
    devices: 6,
    activeDevices: 0,
    lastLogin: '2025-04-11',
    gaps: ['MFA not configured', 'Subscription expired'],
    anomalies: [],
    benchmark: null,
    subscriptions: [
      {
        name: 'GreenLake Compute Ops Management',
        tier: 'Standard',
        devices: 6,
        ends: '2025-03-31',
        status: 'Expired',
      },
    ],
    users: [
      ['HZSFVvQ0@cretafarm.gr', '4 role(s)', 13.5, '2025-04-11 (565d ago)'],
    ],
  }),
  account({
    id: 'e6d3a2c1b8f911eeb0be1aa2f208b367',
    name: 'Eurobank Equities',
    industry: 'Financial Services',
    sector: 'Investment services',
    type: 'Standalone',
    country: 'Greece',
    created: '2023-01-12',
    score: 41,
    summary: 'Admins disengaged · Configuration complete',
    dimensions: { adoption: 45, configuration: 88, engagement: 24, risk: 60 },
    userCount: 23,
    activeUsers: 3,
    devices: 14,
    activeDevices: 11,
    lastLogin: '2026-04-14',
    gaps: [],
    anomalies: [
      { who: 'c3uuboEw@eurobankequities.gr', what: 'Login from new country' },
    ],
    benchmark: { rank: 3, of: 7, account: 39.1, sector: 41.2 },
    subscriptions: [
      {
        name: 'GreenLake Compute Ops Management',
        tier: 'Enhanced',
        devices: 14,
        ends: '2027-09-01',
        status: 'Active',
      },
      {
        name: 'HPE Sustainability Insight Center',
        tier: 'Standard',
        devices: 0,
        ends: '2099-12-31',
        status: 'Active',
      },
    ],
    users: [
      ['6M+xdh3B@eurobankequities.gr', 'Admin', 37.1, '2026-04-14 (197d ago)'],
      ['c3uuboEw@eurobankequities.gr', 'Admin', 21, '2023-06-01 (1245d ago)'],
      ['cqXqRbXG@eurobankequities.gr', '1 role(s)', 13, 'Never'],
    ],
  }),
  account({
    id: '0b7e5d4c3a2111eeb0be1aa2f208b367',
    name: 'Hellenic Petroleum',
    industry: 'Energy & Utilities',
    sector: 'Oil & gas',
    type: 'Standalone',
    country: 'Greece',
    created: '2022-03-08',
    score: 64,
    summary: 'Healthy adoption · One configuration gap',
    dimensions: { adoption: 72, configuration: 58, engagement: 61, risk: 35 },
    userCount: 44,
    activeUsers: 19,
    devices: 120,
    activeDevices: 104,
    lastLogin: '2026-10-28',
    gaps: ['No IP access rules configured'],
    anomalies: [],
    benchmark: { rank: 1, of: 2, account: 71.0, sector: 55.4 },
    subscriptions: [
      {
        name: 'GreenLake Compute Ops Management',
        tier: 'Enhanced',
        devices: 96,
        ends: '2027-03-08',
        status: 'Active',
      },
      {
        name: 'GreenLake Data Services',
        tier: 'Standard',
        devices: 24,
        ends: '2027-03-08',
        status: 'Active',
      },
    ],
    users: [
      ['Lq8Zx2Vn@helpe.gr', 'Admin', 81, '2026-10-28 (today)'],
      ['Wt3Ym7Ks@helpe.gr', 'Operator', 74, '2026-10-27 (1d ago)'],
      ['Rd5Pn1Jg@helpe.gr', 'Operator', 48, '2026-09-30 (28d ago)'],
    ],
  }),
  account({
    id: '19ac6f3e5d7b11eeb0be1aa2f208b367',
    name: 'Intralot',
    industry: 'Technology & Digital',
    sector: 'Software & SaaS',
    type: 'MSP-managed',
    country: 'Greece',
    created: '2023-09-21',
    score: 53,
    summary: 'Usage steady · Engagement below sector average',
    dimensions: { adoption: 55, configuration: 62, engagement: 40, risk: 55 },
    userCount: 17,
    activeUsers: 5,
    devices: 31,
    activeDevices: 26,
    lastLogin: '2026-10-25',
    gaps: ['MFA not configured'],
    anomalies: [],
    benchmark: { rank: 3, of: 4, account: 41.2, sector: 32.8 },
    subscriptions: [
      {
        name: 'Aruba Central Foundation',
        tier: 'Foundation',
        devices: 31,
        ends: '2026-11-30',
        status: 'Expiring',
      },
    ],
    users: [
      ['Gh4Tk9Qa@intralot.com', 'Admin', 59, '2026-10-25 (3d ago)'],
      ['Zp2Nv6Xc@intralot.com', '3 role(s)', 33, '2026-07-02 (118d ago)'],
    ],
  }),
  account({
    id: '2cd0e8b7a9f311eeb0be1aa2f208b367',
    name: 'Piraeus Port Authority',
    industry: 'Transport & Logistics',
    sector: 'Ports & shipping',
    type: 'Standalone',
    country: 'Greece',
    created: '2024-05-14',
    score: 78,
    summary: 'Fully configured · High engagement',
    dimensions: { adoption: 80, configuration: 95, engagement: 72, risk: 10 },
    userCount: 9,
    activeUsers: 8,
    devices: 52,
    activeDevices: 52,
    lastLogin: '2026-10-28',
    gaps: [],
    anomalies: [],
    benchmark: { rank: 1, of: 1, account: 88.9, sector: 88.9 },
    subscriptions: [
      {
        name: 'Aruba Central Advanced',
        tier: 'Advanced',
        devices: 52,
        ends: '2029-05-14',
        status: 'Active',
      },
    ],
    users: [
      ['Bf7Lw3Rt@olp.gr', 'Admin', 86, '2026-10-28 (today)'],
      ['Mn1Kd8Ye@olp.gr', 'Operator', 79, '2026-10-28 (today)'],
      ['Xs6Qc2Hv@olp.gr', 'Observer', 64, '2026-10-21 (7d ago)'],
    ],
  }),
];
