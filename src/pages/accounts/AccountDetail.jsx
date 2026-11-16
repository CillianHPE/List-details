import { useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  Heading,
  List,
  Menu,
  Meter,
  NameValueList,
  NameValuePair,
  Tab,
  Tabs,
  Text,
} from 'grommet';
import {
  Analytics,
  Alert,
  LinkNext,
  More,
  ShieldSecurity,
  StatusCritical,
  StatusGood,
  StatusWarning,
} from '@hpe-design/icons-grommet';
import { EmptyState } from '../../components/EmptyState';
import { ListRow, Section, usePairDirection } from '../../pattern/detail';
import { HealthIndicator } from './HealthIndicator';

// D · Detail header — identity line mirrors the redesigned account page's
// metadata row (ID · industry · type · country · created · health), with the
// record actions trailing. The account chooser that page used is gone: the
// list zone is the chooser.
const DetailHeader = ({ account }) => (
  <Box flex={false} gap="xsmall">
    <Box direction="row" align="center" gap="small" wrap>
      <Heading level={2} margin="none">
        {account.name}
      </Heading>
      <Box flex />
      <Menu
        label="Actions"
        dropProps={{ align: { top: 'bottom', right: 'right' } }}
        items={[
          [
            { label: 'Open workspace' },
            { label: 'Edit sector mapping' },
            { label: 'Re-score health' },
          ],
          [{ label: 'Export account report' }],
          [{ label: 'Archive account' }],
        ]}
      />
    </Box>
    <Box direction="row" align="center" gap="small" wrap>
      <HealthIndicator health={account.health} />
      <Text size="small" color="text-weak">
        {account.industry} · {account.type} · {account.country} · Created{' '}
        {account.created}
      </Text>
    </Box>
    <Text size="xsmall" color="text-weak" truncate>
      {account.id}
    </Text>
  </Box>
);

// Grouped name–value pairs, as the Users detail does; groups separated by a
// weak divider, group headings one size up from the 16px pairs.
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
                {typeof value === 'string' || typeof value === 'number' ? (
                  <Text>{value}</Text>
                ) : (
                  value
                )}
              </NameValuePair>
            ))}
          </NameValueList>
        </Box>
      ))}
    </Box>
  );
};

// Health score dimensions with their weights (Adoption 30 · Configuration 30 ·
// Engagement 25 · Risk 15, inverted). Missing dimensions are excluded and the
// remaining weights rebalanced.
const DIMENSIONS = [
  ['Adoption', 'adoption', '30%'],
  ['Configuration', 'configuration', '30%'],
  ['Engagement', 'engagement', '25%'],
  ['Risk', 'risk', '15%, inverted'],
];

const Dimension = ({ value }) => (
  <Box direction="row" align="center" gap="small">
    <Meter
      type="bar"
      size="small"
      thickness="xsmall"
      max={100}
      values={[{ value, color: 'graph-0' }]}
    />
    <Text>{value}</Text>
  </Box>
);

const Summary = ({ account }) => {
  const { health } = account;
  return (
    <>
      <PairGroups
        groups={[
          {
            title: 'Health',
            pairs: [
              ['Score', <HealthIndicator key="h" health={health} />],
              ['Signals', account.summary],
              ...DIMENSIONS.map(([label, key, weight]) => [
                `${label} (${weight})`,
                <Dimension key={key} value={health.dimensions[key]} />,
              ]),
            ],
          },
          {
            title: 'Account snapshot',
            pairs: [
              ['Users', `${account.userCount} · ${account.activeUsers} active`],
              [
                'Devices',
                `${account.devices} · ${account.activeDevices} active`,
              ],
              ['Paid subscriptions', account.subscriptions.length],
              ['Last login', account.lastLogin],
            ],
          },
        ]}
      />
      {/* Section actions: each recommended action acts on this facet of the
          record, so it lives here rather than in the record menu. */}
      <Section title="Recommended actions">
        {account.gaps.length ? (
          <List data={account.gaps} pad="none">
            {(gap, index) => (
              <ListRow index={index} count={account.gaps.length}>
                <Box direction="row" align="center" gap="small">
                  <StatusWarning color="status-warning" aria-hidden />
                  <Text>Review: {gap}</Text>
                </Box>
                <Button
                  icon={<LinkNext />}
                  a11yTitle={`Review ${gap}`}
                  onClick={() => {}}
                />
              </ListRow>
            )}
          </List>
        ) : (
          <EmptyState
            level={4}
            icon={<StatusGood />}
            title="No configuration gaps"
            description="Security and workspace configuration checks all pass for this account."
          />
        )}
      </Section>
      <Section title="Login anomalies">
        {account.anomalies.length ? (
          <List data={account.anomalies} pad="none">
            {(a, index) => (
              <ListRow index={index} count={account.anomalies.length}>
                <Box>
                  <Text weight={500}>{a.who}</Text>
                  <Text size="small" color="text-weak">
                    {a.what}
                  </Text>
                </Box>
                <Menu
                  icon={<More />}
                  a11yTitle={`Actions for ${a.who}`}
                  dropProps={{ align: { top: 'bottom', right: 'right' } }}
                  items={[
                    { label: 'View login history' },
                    { label: 'Dismiss' },
                  ]}
                />
              </ListRow>
            )}
          </List>
        ) : (
          <EmptyState
            level={4}
            icon={<ShieldSecurity />}
            title="No login anomalies detected"
            description="No unusual login patterns were detected in the last 30 days."
          />
        )}
      </Section>
    </>
  );
};

const TIER_ICON = {
  'Power user': [StatusGood, 'status-ok'],
  Active: [StatusGood, 'status-ok'],
  'At-risk': [StatusWarning, 'status-warning'],
  Inactive: [StatusCritical, 'status-critical'],
};

const UserEngagement = ({ account }) => {
  const rows = account.users;
  return rows.length ? (
    <List data={rows} pad="none">
      {(u, index) => {
        const [Icon, color] = TIER_ICON[u.tier];
        return (
          <ListRow index={index} count={rows.length}>
            <Box>
              <Anchor label={u.handle} weight={500} href="#" />
              <Text size="small" color="text-weak">
                {u.role} · {u.score}/100 · Last access {u.lastAccess}
              </Text>
            </Box>
            <Box direction="row" align="center" gap="small" flex={false}>
              <Box direction="row" align="center" gap="3xsmall">
                <Icon color={color} size="xsmall" aria-hidden />
                <Text size="small">{u.tier}</Text>
              </Box>
              <Menu
                icon={<More />}
                a11yTitle={`Actions for ${u.handle}`}
                dropProps={{ align: { top: 'bottom', right: 'right' } }}
                items={[{ label: 'View user' }, { label: 'Nudge admin' }]}
              />
            </Box>
          </ListRow>
        );
      }}
    </List>
  ) : (
    <EmptyState
      level={4}
      icon={<Analytics />}
      title="No scored users"
      description="Users with login, role or workspace signals will be scored here."
    />
  );
};

const Adoption = ({ account }) => {
  const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '—');
  return (
    <PairGroups
      groups={[
        {
          title: 'Usage',
          pairs: [
            [
              'Active users (30d)',
              `${account.activeUsers} of ${account.userCount} (${pct(account.activeUsers, account.userCount)})`,
            ],
            [
              'Active devices',
              `${account.activeDevices} of ${account.devices} (${pct(account.activeDevices, account.devices)})`,
            ],
            ['Last login', account.lastLogin],
          ],
        },
        {
          title: 'Industry peer benchmarking',
          pairs: account.benchmark
            ? [
                ['Sector', `${account.industry} · ${account.sector}`],
                [
                  'Rank',
                  `${account.benchmark.rank} of ${account.benchmark.of}`,
                ],
                ['Ever-logged-in rate', `${account.benchmark.account}%`],
                ['Sector average', `${account.benchmark.sector}%`],
                [
                  'Difference',
                  `${account.benchmark.account >= account.benchmark.sector ? '+' : ''}${(account.benchmark.account - account.benchmark.sector).toFixed(1)} percentage points`,
                ],
              ]
            : [['Sector', 'No sector mapping — benchmarking unavailable']],
        },
      ]}
    />
  );
};

const Configuration = ({ account }) => {
  const has = (gap) => !account.gaps.includes(gap);
  const check = (ok, label) => (
    <Box direction="row" align="center" gap="3xsmall">
      {ok ? (
        <StatusGood color="status-ok" size="xsmall" aria-hidden />
      ) : (
        <Alert color="status-warning" size="xsmall" aria-hidden />
      )}
      <Text>{label}</Text>
    </Box>
  );
  return (
    <PairGroups
      groups={[
        {
          title: 'Security',
          pairs: [
            [
              'Multi-factor authentication',
              check(
                has('MFA not configured'),
                has('MFA not configured') ? 'Configured' : 'Not configured',
              ),
            ],
            [
              'IP access rules',
              check(
                has('No IP access rules configured'),
                has('No IP access rules configured')
                  ? 'Configured'
                  : 'Not configured',
              ),
            ],
            [
              'Single sign-on',
              check(
                has('SSO not enforced'),
                has('SSO not enforced') ? 'Enforced' : 'Not enforced',
              ),
            ],
          ],
        },
        {
          title: 'Workspace',
          pairs: [
            [
              'Configuration score',
              `${account.health.dimensions.configuration}/100`,
            ],
            ['Workspace type', account.type],
            ['Workspace ID', account.id],
          ],
        },
      ]}
    />
  );
};

const STATUS_ICON = {
  Active: [StatusGood, 'status-ok'],
  Expiring: [StatusWarning, 'status-warning'],
  Expired: [StatusCritical, 'status-critical'],
};

const Subscriptions = ({ account }) => {
  const rows = account.subscriptions;
  return (
    <List data={rows} pad="none">
      {(s, index) => {
        const [Icon, color] = STATUS_ICON[s.status];
        return (
          <ListRow index={index} count={rows.length}>
            <Box>
              <Anchor label={s.name} weight={500} href="#" />
              <Text size="small" color="text-weak">
                {s.tier} · {s.devices} devices · Ends {s.ends}
              </Text>
            </Box>
            <Box direction="row" align="center" gap="3xsmall" flex={false}>
              <Icon color={color} size="xsmall" aria-hidden />
              <Text size="small">{s.status}</Text>
            </Box>
          </ListRow>
        );
      }}
    </List>
  );
};

// E · Detail body — tabs mirror the redesigned account page's tab bar
// (Summary · User engagement · Adoption · Configuration · Subscriptions).
export const AccountDetail = ({ account }) => {
  const [tab, setTab] = useState(0);
  return (
    <Box>
      <DetailHeader account={account} />
      <Tabs
        activeIndex={tab}
        onActive={setTab}
        justify="start"
        flex={false}
        margin={{ top: 'small' }}
      >
        <Tab title="Summary">
          <Section title="Summary" hideTitle>
            <Summary account={account} />
          </Section>
        </Tab>
        <Tab title="User engagement">
          <Section
            title="User engagement"
            hideTitle
            action={
              account.users.length > 0 && (
                <Button label="Re-score users" secondary />
              )
            }
          >
            <UserEngagement account={account} />
          </Section>
        </Tab>
        <Tab title="Adoption">
          <Section title="Adoption" hideTitle>
            <Adoption account={account} />
          </Section>
        </Tab>
        <Tab title="Configuration">
          <Section title="Configuration" hideTitle>
            <Configuration account={account} />
          </Section>
        </Tab>
        <Tab title="Subscriptions">
          <Section
            title="Subscriptions"
            hideTitle
            action={<Button label="Add subscription" secondary />}
          >
            <Subscriptions account={account} />
          </Section>
        </Tab>
      </Tabs>
    </Box>
  );
};
