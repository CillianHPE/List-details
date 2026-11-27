// Servers dataset: a fictional fleet for the Servers example. Each record
// carries everything the detail's Overview · Health · Firmware · Hardware ·
// Storage · Support tabs need so richer content types (status lists, tables,
// inventories) can be read side by side with the list. Names, models and
// sites are invented; the structure is what matters.

export const HEALTH = ['OK', 'Warning', 'Critical', 'Unknown'];

const MODELS = {
  r120: 'Atlas R120 rack server',
  r240: 'Atlas R240 rack server',
  r360: 'Atlas R360 rack server',
  e40: 'Atlas E40 edge server',
};

const FIRMWARE_BASE = [
  ['System firmware', 'System board', '4.12.0 (Jan 2026)'],
  ['Management controller', 'System board', '2.81'],
  ['Power management controller', 'System board', '1.3.2'],
  ['Programmable logic device', 'System board', '0x0F'],
  ['Power supply', 'Bay 1', '1.04'],
  ['Power supply', 'Bay 2', '1.04'],
  ['Storage controller', 'Storage slot 1', '7.10'],
  ['Energy pack', 'Embedded device', '0.82'],
  ['25Gb 2-port network adapter', 'PCIe slot 1', '16.40.1000'],
  ['10Gb 2-port network adapter', 'OCP slot 10', '220.0.12.0'],
  ['1.6TB NVMe SSD', 'Bay 1', 'NV21'],
  ['1.6TB NVMe SSD', 'Bay 2', 'NV21'],
].map(([name, location, version]) => ({ name, location, version }));

const DRIVERS_BASE = [
  ['Hypervisor network driver', '2.14.0-1 build 48120'],
  ['Hypervisor storage driver', '7.2.1-3 build 48120'],
  ['Management agent', '5.4.0'],
  ['Fibre Channel adapter driver', '14.6.0-2 build 47310'],
  ['NVMe driver', '1.9.3'],
].map(([name, version]) => ({ name, version }));

const COMPONENTS = [
  'Fans',
  'Fan redundancy',
  'Temperature',
  'Power supplies',
  'Power supply redundancy',
  'Processors',
  'Memory',
  'Storage',
  'Energy pack',
  'Network links',
  'System firmware',
];

const severityOf = (status) =>
  ({
    OK: 'ok',
    Redundant: 'ok',
    Warning: 'warning',
    Degraded: 'warning',
    'Not redundant': 'warning',
    Critical: 'critical',
    Failed: 'critical',
    Unknown: 'unknown',
  })[status] ?? 'unknown';

const componentHealth = (overrides = {}) =>
  COMPONENTS.map((name) => ({
    name,
    status:
      overrides[name] ?? (name.endsWith('redundancy') ? 'Redundant' : 'OK'),
    severity: overrides[name] ? severityOf(overrides[name]) : 'ok',
  }));

const memory = (slots, filled, size = '32 GiB', part = 'AM-32R4-29') =>
  Array.from({ length: filled }, (_, i) => ({
    location: `CPU ${i < slots / 2 ? 1 : 2} slot ${(i % (slots / 2)) + 1}`,
    type: 'DDR5',
    size,
    speed: '4800 MT/s',
    technology: 'RDIMM',
    serial: (0x4a1c33f0 + i * 6151).toString(16).toUpperCase().slice(0, 8),
    part,
  }));

const SITES = {
  north: { name: 'North data centre', address: 'Building 4, Harbour Park, Dublin' },
  south: { name: 'South data centre', address: 'Unit 12, Riverside Campus, Lisbon' },
  edge: { name: 'Retail edge', address: 'Store 118, High Street, Leeds' },
};

const server = ({
  id,
  name,
  serial,
  health,
  mgmtSecurity = 'OK',
  state = 'Connected',
  baseline = '2026.01',
  baselineProgress,
  group,
  power = 'On',
  model,
  mgmtIp,
  location = SITES.north,
  os = 'Hypervisor 8.1, build 31042',
  subscription = 'Advanced, renews 8 Dec 2027',
  support = { status: 'Active', expires: '30 Jun 2028', cases: 0 },
  alerts = 0,
  components = {},
  memorySlots = [16, 8],
  processors = [
    { name: 'Atlas 7400 series, 24 cores', max: '4.1 GHz', rated: '2.8 GHz', cores: 24, threads: 48 },
  ],
  volumes = [
    { controller: 'Storage controller, slot 1', name: 'boot-vol-01', state: 'OK', capacity: '745 GiB', raid: 'RAID 1', drives: 2, spares: 0 },
  ],
  disconnectedSince,
  lastCollection = '18 Feb 2026, 19:48',
}) => ({
  id,
  name,
  serial,
  health,
  mgmtSecurity,
  state,
  baseline:
    state === 'Connected' ? `${baselineProgress ?? 100}% of ${baseline}` : '--',
  baselineName: baseline,
  group,
  power,
  model: MODELS[model],
  connectionType: 'Direct',
  manufacturer: 'Atlas Systems',
  uuid: `4f2a${serial.slice(0, 4).toLowerCase()}-71c3-4e02-9b1d-${serial
    .slice(-6)
    .toLowerCase()}a0e4c1`,
  mgmtIp,
  mgmtHostname: `${name}-mgmt.corp.example`,
  productId: `AS-${model.toUpperCase()}-2U`,
  uidIndicator: 'Off',
  os,
  subscription,
  platform: 'Atlas rack',
  autoFirmwareUpdate: state === 'Connected' ? 'Enabled' : 'Disabled',
  location,
  notifications: {
    issues: true,
    powerState: false,
    disconnect: false,
    dailySummary: true,
  },
  alerts,
  componentHealth: componentHealth(components),
  firmware: FIRMWARE_BASE,
  drivers: DRIVERS_BASE,
  lastFirmwareOperation:
    state === 'Connected'
      ? `Baseline ${baseline} applied ${lastCollection}`
      : 'No firmware update has been attempted.',
  hardware: {
    lastCollection,
    formFactor: model === 'e40' ? '1U' : '2U',
    chassisType: 'Rack mount',
    processors,
    memory: memory(memorySlots[0], memorySlots[1]),
    memorySlots,
    networkAdapters: [
      {
        name: 'PCIe slot 1, 25Gb 2-port adapter',
        ports: [
          { port: 1, address: '02:1A:4C:00:3B:10' },
          { port: 2, address: '02:1A:4C:00:3B:11' },
        ],
      },
      {
        name: 'OCP slot 10, 10Gb 2-port adapter',
        ports: [
          { port: 1, address: '02:1A:4C:00:5E:20' },
          { port: 2, address: '02:1A:4C:00:5E:21' },
        ],
      },
    ],
  },
  volumes,
  support,
  disconnectedSince,
});

const TWO_SOCKET = [
  { name: 'Atlas 8400 series, 32 cores', max: '3.4 GHz', rated: '2.1 GHz', cores: 32, threads: 64 },
  { name: 'Atlas 8400 series, 32 cores', max: '3.4 GHz', rated: '2.1 GHz', cores: 32, threads: 64 },
];

export const servers = [
  server({
    id: 'srv-1',
    name: 'north-db-02',
    serial: 'AT24K1120Q',
    health: 'Unknown',
    state: 'Not connected',
    group: 'North database cluster',
    power: 'Off',
    model: 'r240',
    mgmtIp: '10.26.4.22',
    disconnectedSince: '5 Nov 2025, 14:36',
    support: { status: 'Expired', expires: '20 Dec 2025', cases: 0 },
    components: Object.fromEntries(COMPONENTS.map((c) => [c, 'Unknown'])),
  }),
  server({
    id: 'srv-2',
    name: 'north-db-01',
    serial: 'AT24K1120R',
    health: 'Unknown',
    state: 'Not connected',
    group: 'North database cluster',
    power: 'Off',
    model: 'r240',
    mgmtIp: '10.26.4.21',
    disconnectedSince: '5 Nov 2025, 14:31',
    support: { status: 'Expired', expires: '20 Dec 2025', cases: 0 },
    components: Object.fromEntries(COMPONENTS.map((c) => [c, 'Unknown'])),
  }),
  server({
    id: 'srv-3',
    name: 'north-app-02',
    serial: 'AT25C0471F',
    health: 'OK',
    group: 'North application cluster',
    model: 'r120',
    mgmtIp: '10.26.4.12',
  }),
  server({
    id: 'srv-4',
    name: 'north-app-01',
    serial: 'AT25C0471H',
    health: 'OK',
    group: 'North application cluster',
    model: 'r120',
    mgmtIp: '10.26.4.11',
    lastCollection: '18 Feb 2026, 19:46',
  }),
  server({
    id: 'srv-5',
    name: 'south-core-01',
    serial: 'AT23M2290L',
    health: 'Warning',
    group: 'South core cluster',
    model: 'r360',
    mgmtIp: '10.42.8.31',
    location: SITES.south,
    alerts: 1,
    memorySlots: [32, 16],
    components: { 'Fan redundancy': 'Not redundant' },
    processors: TWO_SOCKET,
    lastCollection: '17 Feb 2026, 23:02',
    volumes: [
      { controller: 'Storage controller, slot 1', name: 'boot-vol-01', state: 'OK', capacity: '745 GiB', raid: 'RAID 1', drives: 2, spares: 0 },
      { controller: 'Storage controller, slot 1', name: 'data-vol-01', state: 'OK', capacity: '5.8 TiB', raid: 'RAID 10', drives: 8, spares: 1 },
    ],
  }),
  server({
    id: 'srv-6',
    name: 'south-core-02',
    serial: 'AT23M2290M',
    health: 'Critical',
    group: 'South core cluster',
    model: 'r360',
    mgmtIp: '10.42.8.32',
    location: SITES.south,
    alerts: 3,
    memorySlots: [32, 16],
    components: {
      'Power supplies': 'Failed',
      'Power supply redundancy': 'Not redundant',
    },
    processors: TWO_SOCKET,
    support: { status: 'Active', expires: '14 Mar 2027', cases: 1 },
    lastCollection: '17 Feb 2026, 23:04',
    volumes: [
      { controller: 'Storage controller, slot 1', name: 'boot-vol-01', state: 'OK', capacity: '745 GiB', raid: 'RAID 1', drives: 2, spares: 0 },
      { controller: 'Storage controller, slot 1', name: 'data-vol-01', state: 'Degraded', capacity: '5.8 TiB', raid: 'RAID 10', drives: 8, spares: 0 },
    ],
  }),
  server({
    id: 'srv-7',
    name: 'leeds-edge-01',
    serial: 'AT25E0318A',
    health: 'OK',
    group: 'Retail edge',
    model: 'e40',
    mgmtIp: '10.42.9.11',
    location: SITES.edge,
    memorySlots: [8, 4],
    processors: [
      { name: 'Atlas 5200 series, 12 cores', max: '3.9 GHz', rated: '2.0 GHz', cores: 12, threads: 24 },
    ],
    lastCollection: '18 Feb 2026, 01:15',
    volumes: [],
  }),
  server({
    id: 'srv-8',
    name: 'north-lab-03',
    serial: 'AT24L0902C',
    health: 'OK',
    mgmtSecurity: 'Ignore risk',
    group: 'North lab',
    model: 'r120',
    mgmtIp: '10.26.7.13',
    power: 'Off',
    baselineProgress: 60,
    subscription: 'Standard, renews 1 Mar 2026',
    lastCollection: '12 Feb 2026, 06:42',
  }),
  server({
    id: 'srv-9',
    name: 'north-lab-02',
    serial: 'AT24L0902B',
    health: 'Warning',
    mgmtSecurity: 'At risk',
    group: 'North lab',
    model: 'r120',
    mgmtIp: '10.26.7.12',
    baselineProgress: 40,
    alerts: 1,
    components: { Temperature: 'Warning' },
    subscription: 'Standard, renews 1 Mar 2026',
    lastCollection: '16 Feb 2026, 08:10',
  }),
];

// Quick filters shown in the list toolbar
export const needsAttention = (s) =>
  s.health === 'Warning' || s.health === 'Critical' || s.alerts > 0;
