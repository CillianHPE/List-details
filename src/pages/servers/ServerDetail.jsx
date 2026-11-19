import { useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  Heading,
  List,
  Menu,
  NameValueList,
  NameValuePair,
  Notification,
  Tab,
  Tabs,
  Text,
} from 'grommet';
import { Download, Refresh } from '@hpe-design/icons-grommet';
import { EmptyState } from '../../components/EmptyState';
import {
  ListPrimary,
  ListRow,
  Section,
  Table,
  usePairDirection,
} from '../../pattern/detail';
import { ServerHealth, StatusText } from './ServerHealth';

// Servers · Compute Ops Management. The COM detail page's facets, read side
// by side with the list instead of on a separate page.

// ------------------------------------------------------------- primitives

// Contained card: groups related pairs so a facet reads as a few blocks
// rather than one long list.
const Card = ({ title, note, action, children }) => (
  <Box
    background="background-contrast"
    round="medium"
    pad="medium"
    gap="medium"
    flex={false}
  >
    {(title || action) && (
      <Box direction="row" align="start" justify="between" gap="medium" wrap>
        <Box gap="4xsmall">
          <Heading level={4} size="small" margin="none">
            {title}
          </Heading>
          {note && (
            <Text size="small" color="text-weak">
              {note}
            </Text>
          )}
        </Box>
        {action}
      </Box>
    )}
    {children}
  </Box>
);

// Name beside value in one column; stacks when the card gets too narrow
const Pairs = ({ pairs }) => {
  const [ref, direction] = usePairDirection();
  return (
    <Box ref={ref}>
      <NameValueList pairProps={{ direction }} nameProps={{ width: 'small' }}>
        {pairs.map(([name, value]) => (
          <NameValuePair key={name} name={name}>
            {typeof value === 'string' ? <Text>{value}</Text> : value}
          </NameValuePair>
        ))}
      </NameValueList>
    </Box>
  );
};

const TableHeader = ({ title, note, action }) => (
  <Box direction="row" align="end" justify="between" gap="medium" wrap>
    <Box gap="4xsmall">
      <Heading level={4} size="small" margin="none">
        {title}
      </Heading>
      {note && (
        <Text size="small" color="text-weak">
          {note}
        </Text>
      )}
    </Box>
    {action}
  </Box>
);

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
// (as COM shows top-right of its detail page). Key facts live in Summary.
const DetailHeader = ({ server }) => {
  const connected = server.state === 'Connected';
  return (
    <Box flex={false}>
      <Box direction="row" align="start" justify="between" gap="small" wrap>
        <Box gap="xxsmall">
          <Heading level={2} margin="none">
            {server.name}
          </Heading>
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
    </Box>
  );
};

// ---------------------------------------------------------------- Summary
const SECURITY_SEVERITY = {
  OK: 'ok',
  'At risk': 'critical',
  'Ignore risk': 'warning',
};

// Status: the at-a-glance facts (health, connection, power, group, alerts),
// first in Summary so they are the first thing read in the details area.
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
    <Card title="Location" action={<Button label="Edit" size="small" />}>
      <Pairs
        pairs={[
          ['Name', server.location.name],
          ['Address', server.location.address],
        ]}
      />
    </Card>
    <Card
      title="Email notifications"
      action={<Button label="Edit" size="small" />}
    >
      <List
        data={[
          ['Issues', server.notifications.issues],
          ['Power state change', server.notifications.powerState],
          ['Disconnect or not monitored', server.notifications.disconnect],
          ['Daily summary', server.notifications.dailySummary],
        ]}
        pad="none"
      >
        {([label, on], index) => (
          <ListRow index={index} count={4}>
            <Text>{label}</Text>
            <Text color={on ? undefined : 'text-weak'}>
              {on ? 'Subscribed' : 'Off'}
            </Text>
          </ListRow>
        )}
      </List>
    </Card>
  </Facet>
);

// ----------------------------------------------------------------- Health
const Health = ({ server }) => {
  const counts = server.componentHealth.reduce((acc, c) => {
    acc[c.severity] = (acc[c.severity] ?? 0) + 1;
    return acc;
  }, {});
  const note = ['critical', 'warning']
    .filter((s) => counts[s])
    .map((s) => `${counts[s]} ${s}`)
    .join(' · ');
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
      <Box gap="small">
        <TableHeader title="Component health" />
        <List data={server.componentHealth} pad="none">
          {(c, index) => (
            <ListRow index={index} count={server.componentHealth.length}>
              <Text>{c.name}</Text>
              <StatusText severity={c.severity}>{c.status}</StatusText>
            </ListRow>
          )}
        </List>
      </Box>
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
    <Box gap="small">
      <TableHeader
        title="Firmware"
        note={`${server.firmware.length} components`}
      />
      <List data={server.firmware} pad="none">
        {(f, index) => (
          <ListRow index={index} count={server.firmware.length}>
            <Box>
              <ListPrimary>{f.name}</ListPrimary>
              <Text size="small" color="text-weak">
                {f.location}
              </Text>
            </Box>
            <Text flex={false}>{f.version}</Text>
          </ListRow>
        )}
      </List>
    </Box>
    <Box gap="small">
      <TableHeader title="HPE drivers and software" />
      <List data={server.drivers} pad="none">
        {(d, index) => (
          <ListRow index={index} count={server.drivers.length}>
            <ListPrimary>{d.name}</ListPrimary>
            <Text flex={false}>{d.version}</Text>
          </ListRow>
        )}
      </List>
    </Box>
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
      <Box gap="small">
        <TableHeader title="Processors" />
        <List data={hw.processors} pad="none">
          {(p, index) => (
            <ListRow index={index} count={hw.processors.length}>
              <Box>
                <ListPrimary>{p.name}</ListPrimary>
                <Text size="small" color="text-weak">
                  {p.max} max · {p.rated} rated
                </Text>
              </Box>
              <Text flex={false}>
                {p.cores} cores · {p.threads} threads
              </Text>
            </ListRow>
          )}
        </List>
      </Box>
      <Box gap="small">
        <TableHeader
          title="Memory"
          note={`${filled} of ${slots} slots filled`}
        />
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
                    {m.type} · {m.technology}
                  </Text>
                </Box>
              ),
            },
            { property: 'size', header: 'Size' },
            { property: 'speed', header: 'Speed' },
            { property: 'serial', header: 'Serial number' },
            { property: 'part', header: 'Part number' },
          ]}
          data={hw.memory}
        />
      </Box>
      <Box gap="small">
        <TableHeader
          title="Network adapters"
          note={`${hw.networkAdapters.length} adapters`}
        />
        <Box gap="small">
          {hw.networkAdapters.map((adapter) => (
            <Card key={adapter.name} title={adapter.name}>
              <List data={adapter.ports} pad="none">
                {(p, index) => (
                  <ListRow index={index} count={adapter.ports.length}>
                    <Text>{p.port}</Text>
                    <Text color="text-weak">{p.address}</Text>
                  </ListRow>
                )}
              </List>
            </Card>
          ))}
        </Box>
      </Box>
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
          <Box key={controller} gap="small">
            <TableHeader
              title={controller}
              note={`${volumes.length} ${volumes.length === 1 ? 'volume' : 'volumes'}`}
            />
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
          </Box>
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
      <Box gap="small">
        <TableHeader
          title="Support cases"
          note={`${support.cases} open`}
          action={<Button label="Open a case" size="small" />}
        />
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
                <StatusText severity="warning">Open</StatusText>
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
      </Box>
    </Facet>
  );
};

// E · Detail body — same 6 facets as the COM server page
export const ServerDetail = ({ server }) => {
  const [tab, setTab] = useState(0);
  const connected = server.state === 'Connected';
  return (
    <Box>
      <DetailHeader server={server} />
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
        <Tab title="Summary">
          <Section title="Summary" hideTitle>
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
