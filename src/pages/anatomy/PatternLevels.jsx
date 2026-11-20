import { Fragment, useContext } from 'react';
import {
  Checkmark,
  Close,
  Filter,
  Search,
  Descending,
  LinkNext,
  StatusCritical,
  StatusGood,
  StatusWarning,
} from '@hpe-design/icons-grommet';
import {
  Anchor,
  Avatar,
  Box,
  Button,
  Grid,
  Heading,
  PageHeader,
  Tab,
  Text,
  TextInput,
  ToggleGroup,
} from 'grommet';
import { AnatomyNav } from './primitives';
import {
  DetailHeading,
  DetailTabs,
  Pairs,
  Section,
} from '../../pattern/detail';

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

const MOCK_HEIGHT = '420px';

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
        pad={{ bottom: '4px', horizontal: 'xxsmall' }}
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

const MockButton = ({ label, primary }) => (
  <Box
    pad={{ horizontal: 'small', vertical: '3px' }}
    round="full"
    background={primary ? 'brand' : 'background-contrast'}
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
        <T strong style={{ fontSize: '15px', lineHeight: '18px' }}>
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
            round="large"
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

// Built from the same components as the coded examples (Divider and Contained
// list switched off): Grommet PageHeader, TextInput search + secondary
// collection action, ToggleGroup quick filters, a weak count line, Avatar
// rows with a filled selected row, then the shared detail heading, tabs and
// name–value sections. Rendered at reduced zoom so a whole page fits the
// banner; it is a picture, not a live surface.
const STATUS_ICON = {
  ok: { Icon: StatusGood, color: 'status-ok' },
  warning: { Icon: StatusWarning, color: 'status-warning' },
  critical: { Icon: StatusCritical, color: 'status-critical' },
};

const initialsOf = (name) =>
  name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

// Leading visual: a status icon for health, an avatar only for people.
const MockRow = ({ row, avatar, selected, last }) => {
  const status = row.status && STATUS_ICON[row.status];
  return (
    <Box
      pad={{ horizontal: 'small', vertical: 'small' }}
      border={
        last || selected ? undefined : { side: 'bottom', color: 'border-weak' }
      }
      background={selected ? 'background-contrast' : undefined}
      round={selected ? 'small' : undefined}
      direction="row"
      align="center"
      gap="small"
      flex={false}
    >
      {status && <status.Icon color={status.color} aria-hidden />}
      {!status && avatar && (
        <Avatar size="medium" background="background-contrast">
          <Text size="small" weight={500}>
            {initialsOf(row.primary)}
          </Text>
        </Avatar>
      )}
      <Box flex>
        <Text weight={500} truncate>
          {row.primary}
        </Text>
        {row.secondary && (
          <Text size="small" color="text-weak" truncate>
            {row.secondary}
          </Text>
        )}
      </Box>
      {row.meta && (
        <Text size="small" color="text-weak">
          {row.meta}
        </Text>
      )}
    </Box>
  );
};

export const MockListDetail = ({
  title,
  subtitle,
  action,
  filters,
  rows,
  avatar = false,
  selected = 0,
  detail,
}) => (
  <Box
    height={MOCK_HEIGHT}
    border={{ color: 'border-weak' }}
    background="background-front"
    round="small"
    overflow="hidden"
    aria-hidden
    style={{ pointerEvents: 'none' }}
  >
    <Box pad="medium" style={{ zoom: 0.7 }} flex={false}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        pad="none"
        margin={{ bottom: 'medium' }}
        actions={
          detail.pageAction ? (
            <Button primary label={detail.pageAction} />
          ) : undefined
        }
      />
      <Grid columns={['40%', 'flex']} gap="medium">
        <Box gap="xsmall" style={{ minWidth: 0 }}>
          <Box direction="row" gap="xsmall" align="center">
            <Box flex>
              <TextInput
                icon={<Search />}
                placeholder={`Search ${title.toLowerCase()}`}
                readOnly
                tabIndex={-1}
              />
            </Box>
            {action && <Button secondary label={action} tabIndex={-1} />}
          </Box>
          {filters && (
            <Box alignSelf="start" style={{ whiteSpace: 'nowrap' }}>
              <ToggleGroup
                options={filters.map((f) => ({ label: f, value: f }))}
                value={filters[0]}
              />
            </Box>
          )}
          <Box direction="row" justify="between" align="center">
            <Text size="small" color="text-weak">
              {(detail.total || rows.length).toLocaleString()} items
            </Text>
            <Box direction="row" gap="xxsmall" align="center">
              <Descending size="small" color="text-weak" />
              <Text size="small" color="text-weak">
                {detail.sort || 'Name'}
              </Text>
            </Box>
          </Box>
          <Box flex={false}>
            {rows.map((r, i) => (
              <MockRow
                key={r.primary}
                row={r}
                avatar={avatar}
                selected={i === selected}
                last={i === rows.length - 1}
              />
            ))}
          </Box>
        </Box>
        <Box style={{ minWidth: 0 }}>
          <DetailHeading
            heading={detail.title}
            status={detail.badge && STATUS_ICON[detail.badge.status]}
            description={detail.badge?.label}
            trailing={
              <Box direction="row" gap="xsmall">
                {detail.secondaryAction && (
                  <Button
                    secondary
                    label={detail.secondaryAction}
                    tabIndex={-1}
                  />
                )}
                {detail.action && (
                  <Button primary label={detail.action} tabIndex={-1} />
                )}
              </Box>
            }
          />
          <DetailTabs activeIndex={0} onActive={() => {}}>
            {detail.tabs.map((t) => (
              <Tab key={t} title={t} />
            ))}
          </DetailTabs>
          <Section title={detail.sectionTitle || 'Overview'}>
            <Pairs pairs={detail.fields} />
          </Section>
          {detail.section && (
            <Section title={detail.section.title}>
              <Pairs pairs={detail.section.items} />
            </Section>
          )}
        </Box>
      </Grid>
    </Box>
  </Box>
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

// Lo-fi zoning wireframe: no text, light grey shapes only, no selection state.
const Zone = ({ children, ...rest }) => (
  <Box
    border={{ color: 'border-weak', style: 'dashed' }}
    round="xsmall"
    pad="xsmall"
    gap="xsmall"
    {...rest}
  >
    {children}
  </Box>
);

const Bar = ({ width = '100%', height = '6px', strong }) => (
  <Box
    width={width}
    height={height}
    round="xsmall"
    background={strong ? 'border' : 'border-weak'}
    flex={false}
  />
);

const Pill = ({ width }) => (
  <Box
    width={width}
    height="14px"
    round="large"
    border={{ color: 'border-weak' }}
    flex={false}
  />
);

const ROWS = [0, 1, 2];
const FIELDS = [0, 1, 2, 3, 4, 5];

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
        <Pill width="72px" />
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
          <Pill width="36px" />
          <Pill width="36px" />
          <Pill width="36px" />
        </Box>
        {ROWS.map((i) => (
          <Box
            key={i}
            pad={{ vertical: 'xsmall', horizontal: 'xsmall' }}
            round="xsmall"
            background={i === 1 ? 'background-back' : undefined}
            border={
              i === 1
                ? { side: 'left', color: 'border', size: '2px' }
                : { side: 'left', color: 'transparent', size: '2px' }
            }
            gap="xxsmall"
            flex={false}
          >
            <Bar width="60%" strong />
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
          border={{ side: 'bottom', color: 'border-weak' }}
          pad={{ bottom: 'xsmall' }}
          flex={false}
        >
          <Bar width="36px" strong />
          <Bar width="36px" />
          <Bar width="36px" />
          <Bar width="36px" />
        </Box>
        <Grid
          columns={{ count: 2, size: 'auto' }}
          gap="small"
          style={{ flexShrink: 0 }}
        >
          {FIELDS.map((i) => (
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
  avatar: true,
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
  <Box gap="xlarge">
    <Lead>
      A list–detail page shows many records on 1 side and the selected record in
      full on the other. You move through the set without ever leaving the page.
    </Lead>

    <Box gap="small">
      <MockZones />
      <Text size="small" color="text-weak">
        Left: the list, for finding and choosing. Right: the detail, for
        inspecting and acting.
      </Text>
    </Box>

    <Box gap="medium">
      <SectionHeading>What it gives you</SectionHeading>
      <JobSheet rows={JOB} />
    </Box>

    <Box gap="medium">
      <SectionHeading>Is it list–detail?</SectionHeading>
      <IsNotSheet rows={IS_NOT} />
    </Box>
  </Box>
);

// ---------------------------------------------------------------------------
// Page 1a: When to use. Pulls the decision out of the stories into 1 place:
// use list–detail, or give the record its own page.

const DECIDE = [
  {
    q: 'Records per sitting',
    use: ['Several', 'Moving between records, keeping their place.'],
    page: ['1', 'Arrived at from a link, alert or search.'],
  },
  {
    q: 'Work on 1 record',
    use: ['Short', 'Read, check, approve, assign, flag.'],
    page: ['Long', 'Configure, author, multi-step, Save and draft.'],
  },
  {
    q: 'Detail content',
    use: ['Summary + tabs', 'Fits in 480px (size.large).'],
    page: ['Wide', 'Tables, charts, editors, nested lists.'],
  },
  {
    q: 'The list while a record is open',
    use: [
      'Still matters',
      'Count, filters and next item are part of the task.',
    ],
    page: ['Noise', 'Once open, the rest of the set is irrelevant.'],
  },
  {
    q: 'Comparison',
    use: ['Whole records', 'Flipped between, same fields in the same place.'],
    page: ['1 or 2 values', 'Across many rows. That is a table.'],
  },
];

// Short verdict in bold, 1 supporting line underneath.
const Verdict = ({ pair: [lead, text] }) => (
  <Box gap="2px">
    <Text weight={500}>{lead}</Text>
    <Text size="small" color="text-weak">
      {text}
    </Text>
  </Box>
);

const DecideColumn = ({ icon, color, title, pick }) => (
  <Box
    background="background-back"
    round="small"
    border={{ color: 'border-weak' }}
    pad="medium"
    gap="small"
  >
    <Box
      direction="row"
      gap="xsmall"
      align="center"
      pad={{ bottom: 'small' }}
      border={{ side: 'bottom', color: 'border-weak' }}
    >
      {icon}
      <Text weight={500} color={color}>
        {title}
      </Text>
    </Box>
    {DECIDE.map((row) => (
      <Box key={row.q} gap="2px" pad={{ vertical: 'xsmall' }}>
        <Text size="xsmall" color="text-weak" weight={500}>
          {row.q.toUpperCase()}
        </Text>
        <Verdict pair={pick(row)} />
      </Box>
    ))}
  </Box>
);

const DecideSheet = () => (
  <Grid columns={{ count: 2, size: 'auto' }} gap="medium">
    <DecideColumn
      icon={<Checkmark size="small" color="status-ok" />}
      color="status-ok"
      title="Use list–detail"
      pick={(r) => r.use}
    />
    <DecideColumn
      icon={<Close size="small" color="status-critical" />}
      color="status-critical"
      title="Give it a page"
      pick={(r) => r.page}
    />
  </Grid>
);

const SCENARIOS = [
  {
    id: 'gather',
    name: 'Gather',
    fit: 'Strong',
    text: 'Work a queue 1 record at a time. The count is the progress bar.',
    rows: [1, 0, 0, 0],
  },
  {
    id: 'compare',
    name: 'Compare',
    fit: 'Strong',
    text: 'Flip between 2 or 3 similar records, same fields in the same place.',
    rows: [1, 1, 0, 0],
  },
  {
    id: 'triage',
    name: 'Triage',
    fit: 'Strong',
    text: 'Filter a large set to the few that matter, then act on each.',
    rows: [0, 1, 0, 1],
  },
  {
    id: 'quick-edit',
    name: 'Quick edit',
    fit: 'Good',
    text: 'The same small change across many records, without a mode switch.',
    rows: [1, 1, 1, 1],
  },
];

// Tiny 2-zone glyph: a list with the marked rows highlighted and a detail pane.
const ScenarioGlyph = ({ rows }) => (
  <Box
    direction="row"
    gap="xsmall"
    pad="xsmall"
    height="56px"
    background="background-front"
    round="xsmall"
    border={{ color: 'border-weak' }}
  >
    <Box width="36px" gap="3px" flex={false}>
      {rows.map((on, i) => (
        <Box
          key={i}
          height="8px"
          round="2px"
          background={on ? 'brand' : 'background-contrast'}
        />
      ))}
    </Box>
    <Box flex background="background-contrast" round="2px" />
  </Box>
);

const ScenarioCard = ({ id, name, fit, text, rows }) => {
  const go = useContext(AnatomyNav);
  return (
    <Box
      background="background-back"
      round="small"
      border={{ color: 'border-weak' }}
      pad="medium"
      gap="small"
    >
      <ScenarioGlyph rows={rows} />
      <Box direction="row" justify="between" align="center">
        <Text weight={500}>{name}</Text>
        <Box
          pad={{ horizontal: 'small', vertical: '2px' }}
          round="large"
          background={fit === 'Strong' ? 'status-ok' : 'background-contrast'}
        >
          <Text size="xsmall" weight={500}>
            {fit} fit
          </Text>
        </Box>
      </Box>
      <Text size="small">{text}</Text>
      <Anchor
        label="Read the story"
        icon={<LinkNext size="small" />}
        reverse
        size="small"
        onClick={() => go(`pattern/when/${id}`)}
      />
    </Box>
  );
};

export const PatternUseLevel = () => (
  <Box gap="xlarge">
    <Lead>
      Use list–detail when the person works across several records in 1 sitting
      and the work on each is short. Give a record its own page when the work is
      long, wide or arrived at directly.
    </Lead>

    <Box gap="medium">
      <Box gap="2px">
        <SectionHeading>Decide in 5 questions</SectionHeading>
        <Text color="text-weak">
          Read down 1 column. If answers split, browse here and hand the deep
          work off to a page.
        </Text>
      </Box>
      <DecideSheet />
    </Box>

    <Box gap="medium">
      <Box gap="2px">
        <SectionHeading>The scenarios it serves</SectionHeading>
        <Text color="text-weak">4 scenarios, each with a user story.</Text>
      </Box>
      <Grid columns={{ count: 4, size: 'auto' }} gap="small">
        {SCENARIOS.map((sc) => (
          <ScenarioCard key={sc.id} {...sc} />
        ))}
      </Grid>
    </Box>
  </Box>
);

// ---------------------------------------------------------------------------
// Page 1b: Jobs to be done

const JTBD = [
  {
    group: 'Gather',
    tagline: 'Working through a queue, 1 record at a time.',
    jobs: [
      [
        'clearing a queue of access requests',
        'open each one and approve or reject it in place',
        'empty the queue without losing count of what is left',
      ],
      [
        'reviewing new support tickets',
        'read each ticket in full and assign it',
        'hand the whole batch on before the morning stand-up',
      ],
      [
        'onboarding a batch of new users',
        'check each profile and fix what is missing',
        'finish the batch in 1 sitting',
      ],
      [
        'approving expense claims',
        'see the receipts for the claim I am on while the rest of the list stays visible',
        'keep moving down the list',
      ],
    ],
  },
  {
    group: 'Compare',
    tagline: 'Flipping between similar records to find the difference.',
    jobs: [
      [
        'looking at 2 servers that should be identical but 1 is failing',
        'flip between their details with the same section in view',
        'spot the setting that differs',
      ],
      [
        'choosing between 3 subscription tiers',
        'switch between them without scrolling back to the top',
        'compare the same line item on each',
      ],
      [
        'debugging a deployment that worked in staging but not production',
        'step between the 2 environments',
        'find the configuration that changed',
      ],
      [
        'picking a template for a new workspace',
        'preview each candidate in turn',
        'choose the closest fit',
      ],
    ],
  },
  {
    group: 'Triage',
    tagline: 'Finding the few that matter in a large set, then acting.',
    jobs: [
      [
        'watching 2,340 resources of which a handful are critical',
        'filter to the critical ones and open each',
        'decide what to escalate first',
      ],
      [
        'in the middle of an alert storm',
        'sort by severity and work from the top',
        'clear the real incidents before the noise',
      ],
      [
        'auditing accounts after a policy change',
        'find the ones that no longer comply and fix them 1 by 1',
        'close the audit',
      ],
      [
        'looking into an overnight cost spike',
        'find the resources that grew the most and look at each',
        'stop the runaway ones',
      ],
    ],
  },
  {
    group: 'Quick edit',
    tagline: 'Making the same small change to many records.',
    jobs: [
      [
        'handing over the devices of a team member who has left',
        'reassign each one to a new owner',
        'finish the handover in 1 pass',
      ],
      [
        'renaming a cost centre',
        'update the tag on every affected resource without opening a new page each time',
        'be done in minutes',
      ],
      [
        'tidying up a set of dashboards',
        'open each and fix its title and owner',
        'leave the set consistent',
      ],
      [
        'opening a new location',
        'move the right devices to it',
        'keep the inventory accurate',
      ],
    ],
  },
];

const JTBD_PARTS = ['When I am ', 'I want to ', 'so I can '];

// 1 job as a card: a single flowing sentence with the 3 connectors bolded.
const JtbdCard = ({ parts }) => (
  <Box
    background="background-back"
    round="small"
    pad="medium"
    border={{ color: 'border-weak' }}
  >
    <Text>
      {parts.map((part, i) => (
        <Fragment key={JTBD_PARTS[i]}>
          <Text weight={500}>{JTBD_PARTS[i]}</Text>
          {part}
          {i < 2 ? ', ' : '.'}
        </Fragment>
      ))}
    </Text>
  </Box>
);

const JtbdGroup = ({ group, tagline, jobs }) => (
  <Box gap="medium">
    <Box gap="2px">
      <SectionHeading>{group}</SectionHeading>
      <Text color="text-weak">{tagline}</Text>
    </Box>
    <Grid columns={{ count: 2, size: 'auto' }} gap="small">
      {jobs.map((parts) => (
        <JtbdCard key={parts.join()} parts={parts} />
      ))}
    </Grid>
  </Box>
);

export const PatternJtbdLevel = () => (
  <Box gap="xlarge">
    {JTBD.map((g) => (
      <JtbdGroup key={g.group} {...g} />
    ))}
  </Box>
);

// ---------------------------------------------------------------------------
// Page 2: When to use it

const USE = [
  {
    id: 'gather',
    title: 'Gather',
    tagline: 'Working through a queue, 1 record at a time.',
    persona: 'Priya',
    role: 'Workspace administrator',
    context:
      'Owns access for a 48-person workspace. Approves requests between other work, usually in short bursts.',
    scene:
      'It is Monday. 3 access requests landed over the weekend and 1 of them is for an Administrator role. Priya does not approve blind: she wants to see who asked, who manages them and whether SSO is already set up.',
    job: {
      when: 'I am working through a queue of requests',
      want: 'to see everything about each one without leaving the queue',
      so: 'I can approve or decline them in 1 sitting and know when I am done',
    },
    why: [
      'Access is a security decision. A wrong Administrator approval is the kind of mistake that gets audited.',
      'Requests arrive in batches, so she wants to clear the whole batch, not just the first one she opens.',
      'She has 10 minutes before her next meeting. Finishing matters more than being thorough on 1.',
    ],
    without: {
      alternatives: [
        {
          name: 'Table with an Approve button',
          breaks:
            'Manager, team and SSO status are hidden behind a click, so Priya approves on name and role alone.',
          cost: 'Approving blind on an Administrator request.',
        },
        {
          name: 'User profile page per request',
          breaks:
            'Every check means leaving the queue and coming back. The filter and scroll position reset each time.',
          cost: '3 round trips and losing count of what is left.',
        },
        {
          name: 'Email notifications',
          breaks:
            'Each request is a separate message with no view of the whole set, and no record of what has been handled.',
          cost: 'Requests slip and get approved twice or not at all.',
        },
      ],
      summary:
        'The page keeps the queue in view while she checks each person, so the 3 approvals take 1 sitting.',
    },
    beats: [
      {
        zone: 'List',
        text: 'The list is the queue. The pending filter is on by default, so she sees exactly what is left and the count of 3.',
      },
      {
        zone: 'Detail',
        text: 'Role, manager and SSO status sit together in the detail pane. The decision needs all 3 and nothing else.',
      },
      {
        zone: 'Detail',
        text: 'Approve and Decline are the primary actions, in the detail header, because they act on the record she is looking at.',
      },
      {
        zone: 'Both',
        text: 'Approving moves selection to the next request and the list count ticks down. Done is obvious: the list is empty.',
      },
    ],
    mock: <MockListDetail {...USERS} selected={1} />,
  },
  {
    id: 'compare',
    title: 'Compare',
    tagline: 'Flipping between similar records to find the difference.',
    persona: 'Daniel',
    role: 'Infrastructure engineer',
    context:
      'Looks after 120 servers across 2 sites. Spends most of his day in monitoring and runbooks, not in this page.',
    scene:
      '2 production servers raised the same memory alert within 10 minutes. Daniel suspects a shared cause but needs to check: same workload, same firmware, same reboot history?',
    job: {
      when: 'I have 2 or 3 similar records that behave differently',
      want: 'to flip between them with the same fields in the same place',
      so: 'I can spot what is different while it is still fresh in my mind',
    },
    why: [
      'If it is a shared cause, 1 fix clears both alerts. If not, he has 2 separate incidents and needs to say so.',
      'Comparison is a memory task. Every extra click between the 2 records is a chance to forget what he just read.',
      'He is mid-incident. He will not write anything down; the page has to hold the state for him.',
    ],
    without: {
      alternatives: [
        {
          name: 'Server page in 2 browser tabs',
          breaks:
            'Fields sit at different scroll positions in each tab, so Daniel compares from memory while alt-tabbing.',
          cost: 'Misreading a firmware version that differs by 1 digit.',
        },
        {
          name: 'Wide table with a column per field',
          breaks:
            'Firmware, workload and reboot history are 3 horizontal scrolls apart, and the detail he needs is not a column.',
          cost: 'The difference is there but never seen.',
        },
        {
          name: 'Exporting to a spreadsheet',
          breaks:
            'A snapshot that is stale the moment a reboot happens, and nothing to act on once the cause is found.',
          cost: 'Finding the answer in a file he cannot act from.',
        },
      ],
      summary:
        'Same layout for both servers, 1 click apart, so the eye lands on the field that changed.',
    },
    beats: [
      {
        zone: 'List',
        text: 'Both servers stay visible in the list with their status, so he never loses the other candidate.',
      },
      {
        zone: 'Detail',
        text: 'Tabs and fields are in the same place for every server. Switching does not move his eyes, so the difference pops.',
      },
      {
        zone: 'Both',
        text: 'Selection switches instantly with no page load. He can flip 3 or 4 times without breaking concentration.',
      },
      {
        zone: 'Detail',
        text: 'Recent events sit under the fields. Firmware is 1 version behind on 1 server, and the reboot history confirms it.',
      },
    ],
    mock: <MockListDetail {...SERVERS} selected={1} />,
  },
  {
    id: 'triage',
    title: 'Triage',
    tagline: 'Finding the few that matter in a large set, then acting.',
    persona: 'Mei-Ling',
    role: 'NOC operator',
    context:
      'Monitors 2,340 resources on a rotating shift. Her job is to decide fast what is noise, what to acknowledge and what to escalate.',
    scene:
      'Shift start. The overnight run left 2 critical and 1 warning out of 2,340. Mei-Ling needs to find them, understand each one and either acknowledge it or escalate to the on-call engineer.',
    job: {
      when: 'a large set has a few records that need attention right now',
      want: 'to find those few, understand each and act on it',
      so: 'I can clear the urgent work first without losing my place',
    },
    why: [
      'Critical alerts have an SLA. Minutes between seeing it and escalating it are measured.',
      'Most of the 2,340 are healthy. Anything that makes her scroll past them is time taken from the 3 that matter.',
      'She will be interrupted. When she comes back, the page needs to show her where she was.',
    ],
    without: {
      alternatives: [
        {
          name: 'Health dashboard',
          breaks:
            'Shows that there are 2 criticals, not which 2, and no way to acknowledge from the tile.',
          cost: 'A second screen before any action can start.',
        },
        {
          name: 'Alert page per resource',
          breaks:
            'Each critical is a full page load, and coming back means re-filtering 2,340 rows to find her place.',
          cost: '3 round trips at the start of a shift.',
        },
        {
          name: 'Flat alert feed',
          breaks:
            'Alerts arrive in time order with no severity filter, so the 3 that matter are buried in the noise.',
          cost: 'Scanning hundreds of lines to find 3.',
        },
      ],
      summary:
        'Severity filter, then act from the pane: the critical few are isolated and handled without leaving the list.',
    },
    beats: [
      {
        zone: 'List',
        text: 'Status icons and a severity sort put the 2 criticals at the top. The filter chips narrow 2,340 to the handful in 1 click.',
      },
      {
        zone: 'Detail',
        text: 'The alert, the recent events and the owner are in the detail pane, enough to decide escalate or acknowledge without a second page.',
      },
      {
        zone: 'Detail',
        text: 'Acknowledge and Escalate are short actions, so they live in the detail header rather than on their own page.',
      },
      {
        zone: 'Both',
        text: 'The list stays filtered and sorted after she acts. The next critical is already next in line.',
      },
    ],
    mock: <MockListDetail {...RESOURCES} selected={0} />,
  },
  {
    id: 'quick-edit',
    title: 'Quick edit',
    tagline: 'The same small change, across a lot of records.',
    persona: 'Tomás',
    role: 'Asset manager',
    context:
      'Keeps the device inventory accurate for finance. Works in long, repetitive sessions when an audit or renewal is coming.',
    scene:
      'An audit is 2 weeks out and 41 devices have no owner or cost centre. Each fix is 2 fields, but there are 41 of them and Tomás wants to watch the list empty as he works.',
    job: {
      when: 'I need to make the same small change across many records',
      want: 'to select, edit and save without opening a full form each time',
      so: 'I can keep a rhythm and see my progress as the list shrinks',
    },
    why: [
      'Unassigned devices are a finding in the audit. Zero is the only acceptable number.',
      '41 small edits is a rhythm task. Any friction per record is multiplied by 41.',
      'He needs to see progress to stay motivated and to know when he can stop.',
    ],
    without: {
      alternatives: [
        {
          name: 'Edit page per device',
          breaks:
            'Each fix is open, edit, save, back to list, re-filter. 2 fields of work wrapped in 5 steps.',
          cost: '41 page loads and 41 trips back to the list.',
        },
        {
          name: 'Editable spreadsheet table',
          breaks:
            'Fast to type into, but model, site and last seen are off screen, so Tomás guesses who should own the device.',
          cost: 'Wrong owners that surface in the audit anyway.',
        },
        {
          name: 'Bulk assign dialog',
          breaks:
            'Assumes all 41 share an owner. They do not, so he still goes 1 by 1 but now through a modal.',
          cost: 'The same 41 decisions with less context.',
        },
      ],
      summary:
        'Edit in the pane, save, next device: the context stays in view and the list shrinks as he goes.',
    },
    beats: [
      {
        zone: 'List',
        text: 'The unassigned filter turns the list into a to-do list. 41 becomes 40, 39, 38 as he saves.',
      },
      {
        zone: 'Detail',
        text: 'Owner and cost centre are editable in place. The edit is small enough that a full form would be in the way.',
      },
      {
        zone: 'Detail',
        text: 'The rest of the record (model, site, last seen) stays visible, so he picks the right owner without looking anything up.',
      },
      {
        zone: 'Both',
        text: 'Save, and the next device is already next in the list. No navigation, no reload, no lost scroll position.',
      },
    ],
    mock: <MockListDetail {...OWNERS} selected={1} />,
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

// Job statement in "When / I want / so" form.
const JobStatement = ({ job, size = 'large' }) => (
  <Box
    border={{ side: 'left', color: 'border', size: 'small' }}
    pad={{ left: 'medium' }}
    gap="xxsmall"
  >
    {[
      ['When', `${job.when},`],
      ['I want', `${job.want},`],
      ['so', `${job.so}.`],
    ].map(([lead, text]) => (
      <Text key={lead} size={size}>
        <Text size={size} color="text-weak">
          {lead}{' '}
        </Text>
        {text}
      </Text>
    ))}
  </Box>
);

const StoryLink = ({ id }) => {
  const go = useContext(AnatomyNav);
  return (
    <Anchor
      label="Read the full story"
      icon={<LinkNext size="small" />}
      reverse
      size="small"
      onClick={() => go(`pattern/when/${id}`)}
    />
  );
};

// Index card: mock, title, persona and the job in 1 line, link to the full story.

// Full story page: who, the moment, the job, why it matters, how the page helps.
const StoryHeading = ({ children }) => (
  <Heading level={2} margin="none">
    {children}
  </Heading>
);

// Section of a story page. Heading plus optional supporting line, spaced like
// the content header (2px between them), then `large` to the body.
const StoryBlock = ({ title, subtitle, children }) => (
  <Box
    gap="large"
    pad={{ top: 'large' }}
    border={{ side: 'top', color: 'border-weak' }}
  >
    <Box gap="2px">
      <StoryHeading>{title}</StoryHeading>
      {subtitle && (
        <Text color="text-weak" style={{ maxWidth: '68ch' }}>
          {subtitle}
        </Text>
      )}
    </Box>
    <Box gap="large">{children}</Box>
  </Box>
);

export const PatternStoryLevel = ({ id }) => {
  const story = USE.find((u) => u.id === id) ?? USE[0];
  const go = useContext(AnatomyNav);
  const index = USE.indexOf(story);
  const next = USE[(index + 1) % USE.length];
  return (
    <Box gap="large">
      {story.mock}

      <Box gap="large" width={{ max: 'xlarge' }}>
        <Box gap="medium" pad={{ top: 'medium' }}>
          <StoryHeading>The story</StoryHeading>
          <Box direction="row" gap="small" align="center">
            <Box
              width="36px"
              height="36px"
              round="full"
              background="background-contrast"
              align="center"
              justify="center"
              flex={false}
            >
              <Text size="small" weight={500}>
                {story.persona[0]}
              </Text>
            </Box>
            <Box>
              <Text weight={500}>
                {story.persona},{' '}
                {/^[A-Z]{2,}/.test(story.role)
                  ? story.role
                  : story.role[0].toLowerCase() + story.role.slice(1)}
              </Text>
              <Text size="small" color="text-weak">
                {story.context}
              </Text>
            </Box>
          </Box>
          <Lead>{story.scene}</Lead>
          <JobStatement job={story.job} />
        </Box>

        <StoryBlock title="Why it matters">
          <Grid columns={{ count: 3, size: 'auto' }} gap="large">
            {story.why.map((w, i) => (
              <Box key={w} gap="xsmall">
                <Text size="xlarge" weight={500} color="text-weak">
                  {i + 1}
                </Text>
                <Text>{w}</Text>
              </Box>
            ))}
          </Grid>
        </StoryBlock>

        <StoryBlock title="How the page helps">
          <Grid columns={{ count: 2, size: 'auto' }} gap="large">
            {story.beats.map(({ zone, text }, i) => (
              <Box key={i} gap="small" align="start">
                <ZoneChip zone={zone} />
                <Text>{text}</Text>
              </Box>
            ))}
          </Grid>
        </StoryBlock>

        <StoryBlock
          title="Alternative approaches"
          subtitle={`Other ways to give ${story.persona} this job, and why each one falls short of it.`}
        >
          <Grid columns={{ count: 3, size: 'auto' }} gap="large">
            {story.without.alternatives.map(({ name, breaks, cost }) => (
              <Box key={name} gap="medium">
                <Box gap="small">
                  <Heading level={3} size="xsmall" margin="none">
                    {name}
                  </Heading>
                  <Text>{breaks}</Text>
                </Box>
                <Box direction="row" gap="xsmall" align="start">
                  <Close size="small" color="status-critical" aria-hidden />
                  <Text size="small" color="text-weak">
                    {cost}
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
          <Box
            direction="row"
            gap="xsmall"
            align="start"
            pad={{ top: 'medium' }}
            border={{ side: 'top', color: 'border-weak' }}
          >
            <Checkmark size="small" color="status-ok" aria-hidden />
            <Text style={{ maxWidth: '68ch' }}>{story.without.summary}</Text>
          </Box>
        </StoryBlock>
      </Box>

      <Box
        direction="row"
        justify="end"
        align="center"
        pad={{ top: 'medium' }}
        border={{ side: 'top', color: 'border-weak' }}
      >
        <Anchor
          label={`Next story: ${next.title}`}
          icon={<LinkNext size="small" />}
          reverse
          size="small"
          onClick={() => go(`pattern/when/${next.id}`)}
        />
      </Box>
    </Box>
  );
};
