// Kubernetes resources, adapted from the HPE theme preview's OpsRamp detail
// layout (hpe-theme-preview.netlify.app/layouts/detail-opsramp). Availability
// uses OpsRamp's vocabulary: Down · Up · Unknown · Undefined.

const VM = 'VirtualMachine';
const VVP = 'VMware Virtual Platform';
const VMWARE = 'VMware, Inc.';

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
  ['k8s-cluster-02', '10.42.0.15', VVP, 'Up'],
  ['k8s-cluster-02-master', '172.25.22.53', VM, 'Down'],
  ['k8s-cluster-02-worker03', '172.25.22.56', VM, 'Up'],
  ['k8s-cluster-03', '10.42.0.15', VVP, 'Up'],
  ['k8s-cluster-04', '10.42.0.15', VVP, 'Up'],
  ['k8s-cluster-05', '10.42.0.15', VVP, 'Unknown'],
  ['k8s-cluster-06', '10.42.0.15', VVP, 'Up'],
  ['k8s-flow-master01', '172.25.22.90', VVP, 'Up'],
  ['k8s-flow-worker01', '172.25.22.91', VVP, 'Up'],
  ['k8s-flow-worker02', '172.25.22.92', VVP, 'Up'],
  ['k8s-flow-worker03', '172.25.22.93', VVP, 'Undefined'],
  ['k8s-prod-master01', '10.42.1.10', VM, 'Up'],
  ['k8s-prod-worker01', '10.42.1.11', VM, 'Up'],
  ['k8s-prod-worker02', '10.42.1.12', VM, 'Unknown'],
  ['k8s-prod-worker03', '10.42.1.13', VM, 'Undefined'],
  ['k8s-staging-master01', '10.42.2.10', VM, 'Up'],
  ['k8s-staging-worker01', '10.42.2.11', VM, 'Undefined'],
  ['k8s-staging-worker02', '10.42.2.12', VM, 'Unknown'],
  ['k8s-edge-gw01', '172.25.30.5', VVP, 'Undefined'],
];

const serials = [
  '5YCXKH2',
  '7HQ2M93',
  '3JDL8F1',
  '9KPZ4R7',
  '2MVX6T8',
  '6RBN1W4',
  '8TCQ5Y2',
  '4WDH9K6',
  '1XFJ3P9',
  '5ZGM7L3',
];

export const resources = base.map(([name, ip, model, availability], i) => {
  const cluster = name.replace(/-(master|worker|gw)\d*$/, '');
  const isHost = model === VVP;
  return {
    id: name,
    name,
    ip,
    make: VMWARE,
    model,
    availability,
    cluster,
    alerts:
      availability === 'Down'
        ? alerts(3, 2, 0, 1, 1)
        : availability === 'Up'
          ? alerts(i === 0 ? 4 : 0, i % 3 === 0 ? 2 : 0, i % 2, 4 - (i % 3), 2)
          : alerts(0, 1, 0, 0, i % 2),
    tickets: availability === 'Down' ? 2 : i % 4 === 0 ? 1 : 0,
    notes: i % 3 === 0 ? 2 : 0,
    overview: isHost
      ? overview(
          'VMware ESXi 6.7.0 build-8169922',
          `172.31.47.${30 + i}`,
          'Dell Inc.',
          'PowerEdge R630',
          serials[i % serials.length],
        )
      : overview(
          'Ubuntu 22.04.3 LTS',
          ip,
          VMWARE,
          VM,
          `VM-${serials[i % serials.length]}`,
        ),
    traits: isHost
      ? ['Other', 'Gateway is connected']
      : [
          'Kubernetes node',
          availability === 'Up' ? 'Agent installed' : 'Agent offline',
        ],
    // Custom attributes are set by the tenant; several resources have none yet
    attributes:
      i % 3 === 0
        ? [
            [
              'Environment',
              cluster.includes('prod') ? 'Production' : 'Non-production',
            ],
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

export const AVAILABILITIES = ['Down', 'Up', 'Unknown', 'Undefined'];

export const countBy = (items, key) =>
  items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] ?? 0) + 1;
    return acc;
  }, {});
