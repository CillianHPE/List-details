// Monitored resources: a fictional set of cluster hosts and nodes for the
// Monitored resources example. Each record carries alert counts, a system
// overview, discovered traits and optional custom attributes so the detail
// can show a mix of figures, tags, lists and pairs. Names are invented.

const HOST = 'Bare-metal host';
const NODE = 'Virtual node';

const alerts = (critical, warning, ok, info, observed) => ({
  critical,
  warning,
  ok,
  info,
  observed,
});

const overview = (os, ip, make, model, serial) => ({
  os,
  ip,
  make,
  model,
  serial,
});

const base = [
  ['payments-host-01', '10.42.0.15', HOST, 'Healthy'],
  ['payments-control-01', '172.25.22.53', NODE, 'Down'],
  ['payments-node-03', '172.25.22.56', NODE, 'Healthy'],
  ['payments-host-02', '10.42.0.16', HOST, 'Healthy'],
  ['payments-host-03', '10.42.0.17', HOST, 'Healthy'],
  ['analytics-host-01', '10.42.0.25', HOST, 'Unknown'],
  ['analytics-host-02', '10.42.0.26', HOST, 'Healthy'],
  ['analytics-control-01', '172.25.22.90', NODE, 'Healthy'],
  ['analytics-node-01', '172.25.22.91', NODE, 'Healthy'],
  ['analytics-node-02', '172.25.22.92', NODE, 'Healthy'],
  ['analytics-node-03', '172.25.22.93', NODE, 'Unknown'],
  ['orders-control-01', '10.42.1.10', NODE, 'Healthy'],
  ['orders-node-01', '10.42.1.11', NODE, 'Healthy'],
  ['orders-node-02', '10.42.1.12', NODE, 'Unknown'],
  ['orders-node-03', '10.42.1.13', NODE, 'Unknown'],
  ['staging-control-01', '10.42.2.10', NODE, 'Healthy'],
  ['staging-node-01', '10.42.2.11', NODE, 'Unknown'],
  ['staging-node-02', '10.42.2.12', NODE, 'Unknown'],
  ['edge-gateway-01', '172.25.30.5', HOST, 'Unknown'],
];

const serials = [
  'HX5YCK2',
  'HX7HQ93',
  'HX3JDF1',
  'HX9KPR7',
  'HX2MVT8',
  'HX6RBW4',
  'HX8TCY2',
  'HX4WDK6',
  'HX1XFP9',
  'HX5ZGL3',
];

export const resources = base.map(([name, ip, model, availability], i) => {
  const cluster = name.replace(/-(control|node|host|gateway)-\d+$/, '');
  const isHost = model === HOST;
  return {
    id: name,
    name,
    ip,
    make: isHost ? 'Atlas Systems' : 'Hypervisor',
    model,
    availability,
    cluster,
    alerts:
      availability === 'Down'
        ? alerts(3, 2, 0, 1, 1)
        : availability === 'Healthy'
          ? alerts(i === 0 ? 4 : 0, i % 3 === 0 ? 2 : 0, i % 2, 4 - (i % 3), 2)
          : alerts(0, 1, 0, 0, i % 2),
    tickets: availability === 'Down' ? 2 : i % 4 === 0 ? 1 : 0,
    notes: i % 3 === 0 ? 2 : 0,
    overview: isHost
      ? overview(
          'Hypervisor 8.1, build 31042',
          `172.31.47.${30 + i}`,
          'Atlas Systems',
          'Atlas R240 rack server',
          serials[i % serials.length],
        )
      : overview(
          'Linux 6.8 (LTS)',
          ip,
          'Hypervisor',
          NODE,
          `VN-${serials[i % serials.length]}`,
        ),
    traits: isHost
      ? ['Host', 'Gateway connected']
      : [
          'Cluster node',
          availability === 'Healthy' ? 'Agent installed' : 'Agent offline',
        ],
    // Custom attributes are set by the tenant; several resources have none yet
    attributes:
      i % 3 === 0
        ? [
            ['Environment', cluster === 'staging' ? 'Non-production' : 'Production'],
            ['Cost centre', `CC-${4100 + (i % 7)}`],
            ['Owner', 'Platform engineering'],
          ]
        : [],
  };
});

// Related resources: the other members of the same cluster
export const relatedResources = (resource) =>
  resources.filter(
    (r) => r.cluster === resource.cluster && r.id !== resource.id,
  );

export const AVAILABILITIES = ['Healthy', 'Down', 'Unknown'];

export const countBy = (items, key) =>
  items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] ?? 0) + 1;
    return acc;
  }, {});
