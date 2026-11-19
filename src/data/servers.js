// Servers dataset — HPE GreenLake Compute Ops Management (FigJam
// FoohSpgNF5QhNv5d0se2ot · 1359:30073). Today COM shows a Servers table and
// drills into a separate page with Summary · Health · Firmware · Hardware ·
// Storage · Support tabs; this dataset carries everything those tabs need so
// the same content can be read side by side.

export const HEALTH = ['OK', 'Warning', 'Critical', 'Unknown'];

const MODELS = {
  dl325v2: 'ProLiant DL325 Gen10 Plus v2',
  dl325: 'ProLiant DL325 Gen10 Plus',
  dl380: 'ProLiant DL380 Gen11',
  dl360: 'ProLiant DL360 Gen11',
};

const FIRMWARE_BASE = [
  ['Power Supply Firmware', 'Bay 2', '1.00'],
  ['Embedded Video Controller', 'Embedded Device', '2.5'],
  ['HPE Smart Storage Energy Pack 1 Firmware', 'Embedded Device', '0.70'],
  ['10Gb 2-port SFP+ BCM57412 OCP3 Adapter', 'OCP 3.0 Slot 10', '214.0.194.0'],
  ['HPE Eth 10/25Gb 2p 640SFP28 Adptr', 'PCI-E Slot 1', '14.32.1010'],
  ['800GB 12G SAS SSD', 'Slot=12:Port=1I:Box=1:Bay=1', 'HPD3'],
  ['800GB 12G SAS SSD', 'Slot=12:Port=1I:Box=1:Bay=2', 'HPD3'],
  ['HPE Smart Array P408i-a SR Gen10', 'Storage Slot 12', '6.52'],
  ['iLO 5', 'System Board', '3.06 Jul 10 2024'],
  ['Intelligent Platform Abstraction Data', 'System Board', '12.2.0 Build 37'],
  ['Intelligent Provisioning', 'System Board', '3.40.192'],
  ['Power Management Controller Firmware', 'System Board', '1.1.4'],
  ['Redundant System ROM', 'System Board', 'A43 v2.68 (02/06/2023)'],
  ['System Programmable Logic Device', 'System Board', '0x0D'],
  ['System ROM', 'System Board', 'A43 v3.10 (05/16/2024)'],
].map(([name, location, version]) => ({ name, location, version }));

const DRIVERS_BASE = [
  ['IMA plugin for elxiscsi driver', '12.0.1200.0-4vmw.703.0.20.19193900'],
  ['Emulex FCoE Driver', '12.0.1500.2-3vmw.703.0.20.19193900'],
  ['lpfc: Broadcom Emulex FC adapter driver', '14.2.567.0-1OEM.700.1.0.15843807'],
  ['Broadcom NetXtreme-E VMKAPI network and RoCE driver', '228.0.216.0-1OEM.700.1.0.15843807'],
  ['iscsi driver for VMware ESX', '12.0.1200.0-9vmw.703.0.20.19193900'],
  ['net driver for VMware ESX', '12.0.1250.0-5vmw.703.0.20.19193900'],
].map(([name, version]) => ({ name, version }));

const COMPONENTS = [
  'Fan',
  'Fan redundancy',
  'Temperature',
  'Power supply',
  'Power supply redundancy',
  'Processor',
  'Memory',
  'Storage',
  'Smart storage battery',
  'Network link status',
  'BIOS/Hardware health',
];

const componentHealth = (overrides = {}) =>
  COMPONENTS.map((name) => ({
    name,
    status:
      overrides[name] ??
      (name.endsWith('redundancy') ? 'Redundant' : 'OK'),
    severity: overrides[name] ? severityOf(overrides[name]) : 'ok',
  }));

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

const memory = (slots, filled, size = '32 GiB', part = 'HMA84GR7JJR4N-WM') =>
  Array.from({ length: filled }, (_, i) => ({
    location: `PROC 1 DIMM ${[1, 3, 5, 7, 10, 12, 14, 16, 2, 4, 6, 8, 9, 11, 13, 15][i]}`,
    type: 'DDR4',
    size,
    speed: '2933 MHz',
    technology: 'RDIMM',
    serial: (0x12c6d90d + i * 7919).toString(16).toUpperCase().slice(0, 8),
    part,
  }));

const HOUSTON = {
  name: 'Houston',
  address: '1701 E Mossy Oaks Rd, Spring, Texas, United States, 77389',
};
const GENEVA = {
  name: 'Geneva',
  address: 'Route du Nant-d’Avril 150, Meyrin, Switzerland, 1217',
};

const server = ({
  id,
  name,
  serial,
  health,
  iloSecurity = 'At risk',
  state = 'Connected',
  baseline = '2026.01.00.00',
  baselineProgress,
  group,
  power = 'On',
  model,
  iloIp,
  location = HOUSTON,
  os = 'VMware ESXi 7.0.3 Build-23794027 Update 3 Patch 125',
  subscription = 'Enhanced · Expires on December 8, 2027',
  support = { status: 'Active', expires: 'June 30, 2028', cases: 0 },
  alerts = 0,
  components = {},
  memorySlots = [16, 8],
  processors = [
    { name: 'AMD EPYC 7402P 24-Core Processor', max: '4100 MHz', rated: '2800 MHz', cores: 24, threads: 48 },
  ],
  volumes = [
    { controller: 'HPE Smart Array P408i-a SR Gen10', name: '0002005CPWXLK0CRHF', state: 'Enabled', capacity: '745.18 GiB', raid: 'RAID1', drives: 2, spares: 0 },
  ],
  disconnectedSince,
  lastCollection = '10/24/2024 9:37 PM',
}) => ({
  id,
  name,
  serial,
  health,
  iloSecurity,
  state,
  baseline:
    state === 'Connected'
      ? `${baselineProgress ?? 25}% of ${baseline}`
      : '--',
  baselineName: baseline,
  group,
  power,
  model: MODELS[model],
  connectionType: 'Direct',
  manufacturer: 'HPE',
  uuid: `3638${serial.slice(0, 4).toUpperCase()}-3630-4D32-3230-${serial
    .slice(-6)
    .toUpperCase()}383351`,
  iloIp,
  iloHostname: `${name.toUpperCase()}-ILO.tmehol.hou`,
  productId: 'P18606-B21',
  uidIndicator: 'Off',
  os,
  subscription,
  platform: 'ProLiant',
  autoIloUpdate: state === 'Connected' ? 'Enabled' : 'Disabled',
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
      : 'Firmware baseline update has not been attempted.',
  hardware: {
    lastCollection,
    formFactor: '1U',
    chassisType: 'RackMount',
    processors,
    memory: memory(memorySlots[0], memorySlots[1]),
    memorySlots,
    networkAdapters: [
      {
        name: 'PCI-E Slot 1 - HPE Eth 10/25Gb 2p 640SFP28 Adptr',
        ports: [
          { port: 1, address: 'B8:83:03:A2:D8:B8' },
          { port: 2, address: 'B8:83:03:A2:D8:B9' },
        ],
      },
      {
        name: 'OCP 3.0 Slot 10 - 10Gb 2-port SFP+ BCM57412 OCP3 Adapter',
        ports: [
          { port: 1, address: 'bc:97:e1:ab:84:54' },
          { port: 2, address: 'bc:97:e1:ab:84:55' },
        ],
      },
    ],
  },
  volumes,
  support,
  disconnectedSince,
});

export const servers = [
  server({
    id: 'srv-1',
    name: 'si1-mp-pcbe-esx02',
    serial: '2M2025083Q',
    health: 'Unknown',
    state: 'Not connected',
    group: 'Si1 MP PCBE Cluster',
    power: 'Off',
    model: 'dl325',
    iloIp: '10.26.4.22',
    disconnectedSince: '11/5/2024, 2:36:49 PM',
    support: { status: 'Expired', expires: 'December 20, 2025', cases: 0 },
    components: Object.fromEntries(COMPONENTS.map((c) => [c, 'Unknown'])),
  }),
  server({
    id: 'srv-2',
    name: 'si1-mp-pcbe-esx01',
    serial: '2M2025083R',
    health: 'Unknown',
    state: 'Not connected',
    group: 'Si1 MP PCBE Cluster',
    power: 'Off',
    model: 'dl325',
    iloIp: '10.26.4.21',
    disconnectedSince: '11/5/2024, 2:31:12 PM',
    support: { status: 'Expired', expires: 'December 20, 2025', cases: 0 },
    components: Object.fromEntries(COMPONENTS.map((c) => [c, 'Unknown'])),
  }),
  server({
    id: 'srv-3',
    name: 'si1-pcbe-esx02',
    serial: 'MXQ1460FNF',
    health: 'OK',
    group: 'Si1 dHCI Cluster',
    model: 'dl325v2',
    iloIp: '10.26.4.12',
    lastCollection: '2/18/2026 7:48 PM',
  }),
  server({
    id: 'srv-4',
    name: 'si1-pcbe-esx01',
    serial: 'MXQ1460HTZ',
    health: 'OK',
    group: 'Si1 dHCI Cluster',
    model: 'dl325v2',
    iloIp: '10.26.4.11',
    lastCollection: '2/18/2026 7:46 PM',
  }),
  server({
    id: 'srv-5',
    name: 'gva-core-esx01',
    serial: 'CZJ3290K7L',
    health: 'Warning',
    iloSecurity: 'OK',
    group: 'GVA Core Cluster',
    model: 'dl380',
    iloIp: '10.42.8.31',
    location: GENEVA,
    alerts: 1,
    baselineProgress: 100,
    memorySlots: [32, 16],
    components: { 'Fan redundancy': 'Not redundant' },
    processors: [
      { name: 'Intel Xeon Gold 6430 32-Core Processor', max: '3400 MHz', rated: '2100 MHz', cores: 32, threads: 64 },
      { name: 'Intel Xeon Gold 6430 32-Core Processor', max: '3400 MHz', rated: '2100 MHz', cores: 32, threads: 64 },
    ],
    os: 'VMware ESXi 8.0.2 Build-22380479',
    lastCollection: '2/17/2026 11:02 PM',
  }),
  server({
    id: 'srv-6',
    name: 'gva-core-esx02',
    serial: 'CZJ3290K7M',
    health: 'Critical',
    iloSecurity: 'OK',
    group: 'GVA Core Cluster',
    model: 'dl380',
    iloIp: '10.42.8.32',
    location: GENEVA,
    alerts: 3,
    baselineProgress: 100,
    memorySlots: [32, 16],
    components: {
      'Power supply': 'Failed',
      'Power supply redundancy': 'Not redundant',
    },
    processors: [
      { name: 'Intel Xeon Gold 6430 32-Core Processor', max: '3400 MHz', rated: '2100 MHz', cores: 32, threads: 64 },
      { name: 'Intel Xeon Gold 6430 32-Core Processor', max: '3400 MHz', rated: '2100 MHz', cores: 32, threads: 64 },
    ],
    os: 'VMware ESXi 8.0.2 Build-22380479',
    support: { status: 'Active', expires: 'March 14, 2027', cases: 1 },
    lastCollection: '2/17/2026 11:04 PM',
  }),
  server({
    id: 'srv-7',
    name: 'gva-edge-esx01',
    serial: 'CZJ3310P2A',
    health: 'OK',
    iloSecurity: 'OK',
    group: 'GVA Edge',
    model: 'dl360',
    iloIp: '10.42.9.11',
    location: GENEVA,
    baselineProgress: 100,
    processors: [
      { name: 'Intel Xeon Silver 4410Y 12-Core Processor', max: '3900 MHz', rated: '2000 MHz', cores: 12, threads: 24 },
    ],
    os: 'VMware ESXi 8.0.2 Build-22380479',
    lastCollection: '2/18/2026 1:15 AM',
  }),
  server({
    id: 'srv-8',
    name: 'hou-lab-esx03',
    serial: 'MXQ2271A9C',
    health: 'OK',
    iloSecurity: 'Ignore risk',
    group: 'HOU Lab',
    model: 'dl325v2',
    iloIp: '10.26.7.13',
    power: 'Off',
    baselineProgress: 60,
    subscription: 'Standard · Expires on March 1, 2026',
    lastCollection: '2/12/2026 6:42 AM',
  }),
];

// Quick filters shown in the list toolbar
export const needsAttention = (s) =>
  s.health === 'Warning' || s.health === 'Critical' || s.alerts > 0;
