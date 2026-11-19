import { useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  CheckBox,
  Heading,
  List,
  Menu,
  Notification,
  Tab,
  Tabs,
  Text,
  ThemeContext,
} from 'grommet';
import { Download, Edit, Refresh } from '@hpe-design/icons-grommet';
import { EmptyState } from '../../components/EmptyState';
import {
  Card,
  ListPrimary,
  ListRow,
  ListStatus,
  Pairs,
  Section,
  Table,
} from '../../pattern/detail';
import { ServerHealth, StatusText } from './ServerHealth';

// Servers · Compute Ops Management. The COM detail page's facets, read side
// by side with the list instead of on a separate page.

// ------------------------------------------------------------- primitives

const Facet = ({ children }) => (
  <Box gap="medium" pad={{ top: 'medium' }}>
    {children}
  </Box>
);

// ----------------------------------------------------------------- header

// Key facts at one type scale, so health doesn't outweigh connection/power
const Fact = ({ label, children }) => (
  <Box gap="4xsmall" flex={false}>
    <Text size="small" color="text-weak">
      {label}
    </Text>
    <Box direction="row" align="center" height={{ min: '24px' }}>
      {typeof children === 'string' ? (
        <Text weight={500}>{children}</Text>
      ) : (
        children
      )}
    </Box>
  </Box>
);

// D · Detail header — name and Model · Serial, record-level Actions menu
// (as COM shows top-right of its detail page). Key facts live in Overview.
const DetailHeader = ({ server, children }) => {
  const connected = server.state === 'Connected';
  return (
    <Box flex={false} gap="small">
      <Box direction="row" align="start" justify="between" gap="small" wrap>
        <Box gap="xxsmall">
          <Box direction="row" align="center" gap="small" wrap>
            <Heading level={2} margin="none">
              {server.name}
            </Heading>
            <ServerHealth health={server.health} />
          </Box>
          <Text color="text-weak">
            {server.model} · {server.serial}
          </Text>
        </Box>
        <Menu
          label="Actions"
          dropProps={{ align: { top: 'bottom', right: 'right' } }}
          items={[
            [
              {
                label: server.power === 'On' ? 'Power off' : 'Power on',
                disabled: !connected,
              },
              { label: 'Launch remote console', disabled: !connected },
              { label: 'Update firmware', disabled: !connected },
              { label: 'Run inventory collection', disabled: !connected },
            ],
            [{ label: 'Assign to group' }, { label: 'Edit location' }],
            [{ label: 'Remove server' }],
          ]}
        />
      </Box>
      {children}
    </Box>
  );
};

// Health notification — HPE DS inline Notification, non-dismissible, sits
// directly under the name as header content so status reads with the record.
const HEALTH_NOTICE = {
  Critical: {
    status: 'critical',
    severity: 'critical',
    title: 'Server health is critical',
    advice: 'Review component health and open a support case if needed.',
  },
  Warning: {
    status: 'warning',
    severity: 'warning',
    title: 'Server health needs attention',
    advice: 'Review component health to avoid an outage.',
  },
};
const HealthNotice = ({ server, onView }) => {
  const notice = HEALTH_NOTICE[server.health];
  if (!notice) return null;
  const affected = server.componentHealth.filter(
    (c) => c.severity === notice.severity,
  );
  const detail = affected
    .map((c) => `${c.name}: ${c.status.toLowerCase()}`)
    .join(' · ');
  return (
    <Notification
      status={notice.status}
      title={notice.title}
      message={`${detail}. ${notice.advice}`}
      actions={[{ label: 'View health', onClick: onView }]}
    />
  );
};

// ---------------------------------------------------------------- Summary
const SECURITY_SEVERITY = {
  OK: 'ok',
  'At risk': 'critical',
  'Ignore risk': 'warning',
};

// Status: the at-a-glance facts (health, connection, power, group, alerts),
// first in Overview so they are the first thing read in the details area.
const Status = ({ server }) => {
  const connected = server.state === 'Connected';
  return (
    <Card title="Status">
      <Box direction="row" gap="large" wrap>
        <Fact label="Health">
          <ServerHealth health={server.health} weight={500} />
        </Fact>
        <Fact label="Connection">
          <StatusText severity={connected ? 'ok' : 'unknown'} weight={500}>
            {server.state}
          </StatusText>
        </Fact>
        <Fact label="Power">{connected ? server.power : 'Unknown'}</Fact>
        <Fact label="Group">
          <Anchor label={server.group} href="#" weight={500} />
        </Fact>
        <Fact label="Alerts">{`${server.alerts}`}</Fact>
      </Box>
    </Card>
  );
};

// Prototype proposal: a small switch one step below the DS medium
// (48×24 track, 20px handle). Not yet in Figma or grommet-theme-hpe;
// uses existing base dimension tokens so it can be adopted as-is.
const SMALL_SWITCH = {
  checkBox: {
    size: '18px', // base.dimension.450 (track height)
    // The HPE theme positions the checked handle from here, so this must
    // be overridden at the same level (36 - 14 - 3)
    extend: `
      input:checked + span[class*='CheckBoxToggle'] > span[class*='CheckBoxKnob'] {
        left: 19px;
      }
    `,
    toggle: {
      size: '36px', // base.dimension.900 (track width)
      knob: {
        extend: `
          width: 14px; /* base.dimension.350 */
          height: 14px;
          top: 1px;
          left: 1px;
        `,
      },
    },
  },
};

const SmallSwitch = (props) => (
  <ThemeContext.Extend value={SMALL_SWITCH}>
    <CheckBox toggle {...props} />
  </ThemeContext.Extend>
);

// Each notification is switched in place rather than through an Edit flow
const NOTIFICATIONS = [
  ['issues', 'Issues', 'When a health issue is raised or resolved'],
  ['powerState', 'Power state change', 'When the server powers on or off'],
  [
    'disconnect',
    'Disconnect or not monitored',
    'When iLO loses its connection to Compute Ops Management',
  ],
  ['dailySummary', 'Daily summary', 'One digest of health and activity a day'],
];

const EmailNotifications = ({ server }) => {
  const [prefs, setPrefs] = useState(server.notifications);
  return (
    <Card title="Email notifications">
      <List data={NOTIFICATIONS} pad="none">
        {([key, label, description], index) => (
          <ListRow index={index} count={NOTIFICATIONS.length}>
            <Box>
              <ListPrimary>{label}</ListPrimary>
              <Text size="small" color="text-weak">
                {description}
              </Text>
            </Box>
            <SmallSwitch
              reverse
              a11yTitle={`${label} notifications`}
              checked={!!prefs[key]}
              onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
            />
          </ListRow>
        )}
      </List>
    </Card>
  );
};

// Summary keeps what you need to recognise, reach and be told about the
// server. Hardware identity (manufacturer, platform, UUID, UID light) lives
// in Hardware; baseline detail in Firmware.
const Summary = ({ server }) => (
  <Facet>
    <Status server={server} />
    <Card title="Server">
      <Pairs
        pairs={[
          ['Model', server.model],
          ['Serial number', server.serial],
          ['Product ID', server.productId],
          ['Operating system', server.os],
          ['Subscription', server.subscription],
        ]}
      />
    </Card>
    <Card title="iLO">
      <Pairs
        pairs={[
          ['IP address', <Anchor label={server.iloIp} href="#" />],
          [
            'Hostname',
            <Anchor
              label={server.iloHostname}
              href="#"
              wordBreak="break-all"
            />,
          ],
          ['Connection type', server.connectionType],
          [
            'Security status',
            <StatusText severity={SECURITY_SEVERITY[server.iloSecurity]}>
              {server.iloSecurity}
            </StatusText>,
          ],
          ['Auto firmware update', server.autoIloUpdate],
        ]}
      />
    </Card>
    <Card
      title="Location"
      action={<Button icon={<Edit />} a11yTitle="Edit location" />}
    >
      <Pairs
        pairs={[
          ['Name', server.location.name],
          ['Address', server.location.address],
        ]}
      />
    </Card>
    <EmailNotifications server={server} />
  </Facet>
);

// ----------------------------------------------------------------- Health
const SEVERITY_ORDER = { critical: 0, warning: 1, unknown: 2, ok: 3 };

const Health = ({ server }) => {
  const counts = server.componentHealth.reduce((acc, c) => {
    acc[c.severity] = (acc[c.severity] ?? 0) + 1;
    return acc;
  }, {});
  const note = ['critical', 'warning']
    .filter((s) => counts[s])
    .map((s) => `${counts[s]} ${s}`)
    .join(' · ');
  const components = [...server.componentHealth].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
  return (
    <Facet>
      <Card title="Overall health">
        <Box direction="row" gap="large" wrap>
          <Fact label="Status">
            <ServerHealth health={server.health} weight={500} />
          </Fact>
          <Fact label="Components">
            {`${server.componentHealth.length} monitored${note ? ` · ${note}` : ''}`}
          </Fact>
        </Box>
      </Card>
      <Card
        title="Component health"
        note={
          note ? 'Components needing attention are listed first' : undefined
        }
      >
        <List data={components} pad="none">
          {(c, index) => (
            <ListRow index={index} count={components.length}>
              <ListPrimary>{c.name}</ListPrimary>
              <ListStatus>
                <StatusText severity={c.severity}>{c.status}</StatusText>
              </ListStatus>
            </ListRow>
          )}
        </List>
      </Card>
    </Facet>
  );
};

// --------------------------------------------------------------- Firmware
const Firmware = ({ server, connected }) => (
  <Facet>
    <Card
      title="Firmware baseline"
      action={
        <Button label="Update firmware" size="small" disabled={!connected} />
      }
    >
      <Pairs
        pairs={[
          ['Baseline', <Anchor label={server.baselineName} href="#" />],
          ['Compliance', server.baseline],
          ['Last operation', server.lastFirmwareOperation],
        ]}
      />
    </Card>
    <Card title="Firmware" note={`${server.firmware.length} components`}>
      <List data={server.firmware} pad="none">
        {(f, index) => (
          <ListRow index={index} count={server.firmware.length}>
            <Box>
              <ListPrimary>{f.name}</ListPrimary>
              <Text size="small" color="text-weak">
                {f.location}
              </Text>
            </Box>
            <ListStatus>
              <Text>{f.version}</Text>
            </ListStatus>
          </ListRow>
        )}
      </List>
    </Card>
    <Card
      title="HPE drivers and software"
      note={`${server.drivers.length} installed`}
    >
      <List data={server.drivers} pad="none">
        {(d, index) => (
          <ListRow index={index} count={server.drivers.length}>
            <ListPrimary>{d.name}</ListPrimary>
            <ListStatus width="medium">
              <Text wordBreak="break-all">{d.version}</Text>
            </ListStatus>
          </ListRow>
        )}
      </List>
    </Card>
  </Facet>
);

// --------------------------------------------------------------- Hardware
const Hardware = ({ server }) => {
  const hw = server.hardware;
  const [slots, filled] = hw.memorySlots;
  return (
    <Facet>
      <Card
        title="Hardware inventory"
        note={`Last collected ${hw.lastCollection}`}
        action={
          <Box direction="row" gap="xsmall">
            <Button icon={<Refresh />} size="small" a11yTitle="Collect now" />
            <Button
              icon={<Download />}
              size="small"
              a11yTitle="Download inventory"
            />
          </Box>
        }
      >
        <Pairs
          pairs={[
            ['Manufacturer', server.manufacturer],
            ['Platform', server.platform],
            ['Form factor', hw.formFactor],
            ['Chassis type', hw.chassisType],
            ['UID indicator', server.uidIndicator],
            ['UUID', <Text wordBreak="break-all">{server.uuid}</Text>],
          ]}
        />
      </Card>
      <Card title="Processors" note={`${hw.processors.length} sockets`}>
        <List data={hw.processors} pad="none">
          {(p, index) => (
            <ListRow index={index} count={hw.processors.length}>
              <Box>
                <ListPrimary>{p.name}</ListPrimary>
                <Text size="small" color="text-weak">
                  {p.max} max · {p.rated} rated
                </Text>
              </Box>
              <ListStatus>
                <Text>
                  {p.cores} cores · {p.threads} threads
                </Text>
              </ListStatus>
            </ListRow>
          )}
        </List>
      </Card>
      <Card title="Memory" note={`${filled} of ${slots} slots filled`}>
        <Table
          columns={[
            {
              property: 'location',
              header: 'Location',
              primary: true,
              render: (m) => (
                <Box>
                  <Text weight={500}>{m.location}</Text>
                  <Text size="small" color="text-weak">
                    {m.type} · {m.technology} · {m.part}
                  </Text>
                </Box>
              ),
            },
            {
              property: 'size',
              header: 'Size',
              render: (m) => (
                <Text style={{ whiteSpace: 'nowrap' }}>{m.size}</Text>
              ),
            },
            {
              property: 'speed',
              header: 'Speed',
              render: (m) => (
                <Text style={{ whiteSpace: 'nowrap' }}>{m.speed}</Text>
              ),
            },
            { property: 'serial', header: 'Serial number' },
          ]}
          data={hw.memory}
        />
      </Card>
      {hw.networkAdapters.map((adapter) => (
        <Card
          key={adapter.name}
          title={adapter.name}
          note={`Network adapter · ${adapter.ports.length} ports`}
        >
          <List data={adapter.ports} pad="none">
            {(p, index) => (
              <ListRow index={index} count={adapter.ports.length}>
                <ListPrimary>{p.port}</ListPrimary>
                <ListStatus>
                  <Text>{p.address}</Text>
                </ListStatus>
              </ListRow>
            )}
          </List>
        </Card>
      ))}
    </Facet>
  );
};

// ---------------------------------------------------------------- Storage
const Storage = ({ server }) => {
  const byController = server.volumes.reduce((acc, v) => {
    (acc[v.controller] ??= []).push(v);
    return acc;
  }, {});
  const controllers = Object.entries(byController);
  return (
    <Facet>
      {controllers.length ? (
        controllers.map(([controller, volumes]) => (
          <Card
            key={controller}
            title={controller}
            note={`${volumes.length} ${volumes.length === 1 ? 'volume' : 'volumes'}`}
          >
            <Table
              columns={[
                {
                  property: 'name',
                  header: 'Volume',
                  primary: true,
                  render: (v) => (
                    <Text weight={500} truncate>
                      {v.name}
                    </Text>
                  ),
                },
                {
                  property: 'state',
                  header: 'State',
                  render: (v) => (
                    <StatusText severity={v.state === 'OK' ? 'ok' : 'warning'}>
                      {v.state}
                    </StatusText>
                  ),
                },
                { property: 'capacity', header: 'Capacity' },
                { property: 'raid', header: 'RAID' },
                { property: 'drives', header: 'Drives', align: 'end' },
                { property: 'spares', header: 'Spares', align: 'end' },
              ]}
              data={volumes}
            />
          </Card>
        ))
      ) : (
        <EmptyState
          level={4}
          title="No storage volumes"
          description="Volumes configured on this server's storage controllers will be listed here."
        />
      )}
    </Facet>
  );
};

// ---------------------------------------------------------------- Support
const Support = ({ server }) => {
  const { support } = server;
  const expired = support.status === 'Expired';
  return (
    <Facet>
      <Card
        title="Support contract"
        action={expired && <Button label="Renew" size="small" />}
      >
        <Pairs
          pairs={[
            [
              'Status',
              <StatusText severity={expired ? 'critical' : 'ok'}>
                {support.status}
              </StatusText>,
            ],
            [expired ? 'Expired on' : 'Expires on', support.expires],
            ['Serial number', server.serial],
            ['Product ID', server.productId],
          ]}
        />
      </Card>
      <Card
        title="Support cases"
        note={`${support.cases} open`}
        action={<Button label="Open a case" size="small" />}
      >
        {support.cases ? (
          <List
            data={Array.from({ length: support.cases }, (_, i) => ({
              id: `CASE-${server.serial.slice(-4)}${i + 1}`,
              title: 'Power supply failure reported by iLO',
              opened: '2/17/2026',
            }))}
            pad="none"
          >
            {(c, index) => (
              <ListRow index={index} count={support.cases}>
                <Box>
                  <Anchor label={c.id} weight={500} href="#" />
                  <Text size="small" color="text-weak">
                    {c.title} · Opened {c.opened}
                  </Text>
                </Box>
                <ListStatus>
                  <StatusText severity="warning">Open</StatusText>
                </ListStatus>
              </ListRow>
            )}
          </List>
        ) : (
          <EmptyState
            level={4}
            title="No open cases"
            description="Support cases opened for this server will be listed here."
          />
        )}
      </Card>
    </Facet>
  );
};

// E · Detail body — same 6 facets as the COM server page
export const ServerDetail = ({ server }) => {
  const [tab, setTab] = useState(0);
  const connected = server.state === 'Connected';
  return (
    <Box>
      <DetailHeader server={server}>
        <HealthNotice server={server} onView={() => setTab(1)} />
      </DetailHeader>
      {!connected && (
        <Box margin={{ top: 'medium' }} flex={false}>
          <Notification
            status="info"
            message={`iLO disconnected since ${server.disconnectedSince}. Details and health may not be current, and some actions are unavailable.`}
            actions={[{ label: 'Learn more', href: '#' }]}
          />
        </Box>
      )}
      <Tabs
        activeIndex={tab}
        onActive={setTab}
        justify="start"
        flex={false}
        margin={{ top: 'small' }}
      >
        <Tab title="Overview">
          <Section title="Overview" hideTitle>
            <Summary server={server} />
          </Section>
        </Tab>
        <Tab title="Health">
          <Section title="Health" hideTitle>
            <Health server={server} />
          </Section>
        </Tab>
        <Tab title="Firmware">
          <Section title="Firmware" hideTitle>
            <Firmware server={server} connected={connected} />
          </Section>
        </Tab>
        <Tab title="Hardware">
          <Section title="Hardware" hideTitle>
            <Hardware server={server} />
          </Section>
        </Tab>
        <Tab title="Storage">
          <Section title="Storage" hideTitle>
            <Storage server={server} />
          </Section>
        </Tab>
        <Tab title="Support">
          <Section title="Support" hideTitle>
            <Support server={server} />
          </Section>
        </Tab>
      </Tabs>
    </Box>
  );
};
