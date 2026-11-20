import {
  Checkmark,
  Close,
  Filter,
  Search,
  Descending,
} from '@hpe-design/icons-grommet';
import { Box, Grid, Heading, Text } from 'grommet';

// Pattern pages: the plain-language "what" and "when" of list–detail,
// written from the job to be done rather than from the anatomy. Each point
// leads with a small realistic mock, then the words that explain it.

const Lead = ({ children }) => (
  <Text size="large" color="text-weak" style={{ maxWidth: '68ch' }}>
    {children}
  </Text>
);

const SectionHeading = ({ children }) => (
  <Heading level={2} size="small" margin="none">
    {children}
  </Heading>
);

const Bullets = ({ items, small }) => (
  <Box
    as="ul"
    margin="none"
    pad={{ left: small ? 'small' : 'medium' }}
    gap={small ? '2px' : 'xsmall'}
  >
    {items.map((item) => (
      <Text
        as="li"
        key={item}
        size={small ? 'xsmall' : undefined}
        style={small ? { fontSize: '10px', lineHeight: '14px' } : undefined}
      >
        {item}
      </Text>
    ))}
  </Box>
);

// ---------------------------------------------------------------------------
// Mock primitives. Everything is real text at a tiny size so the mocks read as
// screens rather than grey bars.

const MOCK_HEIGHT = '380px';

const T = ({ children, weak, strong, color, ...rest }) => (
  <Text
    size="xsmall"
    weight={strong ? 500 : 400}
    color={color || (weak ? 'text-weak' : 'text')}
    truncate
    style={{ fontSize: '10px', lineHeight: '14px' }}
    {...rest}
  >
    {children}
  </Text>
);

const Dot = ({ status = 'ok' }) => (
  <Box
    width="6px"
    height="6px"
    round="full"
    background={`status-${status}`}
    flex={false}
  />
);

const MockTabs = ({ tabs }) => (
  <Box
    direction="row"
    gap="small"
    border={{ side: 'bottom', color: 'border-weak' }}
    flex={false}
  >
    {tabs.map((t, i) => (
      <Box
        key={t}
        pad={{ bottom: '3px' }}
        border={
          i === 0 ? { side: 'bottom', color: 'brand', size: '2px' } : false
        }
      >
        <T strong={i === 0} weak={i !== 0}>
          {t}
        </T>
      </Box>
    ))}
  </Box>
);

const MockFields = ({ fields, columns = 1 }) => (
  <Grid
    columns={{ count: columns, size: 'auto' }}
    gap="xsmall"
    style={{ flexShrink: 0 }}
  >
    {fields.map(([k, v]) => (
      <Box key={k} gap="1px">
        <T weak>{k}</T>
        <T>{v}</T>
      </Box>
    ))}
  </Grid>
);

const MockButton = ({ label, primary }) => (
  <Box
    pad={{ horizontal: 'xsmall', vertical: '2px' }}
    round="xsmall"
    background={primary ? 'brand' : undefined}
    border={primary ? false : { color: 'border' }}
    flex={false}
  >
    <T strong color={primary ? 'text-strong' : undefined}>
      {label}
    </T>
  </Box>
);

const Chip = ({ label, active }) => (
  <Box
    pad={{ horizontal: 'xsmall', vertical: '1px' }}
    round="large"
    background={active ? 'background-contrast' : undefined}
    border={{ color: active ? 'border-strong' : 'border' }}
    flex={false}
  >
    <T strong={active}>{label}</T>
  </Box>
);

const Badge = ({ status, label }) => (
  <Box direction="row" gap="xxsmall" align="center" flex={false}>
    <Dot status={status} />
    <T>{label}</T>
  </Box>
);

const Toggle = ({ on }) => (
  <Box
    width="18px"
    height="10px"
    round="large"
    background={on ? 'brand' : 'border'}
    justify="center"
    pad="1px"
    align={on ? 'end' : 'start'}
    flex={false}
  >
    <Box width="8px" height="8px" round="full" background="white" />
  </Box>
);

// Page chrome: title row with a search box, then whatever the mock shows.
const MockPage = ({ title, subtitle, search, action, children }) => (
  <Box
    height={MOCK_HEIGHT}
    border={{ color: 'border-weak' }}
    background="background-front"
    round="small"
    pad="small"
    gap="xsmall"
    overflow="hidden"
  >
    <Box direction="row" justify="between" align="start" flex={false}>
      <Box>
        <T strong style={{ fontSize: '12px', lineHeight: '16px' }}>
          {title}
        </T>
        {subtitle && <T weak>{subtitle}</T>}
      </Box>
      <Box direction="row" gap="xsmall" align="center">
        {search && (
          <Box
            direction="row"
            align="center"
            gap="xxsmall"
            pad={{ horizontal: 'xsmall', vertical: '2px' }}
            border={{ color: 'border' }}
            round="xsmall"
          >
            <Search size="small" color="text-weak" />
            <T weak>Search</T>
          </Box>
        )}
        {action && <MockButton label={action} primary />}
      </Box>
    </Box>
    {children}
  </Box>
);

// Many records on the left, the selected 1 in full on the right.
export const MockListDetail = ({
  title,
  subtitle,
  action,
  filters,
  rows,
  selected = 0,
  detail,
}) => (
  <MockPage title={title} subtitle={subtitle} search action={action}>
    {filters && (
      <Box direction="row" gap="xxsmall" align="center" flex={false}>
        <Filter size="small" color="text-weak" />
        {filters.map((f, i) => (
          <Chip key={f} label={f} active={i === 0} />
        ))}
      </Box>
    )}
    <Box direction="row" gap="small" flex>
      <Box width="42%" gap="2px" flex={false} overflow="hidden">
        <Box
          direction="row"
          justify="between"
          align="center"
          pad={{ horizontal: 'xsmall', bottom: '2px' }}
          border={{ side: 'bottom', color: 'border-weak' }}
          flex={false}
        >
          <T weak>
            {rows.length} of {detail.total || 48}
          </T>
          <Box direction="row" gap="xxsmall" align="center">
            <Descending size="small" color="text-weak" />
            <T weak>{detail.sort || 'Name'}</T>
          </Box>
        </Box>
        {rows.map((r, i) => (
          <Box
            key={r.primary}
            direction="row"
            gap="xsmall"
            align="center"
            pad={{ horizontal: 'xsmall', vertical: '3px' }}
            round="xsmall"
            background={i === selected ? 'background-contrast' : undefined}
            border={
              i === selected
                ? { side: 'left', color: 'brand', size: '2px' }
                : { side: 'left', color: 'transparent', size: '2px' }
            }
            flex={false}
          >
            {r.status && <Dot status={r.status} />}
            <Box flex>
              <T strong={i === selected}>{r.primary}</T>
              {r.secondary && <T weak>{r.secondary}</T>}
            </Box>
            {r.meta && <T weak>{r.meta}</T>}
          </Box>
        ))}
      </Box>
      <Box
        flex
        gap="xsmall"
        overflow="hidden"
        pad={{ left: 'small' }}
        border={{ side: 'left', color: 'border-weak' }}
      >
        <Box direction="row" justify="between" align="start" flex={false}>
          <Box gap="1px">
            <T strong style={{ fontSize: '11px', lineHeight: '14px' }}>
              {detail.title}
            </T>
            {detail.badge && <Badge {...detail.badge} />}
          </Box>
          <Box direction="row" gap="xxsmall">
            {detail.action && <MockButton label={detail.action} primary />}
            {detail.secondaryAction && (
              <MockButton label={detail.secondaryAction} />
            )}
          </Box>
        </Box>
        <MockTabs tabs={detail.tabs} />
        <MockFields fields={detail.fields} columns={2} />
        {detail.section && (
          <Box gap="2px" margin={{ top: 'xsmall' }} flex={false}>
            <T weak strong>
              {detail.section.title}
            </T>
            {detail.section.items.map((it) => (
              <Box
                key={it[0]}
                direction="row"
                justify="between"
                pad={{ vertical: '2px' }}
                border={{ side: 'bottom', color: 'border-weak' }}
              >
                <T>{it[0]}</T>
                <T weak>{it[1]}</T>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  </MockPage>
);

// A single record owning the whole page, as a stepped flow.
export const MockWizard = () => (
  <MockPage title="Create server" subtitle="Step 2 of 4 · Network">
    <Box direction="row" gap="medium" flex>
      <Box width="28%" gap="xsmall" flex={false}>
        {['Hardware', 'Network', 'Storage', 'Review'].map((st, i) => (
          <Box key={st} direction="row" gap="xsmall" align="center">
            <Box
              width="14px"
              height="14px"
              round="full"
              background={
                i < 1 ? 'status-ok' : i === 1 ? 'brand' : 'background-contrast'
              }
              align="center"
              justify="center"
              flex={false}
            >
              {i < 1 ? (
                <Checkmark size="small" color="text-strong" />
              ) : (
                <T
                  color={i === 1 ? 'text-strong' : 'text-weak'}
                  style={{ fontSize: '8px' }}
                >
                  {i + 1}
                </T>
              )}
            </Box>
            <T strong={i === 1} weak={i > 1}>
              {st}
            </T>
          </Box>
        ))}
      </Box>
      <Box flex gap="xsmall">
        <T weak>
          Choose how this server joins the fabric. You can change VLANs later.
        </T>
        {[
          ['Management network', 'mgmt-vlan-10 ▾'],
          ['Data network', 'prod-vlan-240 ▾'],
          ['IP assignment', 'DHCP reservation ▾'],
          ['Hostname', 'dl380-prod-13'],
        ].map(([k, v]) => (
          <Box key={k} gap="1px">
            <T weak>{k}</T>
            <Box
              border={{ color: 'border' }}
              round="xsmall"
              pad={{ horizontal: 'xsmall', vertical: '2px' }}
            >
              <T>{v}</T>
            </Box>
          </Box>
        ))}
        <Box direction="row" gap="xsmall" align="center">
          <Toggle on />
          <T>Enable iLO remote console</T>
        </Box>
        <Box
          direction="row"
          justify="end"
          gap="xsmall"
          margin={{ top: 'auto' }}
        >
          <MockButton label="Back" />
          <MockButton label="Next: Storage" primary />
        </Box>
      </Box>
    </Box>
  </MockPage>
);

// A single, dense record: long report with a chart.
export const MockReport = () => (
  <MockPage
    title="Q3 capacity report"
    subtitle="Generated 1 Oct · 14 clusters · 312 hosts"
    action="Export"
  >
    <MockTabs tabs={['Summary', 'Compute', 'Storage', 'Network', 'Costs']} />
    <Box direction="row" gap="xsmall" flex={false}>
      {[
        ['Avg utilisation', '68%'],
        ['Peak', '91%'],
        ['Headroom', '7 weeks'],
        ['Forecast spend', '$1.2M'],
      ].map(([k, v]) => (
        <Box
          key={k}
          flex
          pad="xsmall"
          border={{ color: 'border-weak' }}
          round="xsmall"
        >
          <T weak>{k}</T>
          <T strong style={{ fontSize: '13px', lineHeight: '16px' }}>
            {v}
          </T>
        </Box>
      ))}
    </Box>
    <Box direction="row" gap="small" flex>
      <Box width="55%" gap="xsmall">
        <T weak>Utilisation by cluster</T>
        <Box direction="row" gap="xxsmall" align="end" flex>
          {[40, 65, 55, 90, 30, 75, 48, 62].map((h, i) => (
            <Box
              key={i}
              flex
              height={`${h}%`}
              background={h > 85 ? 'status-warning' : 'brand'}
              round={{ corner: 'top', size: 'xsmall' }}
            />
          ))}
        </Box>
        <Box direction="row" justify="between">
          <T weak>cluster-01</T>
          <T weak>cluster-08</T>
        </Box>
      </Box>
      <Box flex gap="xsmall">
        <T weak strong>
          Key findings
        </T>
        <Bullets
          small
          items={[
            'cluster-04 peaks at 91% every weekday 09:00',
            'Storage growth 4% a month, headroom to March',
            'Recommend 2 nodes for cluster-04 before Q4',
          ]}
        />
      </Box>
    </Box>
  </MockPage>
);

// Rows and columns, nothing selected.
export const MockTable = () => {
  const cols = ['Name', 'Status', 'Region', 'CPU', 'Firmware', 'Updated'];
  const grid = ['2fr', '1.2fr', '1.1fr', '0.7fr', '1fr', '0.8fr'];
  const rows = [
    ['dc-fw-03', 'critical', 'ap-south', '97%', '10.2.1', '1m'],
    ['core-sw-07', 'warning', 'us-east', '88%', '16.10.4', '5m'],
    ['core-sw-11', 'warning', 'us-east', '84%', '16.10.4', '5m'],
    ['core-sw-08', 'ok', 'us-east', '52%', '16.11.1', '5m'],
    ['edge-gw-02', 'ok', 'eu-west', '41%', '8.12.0', '2m'],
    ['edge-gw-01', 'ok', 'eu-west', '34%', '8.12.0', '2m'],
    ['dc-fw-04', 'ok', 'ap-south', '23%', '10.2.1', '1m'],
    ['edge-gw-05', 'ok', 'eu-west', '19%', '8.11.3', '2m'],
  ];
  const label = { ok: 'Healthy', warning: 'Warning', critical: 'Critical' };
  return (
    <MockPage title="Devices" subtitle="312 devices · sorted by CPU" search>
      <Box direction="row" gap="xxsmall" align="center" flex={false}>
        <Filter size="small" color="text-weak" />
        <Chip label="All regions" active />
        <Chip label="Status: any" />
        <Chip label="CPU > 80%" />
      </Box>
      <Grid
        columns={grid}
        gap="xxsmall"
        border={{ side: 'bottom', color: 'border-weak' }}
        pad={{ bottom: '2px' }}
      >
        {cols.map((c) => (
          <Box key={c} direction="row" gap="2px" align="center">
            <T weak strong>
              {c}
            </T>
            {c === 'CPU' && <Descending size="small" color="text-weak" />}
          </Box>
        ))}
      </Grid>
      {rows.map(([name, status, region, cpu, fw, upd]) => (
        <Grid
          key={name}
          columns={grid}
          gap="xxsmall"
          align="center"
          border={{ side: 'bottom', color: 'border-weak' }}
          pad={{ vertical: '1px' }}
        >
          <T>{name}</T>
          <Badge status={status} label={label[status]} />
          <T>{region}</T>
          <T strong={parseInt(cpu, 10) > 80}>{cpu}</T>
          <T weak>{fw}</T>
          <T weak>{upd}</T>
        </Grid>
      ))}
      <Box direction="row" justify="between" margin={{ top: 'auto' }}>
        <T weak>1–8 of 312</T>
        <T weak>‹ 1 2 3 … 39 ›</T>
      </Box>
    </MockPage>
  );
};

// A handful of fields; no set to move through.
export const MockSettings = () => (
  <MockPage title="Workspace settings" subtitle="Acme Networks · Enterprise">
    <MockTabs tabs={['General', 'Security', 'Notifications', 'Billing']} />
    <Box direction="row" gap="medium" flex>
      <Box width="58%" gap="xsmall">
        {[
          ['Workspace name', 'Acme Networks'],
          ['Default region', 'eu-west-1 (Dublin) ▾'],
          ['Time zone', 'Europe/Dublin ▾'],
          ['Session timeout', '30 minutes ▾'],
        ].map(([k, v]) => (
          <Box key={k} gap="1px">
            <T weak>{k}</T>
            <Box
              border={{ color: 'border' }}
              round="xsmall"
              pad={{ horizontal: 'xsmall', vertical: '2px' }}
            >
              <T>{v}</T>
            </Box>
          </Box>
        ))}
      </Box>
      <Box flex gap="xsmall">
        <T weak strong>
          Preferences
        </T>
        {[
          ['Require MFA for all users', true],
          ['Allow API tokens', true],
          ['Weekly usage digest', false],
        ].map(([k, on]) => (
          <Box key={k} direction="row" justify="between" align="center">
            <T>{k}</T>
            <Toggle on={on} />
          </Box>
        ))}
      </Box>
    </Box>
    <Box direction="row" justify="end" gap="xsmall" margin={{ top: 'auto' }}>
      <MockButton label="Discard" />
      <MockButton label="Save changes" primary />
    </Box>
  </MockPage>
);

// Lo-fi zoning wireframe: no text at all, only shapes that read as a list–detail page.
const Zone = ({ children, ...rest }) => (
  <Box
    border={{ color: 'border', style: 'dashed' }}
    background="background-back"
    round="xsmall"
    pad="xsmall"
    gap="xsmall"
    {...rest}
  >
    {children}
  </Box>
);

const Bar = ({ width = '100%', height, strong }) => (
  <Box
    width={width}
    height={height || (strong ? '8px' : '6px')}
    round="xsmall"
    background={strong ? 'text-weak' : 'border'}
    flex={false}
  />
);

const Pill = ({ width, strong }) => (
  <Box
    width={width}
    height="14px"
    round="large"
    border={strong ? undefined : { color: 'border' }}
    background={strong ? 'text-weak' : 'background-front'}
    flex={false}
  />
);

export const MockZones = () => (
  <Box
    height="320px"
    border={{ color: 'border-weak' }}
    background="background-front"
    round="small"
    pad="small"
    gap="xsmall"
  >
    <Zone direction="row" justify="between" align="center" flex={false}>
      <Bar width="140px" height="10px" strong />
      <Box direction="row" gap="xsmall">
        <Pill width="56px" />
        <Pill width="72px" strong />
      </Box>
    </Zone>
    <Box direction="row" gap="xsmall" flex>
      <Zone width="38%" flex={false} overflow="hidden">
        <Box direction="row" gap="xxsmall" flex={false}>
          <Box flex>
            <Pill width="100%" />
          </Box>
          <Pill width="20px" />
        </Box>
        <Box direction="row" gap="xxsmall" flex={false}>
          <Pill width="36px" strong />
          <Pill width="36px" />
          <Pill width="36px" />
        </Box>
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            pad="xxsmall"
            round="xsmall"
            background={i === 1 ? 'background-contrast' : undefined}
            border={{
              side: 'left',
              color: i === 1 ? 'brand' : 'transparent',
              size: '2px',
            }}
            gap="xxsmall"
            flex={false}
          >
            <Bar width={i === 1 ? '75%' : '60%'} strong={i === 1} />
            <Bar width="40%" />
          </Box>
        ))}
      </Zone>
      <Zone flex overflow="hidden" gap="small">
        <Box direction="row" justify="between" align="center" flex={false}>
          <Box gap="xxsmall">
            <Bar width="160px" height="10px" strong />
            <Bar width="90px" />
          </Box>
          <Box direction="row" gap="xsmall">
            <Pill width="48px" />
            <Pill width="48px" />
          </Box>
        </Box>
        <Box
          direction="row"
          gap="small"
          border={{ side: 'bottom', color: 'border' }}
          pad={{ bottom: 'xsmall' }}
          flex={false}
        >
          <Box
            border={{ side: 'bottom', color: 'brand', size: '2px' }}
            pad={{ bottom: 'xsmall' }}
          >
            <Bar width="36px" strong />
          </Box>
          <Bar width="36px" />
          <Bar width="36px" />
          <Bar width="36px" />
        </Box>
        <Grid
          columns={{ count: 2, size: 'auto' }}
          gap="small"
          style={{ flexShrink: 0 }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Box key={i} gap="xxsmall">
              <Bar width="35%" />
              <Bar width="70%" strong />
            </Box>
          ))}
        </Grid>
      </Zone>
    </Box>
  </Box>
);

// ---------------------------------------------------------------------------
// Realistic datasets for the list–detail mocks

const USERS = {
  title: 'Users',
  subtitle: '48 users · 3 pending review',
  action: 'Add user',
  filters: ['Pending review', 'All', 'Administrators', 'Inactive'],
  rows: [
    {
      primary: 'Priya Natarajan',
      secondary: 'Requested Administrator',
      meta: '2h',
    },
    { primary: 'Tomás Herrera', secondary: 'Requested Operator', meta: '5h' },
    { primary: 'Mei-Ling Chen', secondary: 'Requested Viewer', meta: '1d' },
    { primary: 'Daniel Okafor', secondary: 'Operator', meta: '3d' },
    { primary: 'Sofia Lindqvist', secondary: 'Viewer', meta: '1w' },
    { primary: 'Arjun Mehta', secondary: 'Viewer', meta: '2w' },
  ],
  detail: {
    title: 'Tomás Herrera',
    badge: { status: 'warning', label: 'Pending review' },
    action: 'Approve',
    secondaryAction: 'Decline',
    tabs: ['Overview', 'Access', 'Activity'],
    total: 48,
    sort: 'Requested',
    fields: [
      ['Email', 'tomas.herrera@acme.com'],
      ['Requested role', 'Operator'],
      ['Manager', 'Priya Natarajan'],
      ['Team', 'Network operations'],
      ['Requested', 'Today, 08:42'],
      ['SSO identity', 'Verified via Okta'],
    ],
    section: {
      title: 'Requested access',
      items: [
        ['Networks workspace', 'Edit'],
        ['Compute workspace', 'View'],
      ],
    },
  },
};

const SERVERS = {
  title: 'Servers',
  subtitle: '126 servers · 2 warnings',
  filters: ['Warnings', 'All', 'Production', 'Development'],
  rows: [
    { primary: 'dl380-prod-11', secondary: 'Memory 93%', status: 'warning' },
    { primary: 'dl380-prod-12', secondary: 'Memory 94%', status: 'warning' },
    { primary: 'dl360-prod-04', secondary: 'Healthy', status: 'ok' },
    { primary: 'dl360-prod-05', secondary: 'Healthy', status: 'ok' },
    { primary: 'dl380-dev-02', secondary: 'Healthy', status: 'ok' },
    { primary: 'dl380-dev-03', secondary: 'Healthy', status: 'ok' },
  ],
  detail: {
    title: 'dl380-prod-12',
    badge: { status: 'warning', label: 'Memory threshold exceeded' },
    action: 'Open iLO',
    tabs: ['Health', 'Hardware', 'Firmware', 'Events'],
    total: 126,
    sort: 'Health',
    fields: [
      ['Memory', '94% · 482 of 512 GB'],
      ['CPU', '61% · 2 × Xeon 6430'],
      ['Firmware', 'iLO 6 v1.58'],
      ['Last reboot', '41 days ago'],
      ['Location', 'Rack B7, U12'],
      ['Workload', 'vSphere cluster prod-a'],
    ],
    section: {
      title: 'Recent events',
      items: [
        ['Memory above 90%', '08:12'],
        ['Memory above 90%', 'Yesterday'],
      ],
    },
  },
};

const RESOURCES = {
  title: 'Resources',
  subtitle: '2,340 resources · 2 critical, 1 warning',
  filters: ['Critical', 'Warning', 'All', 'Acknowledged'],
  rows: [
    {
      primary: 'pay-api-gateway',
      secondary: 'Unreachable 6 min',
      status: 'critical',
    },
    { primary: 'auth-db-primary', secondary: 'Disk 97%', status: 'critical' },
    {
      primary: 'queue-worker-02',
      secondary: 'Latency 1.8s',
      status: 'warning',
    },
    { primary: 'web-frontend-03', secondary: 'Healthy', status: 'ok' },
    { primary: 'cache-redis-01', secondary: 'Healthy', status: 'ok' },
    { primary: 'batch-worker-07', secondary: 'Healthy', status: 'ok' },
  ],
  detail: {
    title: 'pay-api-gateway',
    badge: { status: 'critical', label: 'Critical · unacknowledged' },
    action: 'Acknowledge',
    secondaryAction: 'Run runbook',
    tabs: ['Alerts', 'Metrics', 'Logs', 'Dependencies'],
    total: 2340,
    sort: 'Severity',
    fields: [
      ['Alert', 'Host unreachable for 6 min'],
      ['Impact', 'Checkout API, 3 services'],
      ['Owner', 'Payments team'],
      ['On call', 'D. Okafor'],
      ['Runbook', 'RB-214 Gateway restart'],
      ['Last change', 'Deploy v4.2.1, 40 min ago'],
    ],
    section: {
      title: 'Timeline',
      items: [
        ['Host unreachable', '09:14'],
        ['Deploy v4.2.1 completed', '08:34'],
      ],
    },
  },
};

const OWNERS = {
  title: 'Devices',
  subtitle: '312 devices · 41 unassigned',
  filters: ['Unassigned', 'All', 'Edge', 'Core'],
  rows: [
    { primary: 'edge-gw-01', secondary: 'Owner: —', meta: 'Dublin' },
    { primary: 'edge-gw-02', secondary: 'Owner: Network ops', meta: 'Dublin' },
    { primary: 'edge-gw-05', secondary: 'Owner: —', meta: 'Cork' },
    { primary: 'edge-gw-06', secondary: 'Owner: —', meta: 'Cork' },
    { primary: 'core-sw-07', secondary: 'Owner: —', meta: 'Ashburn' },
    { primary: 'core-sw-08', secondary: 'Owner: —', meta: 'Ashburn' },
  ],
  detail: {
    title: 'edge-gw-02',
    badge: { status: 'ok', label: 'Saved just now' },
    action: 'Save and next',
    tabs: ['Details', 'Tags', 'Config'],
    total: 312,
    sort: 'Owner',
    fields: [
      ['Owner', 'Network ops ▾'],
      ['Site', 'Dublin DC2'],
      ['Cost centre', 'NET-4410 ▾'],
      ['Model', 'Aruba 9004'],
      ['Serial', 'CN8KJ0X2Q4'],
      ['Tags', 'edge, prod, dublin'],
    ],
  },
};

// ---------------------------------------------------------------------------
// Page 1: What it is

const JOB = [
  {
    goal: 'Keep my place',
    how: 'The list stays on screen, so I always know where I am in the set and what comes next.',
    zone: 'List',
  },
  {
    goal: 'See the whole record',
    how: 'The detail shows everything about the selected record, organised into tabs when it is large.',
    zone: 'Detail',
  },
  {
    goal: 'Move fast between records',
    how: 'Selecting a row swaps the detail in place. No page load, no back button, no lost filters.',
    zone: 'Both',
  },
  {
    goal: 'Act where it makes sense',
    how: 'Set-level actions (search, filter, add) live with the list. Record-level actions live with the detail.',
    zone: 'Both',
  },
];

const IS_NOT = [
  ['About records', 'About metrics. That is a dashboard.'],
  [
    'Looking across many',
    'Building or configuring 1. That is a wizard or form.',
  ],
  ['Comparing whole records', 'Comparing 1 column. That is a table.'],
  [
    'Short actions in the pane',
    'Deep work on 1 thing. That needs its own page.',
  ],
];

const IsNotSheet = ({ rows }) => (
  <Box>
    <Grid
      columns={['1fr', '1fr']}
      gap="large"
      pad={{ bottom: 'xsmall' }}
      border={{ side: 'bottom', color: 'border' }}
    >
      <Box direction="row" gap="xsmall" align="center">
        <Checkmark size="small" color="status-ok" />
        <Text size="small" weight={500} color="text-weak">
          It is
        </Text>
      </Box>
      <Box direction="row" gap="xsmall" align="center">
        <Close size="small" color="status-critical" />
        <Text size="small" weight={500} color="text-weak">
          It is not
        </Text>
      </Box>
    </Grid>
    {rows.map(([is, not]) => (
      <Grid
        key={is}
        columns={['1fr', '1fr']}
        gap="large"
        pad={{ vertical: 'small' }}
        border={{ side: 'bottom', color: 'border-weak' }}
      >
        <Text weight={500}>{is}</Text>
        <Text>{not}</Text>
      </Grid>
    ))}
  </Box>
);

const ZoneChip = ({ zone }) => (
  <Box
    alignSelf="start"
    style={{ justifySelf: 'start' }}
    pad={{ horizontal: 'small', vertical: 'xxsmall' }}
    round="large"
    background="background-contrast"
    flex={false}
  >
    <Text size="small" weight={500}>
      {zone}
    </Text>
  </Box>
);

// Cheatsheet: goal → how the pattern delivers it → which zone does the work.
const JobSheet = ({ rows }) => (
  <Box>
    <Grid
      columns={['small', 'flex', 'xsmall']}
      gap="medium"
      pad={{ bottom: 'xsmall' }}
      border={{ side: 'bottom', color: 'border' }}
    >
      {['I want to', 'List–detail gives me', 'Zone'].map((h) => (
        <Text key={h} size="small" weight={500} color="text-weak">
          {h}
        </Text>
      ))}
    </Grid>
    {rows.map(({ goal, how, zone }) => (
      <Grid
        key={goal}
        columns={['small', 'flex', 'xsmall']}
        gap="medium"
        pad={{ vertical: 'small' }}
        border={{ side: 'bottom', color: 'border-weak' }}
        align="start"
      >
        <Text weight={500}>{goal}</Text>
        <Text>{how}</Text>
        <ZoneChip zone={zone} />
      </Grid>
    ))}
  </Box>
);

export const PatternWhatLevel = () => (
  <Box gap="large">
    <Lead>
      A list–detail page shows many records on 1 side and the selected record in
      full on the other. You move through the set without ever leaving the page.
    </Lead>

    <Box gap="small">
      <MockZones />
      <Text size="small" color="text-weak">
        2 zones side by side: the list keeps the set in view; the detail shows
        the record you picked.
      </Text>
    </Box>

    <Box gap="small">
      <SectionHeading>Cheat sheet</SectionHeading>
      <IsNotSheet rows={IS_NOT} />
    </Box>

    <Box gap="small">
      <SectionHeading>The job to be done</SectionHeading>
      <Box
        border={{ side: 'left', color: 'brand', size: 'medium' }}
        pad={{ left: 'medium', vertical: 'xsmall' }}
      >
        <Text size="large" style={{ maxWidth: '60ch' }}>
          When I am working through a set of records, I want to see each one in
          full without losing my place in the set, so I can review, compare or
          act on many of them quickly.
        </Text>
      </Box>
    </Box>

    <Box gap="small">
      <SectionHeading>How it does that job</SectionHeading>
      <JobSheet rows={JOB} />
    </Box>

    <Box
      background="background-contrast"
      round="medium"
      pad="medium"
      gap="xxsmall"
    >
      <Text size="small" weight={500} color="text-weak">
        The 1-line test
      </Text>
      <Text size="large">
        If the job is about{' '}
        <Text size="large" weight={500}>
          many records
        </Text>
        , use list–detail. If the job is about{' '}
        <Text size="large" weight={500}>
          1 record
        </Text>
        , give it its own page.
      </Text>
    </Box>
  </Box>
);

// ---------------------------------------------------------------------------
// Page 2: When to use it

const USE = [
  {
    title: 'Gather',
    when: 'I need to read a set of records 1 by 1 and build a picture before I act.',
    why: [
      'The list is the queue: it shows what is left to look at.',
      'The detail holds everything needed to decide, so no page hopping.',
      'Approve or decline, and the next record is 1 click away.',
    ],
    eg: 'Reviewing 3 pending access requests. Each needs the requested role, manager and SSO status before approving.',
    mock: <MockListDetail {...USERS} selected={1} />,
  },
  {
    title: 'Compare',
    when: 'I need to flip between similar records to spot what is different.',
    why: [
      'The list keeps the candidates in view while 1 is open.',
      'Switching is instant, so differences stay in short-term memory.',
      'Same tabs and fields in the same place make the diff obvious.',
    ],
    eg: '2 production servers raising the same memory alert. Is it the same workload, firmware and reboot history?',
    mock: <MockListDetail {...SERVERS} selected={1} />,
  },
  {
    title: 'Triage',
    when: 'I need to scan for the few that need attention, then act on each.',
    why: [
      'Status in the list sorts the signal from the noise at a glance.',
      'Quick filters narrow 2,000 records to the handful that matter.',
      'Acknowledge or escalate without losing your place in the queue.',
    ],
    eg: 'Monday morning: 2 critical and 1 warning out of 2,340 resources. Work the critical ones first.',
    mock: <MockListDetail {...RESOURCES} selected={0} />,
  },
  {
    title: 'Quick edit',
    when: 'I need to change 1 or 2 fields across a lot of records.',
    why: [
      'The edit is small enough to live in the pane, no full form needed.',
      'Save and move on keeps the rhythm: select, change, next.',
      'The list updates as you go, so progress is visible.',
    ],
    eg: 'Assigning an owner and cost centre to 41 unassigned devices before the audit.',
    mock: <MockListDetail {...OWNERS} selected={1} />,
  },
];

const AVOID = [
  {
    title: 'Deep work on 1 record',
    when: 'The task is a multi-step create or configure flow.',
    why: [
      'The user came to make 1 thing, not to browse a set.',
      'Steps need room for guidance, validation and review.',
      'A list beside it steals a third of the width for nothing.',
    ],
    instead:
      'A dedicated page or wizard with its own steps. Return to the list when it is done.',
    mock: <MockWizard />,
  },
  {
    title: 'Dense records',
    when: 'Each record is a document, a long report or a complex visualisation.',
    why: [
      'Charts, tables and long text need the full width to be read.',
      'The user stays inside 1 record for minutes, not seconds.',
      'Switching records is rare, so the list is dead weight.',
    ],
    instead:
      'A full page the record owns, opened from a list or table. Breadcrumb back.',
    mock: <MockReport />,
  },
  {
    title: 'Column comparison',
    when: 'The question is answered by scanning 1 field across many rows.',
    why: [
      'The answer is in the column, not in any single record.',
      'Sort, filter and column visibility do the work.',
      'Opening a detail would hide the rows you are comparing.',
    ],
    instead: 'A data table. Add a detail page only for the rare deep dive.',
    mock: <MockTable />,
  },
  {
    title: 'Only a few records',
    when: 'There is 1 object, or a fixed handful that never grows.',
    why: [
      'There is no set to move through, so the list has nothing to do.',
      'Grouping by tab or section is clearer than a list of 3 items.',
      'Settings are edited rarely and 1 at a time.',
    ],
    instead: 'A settings or form page, grouped into tabs or sections.',
    mock: <MockSettings />,
  },
];

const Label = ({ children }) => (
  <Text size="small" weight={500} color="text-weak">
    {children}
  </Text>
);

// 1 scenario per row: full-width mock, then a 3-column strip beneath it.
const Scenario = ({
  title,
  when,
  why,
  whyLabel,
  note,
  noteLabel,
  mock,
  ok,
}) => (
  <Box gap="medium">
    {mock}
    <Grid columns={{ count: 'fit', size: ['small', 'flex'] }} gap="large">
      <Box gap="xxsmall">
        <Box direction="row" gap="xsmall" align="center">
          {ok ? (
            <Checkmark size="small" color="status-ok" />
          ) : (
            <Close size="small" color="status-critical" />
          )}
          <Heading level={3} size="xsmall" margin="none">
            {title}
          </Heading>
        </Box>
        <Text>{when}</Text>
      </Box>
      <Box gap="xxsmall">
        <Label>{whyLabel}</Label>
        <Bullets items={why} />
      </Box>
      <Box gap="xxsmall">
        <Label>{noteLabel}</Label>
        <Text>{note}</Text>
      </Box>
    </Grid>
  </Box>
);

const CHECK = [
  'There are more records than fit on 1 screen, and the set can grow.',
  'A person will look at several of them in 1 sitting.',
  'Each record is worth more than 1 row, but fits in 1 pane.',
  'Actions on a record are short: read, approve, edit a field, assign.',
];

export const PatternWhenLevel = () => (
  <Box gap="large">
    <Lead>
      Use list–detail when the work is across many records. Give a record its
      own page when the work is deep inside 1 of them.
    </Lead>

    <Box gap="medium">
      <SectionHeading>Use it when</SectionHeading>
      <Box>
        {USE.map(({ title, when, why, eg, mock }, i) => (
          <Box
            key={title}
            pad={{ vertical: 'xlarge' }}
            border={i > 0 ? { side: 'top', color: 'border-weak' } : false}
          >
            <Scenario
              ok
              title={title}
              when={when}
              whyLabel="Why it fits"
              why={why}
              noteLabel="For example"
              note={eg}
              mock={mock}
            />
          </Box>
        ))}
      </Box>
    </Box>

    <Box
      background="background-contrast"
      round="medium"
      pad="medium"
      gap="small"
    >
      <Box gap="xxsmall">
        <Text size="small" weight={500} color="text-weak">
          Quick check
        </Text>
        <Text size="large">
          If all 4 are true, list–detail is the right call.
        </Text>
      </Box>
      <Bullets items={CHECK} />
    </Box>
  </Box>
);

const SIGNALS = [
  'The user arrives to do 1 thing to 1 record and then leaves.',
  'The record needs the full width to be read or edited well.',
  'The set is tiny, fixed, or there is no set at all.',
  'The question is about a field, not a record.',
];

export const PatternWhenNotLevel = () => (
  <Box gap="large">
    <Lead>
      List–detail earns its place when the work is across many records. When the
      work is deep inside 1 record, or there is no set to move through, another
      surface does the job better.
    </Lead>

    <Box>
      {AVOID.map(({ title, when, why, instead, mock }, i) => (
        <Box
          key={title}
          pad={{ vertical: 'xlarge' }}
          border={i > 0 ? { side: 'top', color: 'border-weak' } : false}
        >
          <Scenario
            title={title}
            when={when}
            whyLabel="Why it fails"
            why={why}
            noteLabel="Use instead"
            note={instead}
            mock={mock}
          />
        </Box>
      ))}
    </Box>

    <Box
      background="background-contrast"
      round="medium"
      pad="medium"
      gap="small"
    >
      <Box gap="xxsmall">
        <Text size="small" weight={500} color="text-weak">
          Warning signs
        </Text>
        <Text size="large">
          If any of these is true, reach for a different pattern.
        </Text>
      </Box>
      <Bullets items={SIGNALS} />
    </Box>
  </Box>
);
