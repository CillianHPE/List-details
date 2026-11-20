import { Checkmark, Close, Search } from '@hpe-design/icons-grommet';
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

const Bullets = ({ items }) => (
  <Box as="ul" margin="none" pad={{ left: 'medium' }} gap="xsmall">
    {items.map((item) => (
      <Text as="li" key={item}>
        {item}
      </Text>
    ))}
  </Box>
);

// ---------------------------------------------------------------------------
// Mock primitives. Everything is real text at a tiny size so the mocks read as
// screens rather than grey bars.

const MOCK_HEIGHT = '220px';

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
  <Grid columns={{ count: columns, size: 'auto' }} gap="xsmall">
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

// Page chrome: title row with a search box, then whatever the mock shows.
const MockPage = ({ title, search, action, children }) => (
  <Box
    height={MOCK_HEIGHT}
    border={{ color: 'border-weak' }}
    background="background-front"
    round="small"
    pad="small"
    gap="xsmall"
    overflow="hidden"
  >
    <Box direction="row" justify="between" align="center" flex={false}>
      <T strong style={{ fontSize: '12px', lineHeight: '16px' }}>
        {title}
      </T>
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
  action,
  rows,
  selected = 0,
  detail,
}) => (
  <MockPage title={title} search action={action}>
    <Box direction="row" gap="small" flex>
      <Box width="46%" gap="2px" flex={false} overflow="hidden">
        {rows.map((r, i) => (
          <Box
            key={r.primary}
            direction="row"
            gap="xsmall"
            align="center"
            pad={{ horizontal: 'xsmall', vertical: '3px' }}
            round="xsmall"
            background={i === selected ? 'background-contrast' : undefined}
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
      <Box flex gap="xsmall" overflow="hidden">
        <Box direction="row" justify="between" align="center">
          <T strong style={{ fontSize: '11px', lineHeight: '14px' }}>
            {detail.title}
          </T>
          {detail.action && <MockButton label={detail.action} />}
        </Box>
        <MockTabs tabs={detail.tabs} />
        <MockFields fields={detail.fields} columns={2} />
      </Box>
    </Box>
  </MockPage>
);

// A single record owning the whole page, as a stepped flow.
export const MockWizard = () => (
  <MockPage title="Create server">
    <Box direction="row" gap="small" align="center" flex={false}>
      {['Hardware', 'Network', 'Storage', 'Review'].map((s, i) => (
        <Box key={s} direction="row" gap="xxsmall" align="center">
          <Box
            width="12px"
            height="12px"
            round="full"
            background={i === 0 ? 'brand' : 'background-contrast'}
            align="center"
            justify="center"
          >
            <T
              color={i === 0 ? 'text-strong' : 'text-weak'}
              style={{ fontSize: '8px' }}
            >
              {i + 1}
            </T>
          </Box>
          <T strong={i === 0} weak={i !== 0}>
            {s}
          </T>
        </Box>
      ))}
    </Box>
    <MockFields
      columns={2}
      fields={[
        ['Model', 'ProLiant DL380 Gen11'],
        ['Processor', '2 × Xeon Gold 6430'],
        ['Memory', '512 GB'],
        ['Boot mode', 'UEFI'],
      ]}
    />
    <Box direction="row" justify="end" gap="xsmall" margin={{ top: 'auto' }}>
      <MockButton label="Back" />
      <MockButton label="Next" primary />
    </Box>
  </MockPage>
);

// A single, dense record: long report with a chart.
export const MockReport = () => (
  <MockPage title="Q3 capacity report">
    <MockTabs tabs={['Summary', 'Compute', 'Storage', 'Network', 'Costs']} />
    <Box direction="row" gap="small" flex>
      <Box width="55%" gap="xsmall">
        <T weak>Utilisation by cluster</T>
        <Box direction="row" gap="xxsmall" align="end" height="70px">
          {[40, 65, 55, 90, 30, 75].map((h, i) => (
            <Box
              key={i}
              flex
              height={`${h}%`}
              background={h > 85 ? 'status-warning' : 'brand'}
              round={{ corner: 'top', size: 'xsmall' }}
            />
          ))}
        </Box>
      </Box>
      <Box flex gap="xsmall">
        <MockFields
          fields={[
            ['Peak', '91% · cluster-04'],
            ['Forecast', 'Capacity reached in 7 weeks'],
            ['Recommendation', 'Add 2 nodes to cluster-04'],
          ]}
        />
      </Box>
    </Box>
  </MockPage>
);

// Rows and columns, nothing selected.
export const MockTable = () => {
  const cols = ['Name', 'Status', 'Region', 'CPU', 'Updated'];
  const rows = [
    ['edge-gw-01', 'ok', 'eu-west', '34%', '2m'],
    ['edge-gw-02', 'ok', 'eu-west', '41%', '2m'],
    ['core-sw-07', 'warning', 'us-east', '88%', '5m'],
    ['core-sw-08', 'ok', 'us-east', '52%', '5m'],
    ['dc-fw-03', 'critical', 'ap-south', '97%', '1m'],
    ['dc-fw-04', 'ok', 'ap-south', '23%', '1m'],
  ];
  return (
    <MockPage title="Devices" search>
      <Grid
        columns={['2fr', '1.2fr', '1.2fr', '0.8fr', '0.8fr']}
        gap="xxsmall"
        border={{ side: 'bottom', color: 'border-weak' }}
        pad={{ bottom: '2px' }}
      >
        {cols.map((c) => (
          <T key={c} weak strong>
            {c}
          </T>
        ))}
      </Grid>
      {rows.map(([name, status, region, cpu, upd]) => (
        <Grid
          key={name}
          columns={['2fr', '1.2fr', '1.2fr', '0.8fr', '0.8fr']}
          gap="xxsmall"
          align="center"
        >
          <T>{name}</T>
          <Box direction="row" gap="xxsmall" align="center">
            <Dot status={status} />
            <T>
              {status === 'ok'
                ? 'Healthy'
                : status === 'warning'
                  ? 'Warning'
                  : 'Critical'}
            </T>
          </Box>
          <T>{region}</T>
          <T>{cpu}</T>
          <T weak>{upd}</T>
        </Grid>
      ))}
    </MockPage>
  );
};

// A handful of fields; no set to move through.
export const MockSettings = () => (
  <MockPage title="Workspace settings">
    <Box gap="xsmall" width="70%">
      {[
        ['Workspace name', 'Acme Networks'],
        ['Default region', 'eu-west-1'],
        ['Session timeout', '30 minutes'],
      ].map(([k, v]) => (
        <Box key={k} gap="2px">
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
    <Box direction="row" justify="end" margin={{ top: 'auto' }}>
      <MockButton label="Save" primary />
    </Box>
  </MockPage>
);

// ---------------------------------------------------------------------------
// Realistic datasets for the list–detail mocks

const USERS = {
  title: 'Users',
  action: 'Add user',
  rows: [
    { primary: 'Priya Natarajan', secondary: 'Administrator' },
    { primary: 'Tomás Herrera', secondary: 'Operator' },
    { primary: 'Mei-Ling Chen', secondary: 'Viewer' },
    { primary: 'Daniel Okafor', secondary: 'Operator' },
    { primary: 'Sofia Lindqvist', secondary: 'Viewer' },
  ],
  detail: {
    title: 'Tomás Herrera',
    action: 'Edit',
    tabs: ['Overview', 'Access', 'Activity'],
    fields: [
      ['Email', 'tomas.herrera@acme.com'],
      ['Role', 'Operator'],
      ['Last sign-in', 'Today, 08:42'],
      ['Workspaces', 'Networks, Compute'],
    ],
  },
};

const SERVERS = {
  title: 'Servers',
  rows: [
    { primary: 'dl380-prod-11', secondary: 'Memory alert', status: 'warning' },
    { primary: 'dl380-prod-12', secondary: 'Memory alert', status: 'warning' },
    { primary: 'dl360-prod-04', secondary: 'Healthy', status: 'ok' },
    { primary: 'dl360-prod-05', secondary: 'Healthy', status: 'ok' },
    { primary: 'dl380-dev-02', secondary: 'Healthy', status: 'ok' },
  ],
  detail: {
    title: 'dl380-prod-12',
    tabs: ['Health', 'Hardware', 'Firmware'],
    fields: [
      ['Memory', '94% · 482 of 512 GB'],
      ['Firmware', 'iLO 6 v1.58'],
      ['Last reboot', '41 days ago'],
      ['Location', 'Rack B7, U12'],
    ],
  },
};

const RESOURCES = {
  title: 'Resources',
  rows: [
    {
      primary: 'pay-api-gateway',
      secondary: 'Unreachable',
      status: 'critical',
    },
    { primary: 'auth-db-primary', secondary: 'Disk 97%', status: 'critical' },
    { primary: 'web-frontend-03', secondary: 'Healthy', status: 'ok' },
    { primary: 'cache-redis-01', secondary: 'Healthy', status: 'ok' },
    { primary: 'batch-worker-07', secondary: 'Healthy', status: 'ok' },
  ],
  detail: {
    title: 'pay-api-gateway',
    action: 'Acknowledge',
    tabs: ['Alerts', 'Metrics', 'Logs'],
    fields: [
      ['Alert', 'Host unreachable for 6 min'],
      ['Severity', 'Critical'],
      ['Owner', 'Payments team'],
      ['Runbook', 'RB-214 Gateway restart'],
    ],
  },
};

const OWNERS = {
  title: 'Devices',
  rows: [
    { primary: 'edge-gw-01', secondary: 'Owner: Unassigned' },
    { primary: 'edge-gw-02', secondary: 'Owner: Unassigned' },
    { primary: 'core-sw-07', secondary: 'Owner: Network ops' },
    { primary: 'core-sw-08', secondary: 'Owner: Network ops' },
    { primary: 'dc-fw-03', secondary: 'Owner: Security' },
  ],
  detail: {
    title: 'edge-gw-02',
    action: 'Save',
    tabs: ['Details', 'Tags', 'Config'],
    fields: [
      ['Owner', 'Network ops ▾'],
      ['Site', 'Dublin DC2'],
      ['Tags', 'edge, prod'],
      ['Model', 'Aruba 9004'],
    ],
  },
};

// ---------------------------------------------------------------------------
// Page 1: What it is

const JOB = [
  [
    'Keep my place',
    'The list stays on screen so I always know where I am in the set and what comes next.',
  ],
  [
    'See the whole record',
    'The detail region shows everything about the selected record, organised into tabs when it is large.',
  ],
  [
    'Move fast between records',
    'Selecting a row swaps the detail in place. No page load, no back button, no lost filters.',
  ],
  [
    'Act where it makes sense',
    'Set-level actions (search, filter, add) live with the list. Record-level actions live with the detail.',
  ],
];

const NOT = [
  'Not a dashboard. It is about records, not metrics.',
  'Not a wizard or form page. It is for looking across many, not building 1.',
  'Not a table. Tables compare columns; list–detail compares whole records.',
];

const Point = ({ title, children }) => (
  <Box gap="xxsmall">
    <Heading level={3} size="xsmall" margin="none">
      {title}
    </Heading>
    <Text>{children}</Text>
  </Box>
);

export const PatternWhatLevel = () => (
  <Box gap="large">
    <Lead>
      A list–detail page shows many records on 1 side and the selected record in
      full on the other. You move through the set without ever leaving the page.
    </Lead>

    <Box gap="small">
      <MockListDetail {...USERS} selected={1} />
      <Text size="small" color="text-weak">
        The list keeps the set in view; the detail shows the record you picked.
      </Text>
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

    <Box gap="medium">
      <SectionHeading>How it does that job</SectionHeading>
      <Grid columns={{ count: 'fit', size: ['medium', 'flex'] }} gap="medium">
        {JOB.map(([title, body]) => (
          <Point key={title} title={title}>
            {body}
          </Point>
        ))}
      </Grid>
    </Box>

    <Box gap="small">
      <SectionHeading>What it is not</SectionHeading>
      <Bullets items={NOT} />
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
    when: 'I need to read a set of records 1 by 1 and build a picture.',
    eg: 'Reviewing every new user before granting access.',
    mock: <MockListDetail {...USERS} selected={1} />,
  },
  {
    title: 'Compare',
    when: 'I need to flip between similar records to spot the difference.',
    eg: '2 servers with the same memory alert.',
    mock: <MockListDetail {...SERVERS} selected={1} />,
  },
  {
    title: 'Triage',
    when: 'I need to scan for the few that need attention, then act on each.',
    eg: 'Resources in a critical state this morning.',
    mock: <MockListDetail {...RESOURCES} selected={0} />,
  },
  {
    title: 'Quick edit',
    when: 'I need to change 1 or 2 fields across a lot of records.',
    eg: 'Assigning an owner to every unassigned device.',
    mock: <MockListDetail {...OWNERS} selected={1} />,
  },
];

const AVOID = [
  {
    title: 'Deep work on 1 record',
    when: 'The task is a multi-step create or configure flow.',
    instead:
      'A dedicated page or wizard. A list beside it would only steal width.',
    mock: <MockWizard />,
  },
  {
    title: 'Dense records',
    when: 'Each record is a document, a long report or a complex visualisation.',
    instead: 'A full page the record can own, reached from a list.',
    mock: <MockReport />,
  },
  {
    title: 'Column comparison',
    when: 'The question is answered by scanning 1 field across many rows.',
    instead: 'A table. Sort and filter do the work; no detail needed.',
    mock: <MockTable />,
  },
  {
    title: 'Only a few records',
    when: 'There is 1 object, or a fixed handful that never grows.',
    instead: 'A settings or form page. There is no set to move through.',
    mock: <MockSettings />,
  },
];

const Scenario = ({ title, when, note, noteLabel, mock, ok }) => (
  <Box gap="small">
    {mock}
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
      <Text size="small" color="text-weak">
        <Text size="small" weight={500}>
          {noteLabel}:
        </Text>{' '}
        {note}
      </Text>
    </Box>
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
      <Grid columns={{ count: 'fit', size: ['medium', 'flex'] }} gap="large">
        {USE.map(({ title, when, eg, mock }) => (
          <Scenario
            key={title}
            ok
            title={title}
            when={when}
            noteLabel="For example"
            note={eg}
            mock={mock}
          />
        ))}
      </Grid>
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

    <Grid columns={{ count: 'fit', size: ['medium', 'flex'] }} gap="large">
      {AVOID.map(({ title, when, instead, mock }) => (
        <Scenario
          key={title}
          title={title}
          when={when}
          noteLabel="Use instead"
          note={instead}
          mock={mock}
        />
      ))}
    </Grid>

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
