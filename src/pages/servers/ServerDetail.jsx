import { useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  DataTable,
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
import { ListRow, Section, usePairDirection } from '../../pattern/detail';
import { ServerHealth, StatusText } from './ServerHealth';

// Servers · Compute Ops Management. The COM detail page's facets, read side
// by side with the list instead of on a separate page.

// D · Detail header — name · "Model · Serial · Group" · health, with the
// record-level Actions menu COM shows top-right of its detail page.
const DetailHeader = ({ server }) => {
  const connected = server.state === 'Connected';
  return (
    <Box flex={false} gap="small">
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
      <Box direction="row" align="center" gap="medium" wrap>
        <ServerHealth health={server.health} />
        <Text size="small" color="text-weak">
          {connected ? `Connected · Power ${server.power.toLowerCase()}` : 'Not connected'}
          {' · '}
          {server.group}
        </Text>
      </Box>
    </Box>
  );
};

// Groups of name/value pairs, divided so the facet doesn't read as one list
const PairGroups = ({ groups }) => {
  const [ref, direction] = usePairDirection();
  return (
    <Box ref={ref}>
      {groups.map((group, index) => (
        <Box
          key={group.title}
          gap="small"
          pad={{ vertical: 'medium' }}
          border={
            index < groups.length - 1
              ? { side: 'bottom', color: 'border-weak' }
              : false
          }
        >
          <Heading level={4} size="medium" margin="none">
            {group.title}
          </Heading>
          <NameValueList
            pairProps={{ direction }}
            nameProps={{ width: 'small' }}
          >
            {group.pairs.map(([name, value]) => (
              <NameValuePair key={name} name={name}>
                {typeof value === 'string' ? <Text>{value}</Text> : value}
              </NameValuePair>
            ))}
          </NameValueList>
        </Box>
      ))}
    </Box>
  );
};

const SubHeading = ({ title, note }) => (
  <Box gap="4xsmall">
    <Heading level={4} size="medium" margin="none">
      {title}
    </Heading>
    {note && (
      <Text size="small" color="text-weak">
        {note}
      </Text>
    )}
  </Box>
);

// ---------------------------------------------------------------- Summary
const SECURITY_SEVERITY = { OK: 'ok', 'At risk': 'critical', 'Ignore risk': 'warning' };

const Summary = ({ server }) => (
  <PairGroups
    groups={[
      {
        title: 'Details',
        pairs: [
          ['State', server.state],
          ['Alerts', `${server.alerts}`],
          ['Group', <Anchor label={server.group} href="#" />],
          ['Connection type', server.connectionType],
          ['Manufacturer', server.manufacturer],
          ['Model', server.model],
          ['Serial number', server.serial],
          [
            'iLO security status',
            <StatusText severity={SECURITY_SEVERITY[server.iloSecurity]}>
              {server.iloSecurity}
            </StatusText>,
          ],
          ['UUID', server.uuid],
          ['iLO IP address', <Anchor label={server.iloIp} href="#" />],
          ['iLO hostname', <Anchor label={server.iloHostname} href="#" />],
          ['Baseline', server.baseline],
          ['Product ID', server.productId],
          ['Power', server.power],
          ['UID indicator', server.uidIndicator],
          ['Operating system', server.os],
          ['Subscription', server.subscription],
          ['Platform', server.platform],
          ['Auto iLO firmware update', server.autoIloUpdate],
        ],
      },
      {
        title: 'Location',
        pairs: [
          ['Name', server.location.name],
          ['Address', server.location.address],
        ],
      },
      {
        title: 'Email notifications',
        pairs: [
          [
            'Issues',
            server.notifications.issues
              ? 'Subscribed to service event, critical and warning issues'
              : 'Not subscribed',
          ],
          [
            'Power state change',
            server.notifications.powerState ? 'Subscribed' : 'Not subscribed',
          ],
          [
            'Disconnect or not monitored',
            server.notifications.disconnect ? 'Subscribed' : 'Not subscribed',
          ],
          [
            'Daily summary',
            server.notifications.dailySummary
              ? 'Subscribed to a daily health and recommendations email'
              : 'Not subscribed',
          ],
        ],
      },
    ]}
  />
);

// ----------------------------------------------------------------- Health
const Health = ({ server }) => (
  <Box gap="medium" pad={{ top: 'medium' }}>
    <Box gap="small">
      <SubHeading title="General" />
      <NameValueList nameProps={{ width: 'small' }}>
        <NameValuePair name="Overall health">
          <ServerHealth health={server.health} />
        </NameValuePair>
      </NameValueList>
    </Box>
    <Box gap="small">
      <SubHeading title="Component health" />
      <List data={server.componentHealth} pad="none">
        {(c, index) => (
          <ListRow index={index} count={server.componentHealth.length}>
            <Text>{c.name}</Text>
            <StatusText severity={c.severity}>{c.status}</StatusText>
          </ListRow>
        )}
      </List>
    </Box>
  </Box>
);

// --------------------------------------------------------------- Firmware
const Firmware = ({ server }) => (
  <Box gap="medium" pad={{ top: 'medium' }}>
    <Box gap="small">
      <SubHeading title="General" />
      <NameValueList nameProps={{ width: 'small' }}>
        <NameValuePair name="Last operation">
          <Text>{server.lastFirmwareOperation}</Text>
        </NameValuePair>
        <NameValuePair name="Baseline">
          <Anchor label={server.baselineName} href="#" />
        </NameValuePair>
      </NameValueList>
    </Box>
    <Box gap="small">
      <SubHeading title="Firmware" note={`${server.firmware.length} components`} />
      <Box overflow="auto">
        <DataTable
          columns={[
            {
              property: 'name',
              header: 'Component',
              primary: true,
              render: (f) => <Text weight={500}>{f.name}</Text>,
            },
            { property: 'location', header: 'Location' },
            { property: 'version', header: 'Version' },
          ]}
          data={server.firmware}
        />
      </Box>
    </Box>
    <Box gap="small">
      <SubHeading title="HPE drivers and software" />
      <Box overflow="auto">
        <DataTable
          columns={[
            {
              property: 'name',
              header: 'Driver',
              primary: true,
              render: (d) => <Text weight={500}>{d.name}</Text>,
            },
            { property: 'version', header: 'Version' },
          ]}
          data={server.drivers}
        />
      </Box>
    </Box>
  </Box>
);

// --------------------------------------------------------------- Hardware
const Hardware = ({ server }) => {
  const hw = server.hardware;
  const [slots, filled] = hw.memorySlots;
  return (
    <Box gap="medium" pad={{ top: 'medium' }}>
      <Box gap="small">
        <SubHeading title="Hardware inventory" />
        <NameValueList nameProps={{ width: 'small' }}>
          <NameValuePair name="Last collection">
            <Box direction="row" align="center" gap="xsmall">
              <Text>{hw.lastCollection}</Text>
              <Button icon={<Refresh />} size="small" a11yTitle="Collect now" />
              <Button
                icon={<Download />}
                size="small"
                a11yTitle="Download inventory"
              />
            </Box>
          </NameValuePair>
        </NameValueList>
      </Box>
      <Box gap="small">
        <SubHeading title="Platform" />
        <NameValueList nameProps={{ width: 'small' }}>
          <NameValuePair name="Form factor">
            <Text>{hw.formFactor}</Text>
          </NameValuePair>
          <NameValuePair name="Chassis type">
            <Text>{hw.chassisType}</Text>
          </NameValuePair>
        </NameValueList>
      </Box>
      <Box gap="small">
        <SubHeading
          title="Processors"
          note={`${hw.processors.length} of ${hw.processors.length} total sockets`}
        />
        <Box overflow="auto">
          <DataTable
            columns={[
              { property: 'name', header: 'Name', primary: true },
              { property: 'max', header: 'Max speed' },
              { property: 'rated', header: 'Rated speed' },
              { property: 'cores', header: 'Cores', align: 'end' },
              { property: 'threads', header: 'Threads', align: 'end' },
            ]}
            data={hw.processors.map((p, i) => ({ ...p, id: i }))}
          />
        </Box>
      </Box>
      <Box gap="small">
        <SubHeading title="Memory" note={`${filled} of ${slots} total slots`} />
        <Box overflow="auto">
          <DataTable
            columns={[
              { property: 'location', header: 'Location', primary: true },
              { property: 'type', header: 'Type' },
              { property: 'size', header: 'Size' },
              { property: 'speed', header: 'Operating speed' },
              { property: 'technology', header: 'Technology' },
              { property: 'serial', header: 'Serial number' },
              { property: 'part', header: 'Part number' },
            ]}
            data={hw.memory}
          />
        </Box>
      </Box>
      <Box gap="small">
        <SubHeading
          title="Network adapters"
          note={`${hw.networkAdapters.length} network adapters`}
        />
        {hw.networkAdapters.map((adapter) => (
          <Box key={adapter.name} gap="xsmall">
            <Text size="small" color="text-weak">
              {adapter.name}
            </Text>
            <DataTable
              columns={[
                { property: 'port', header: 'Port', primary: true },
                { property: 'address', header: 'Address' },
              ]}
              data={adapter.ports}
            />
          </Box>
        ))}
      </Box>
    </Box>
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
    <Box gap="medium" pad={{ top: 'medium' }}>
      <SubHeading title="Internal storage volumes" />
      {controllers.length ? (
        controllers.map(([controller, volumes]) => (
          <Box key={controller} gap="xsmall">
            <Text size="small" color="text-weak">
              {controller}
            </Text>
            <Box overflow="auto">
              <DataTable
                columns={[
                  {
                    property: 'name',
                    header: 'Volume name',
                    primary: true,
                    render: (v) => (
                      <Text weight={500} truncate>
                        {v.name}
                      </Text>
                    ),
                  },
                  { property: 'state', header: 'State' },
                  { property: 'capacity', header: 'Capacity' },
                  { property: 'raid', header: 'RAID type' },
                  { property: 'drives', header: 'Drives', align: 'end' },
                  { property: 'spares', header: 'Spares', align: 'end' },
                ]}
                data={volumes}
              />
            </Box>
          </Box>
        ))
      ) : (
        <EmptyState
          level={4}
          title="No storage volumes"
          description="Volumes configured on this server's storage controllers will be listed here."
        />
      )}
    </Box>
  );
};

// ---------------------------------------------------------------- Support
const Support = ({ server }) => {
  const { support } = server;
  const expired = support.status === 'Expired';
  return (
    <Box gap="medium" pad={{ top: 'medium' }}>
      <Box gap="small">
        <SubHeading title="Support contract" />
        <NameValueList nameProps={{ width: 'small' }}>
          <NameValuePair name="Status">
            <StatusText severity={expired ? 'critical' : 'ok'}>
              {support.status}
            </StatusText>
          </NameValuePair>
          <NameValuePair name={expired ? 'Expired on' : 'Expires on'}>
            <Text>{support.expires}</Text>
          </NameValuePair>
          <NameValuePair name="Serial number">
            <Text>{server.serial}</Text>
          </NameValuePair>
          <NameValuePair name="Product ID">
            <Text>{server.productId}</Text>
          </NameValuePair>
        </NameValueList>
      </Box>
      <Box gap="small">
        <SubHeading title="Support cases" />
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
            actions={<Button label="Open a case" secondary />}
          />
        )}
      </Box>
    </Box>
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
            message={`The iLO for this server has been disconnected since ${server.disconnectedSince}. Details and health information may not be current, and some actions are unavailable.`}
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
          <Section
            title="Firmware"
            hideTitle
            action={
              <Button label="Update firmware" secondary disabled={!connected} />
            }
          >
            <Firmware server={server} />
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
