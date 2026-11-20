import { useState } from 'react';
import { useDetailTab } from '../../shell/ShellContext';
import {
  Anchor,
  Box,
  Button,
  DataChart,
  Grid,
  Heading,
  List,
  Menu,
  Meter,
  Select,
  Tab,
  Text,
} from 'grommet';
import {
  Analytics,
  Down,
  Up,
  LinkNext,
  ChartLine,
  StatusCritical,
  StatusGood,
  StatusUnknown,
  StatusWarning,
  Table as TableIcon,
} from '@hpe-design/icons-grommet';
import { EmptyState } from '../../components/EmptyState';
import {
  ListPrimary,
  ListRow,
  ListStatus,
  Section,
  Table,
  DetailTabs,
} from '../../pattern/detail';
import { hpe } from 'grommet-theme-hpe';
import { SERVICES, TIERS } from '../../data/cockpit';
import {
  Bullets,
  Card,
  KpiCard,
  KpiRow,
  Legend,
  PeriodToggle,
  ScoreBlock,
  SectionHeader,
  TierTag,
  usePeriod,
} from './primitives';

// D · Detail header — title · "Industry · City, Country" subtitle · tier tag
// with created date and workspace ID. The Figma pages also carry an account
// Select on this row; here the list zone is the chooser so it is omitted.
const DetailHeader = ({ account }) => (
  <Box flex={false} gap="small">
    <Box direction="row" align="start" justify="between" gap="small" wrap>
      <Box gap="xxsmall">
        <Heading level={2} margin="none">
          {account.name}
        </Heading>
        <Text color="text-weak">
          {account.industryLabel} · {account.location}
        </Text>
      </Box>
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
      <TierTag tier={account.health.tier} />
      <Text size="small" color="text-weak" truncate>
        Created {account.created} · {account.id}
      </Text>
    </Box>
  </Box>
);

const SEVERITY_ICON = {
  ok: [StatusGood, 'status-ok'],
  warning: [StatusWarning, 'status-warning'],
  critical: [StatusCritical, 'status-critical'],
  na: [StatusUnknown, 'status-unknown'],
};

// Status indicator: icon leads the label (HPE status indicator pattern) so
// icons form one column when statuses stack in a list.
const StatusText = ({ severity, children, size }) => {
  const [Icon, color] = SEVERITY_ICON[severity];
  return (
    <Box direction="row" align="center" gap="xsmall" flex={false}>
      <Icon color={color} size="small" aria-hidden />
      <Text size={size}>{children}</Text>
    </Box>
  );
};

// ---------------------------------------------------------------- Summary
const Summary = ({ account }) => {
  const [period, setPeriod] = usePeriod('30 days');
  return (
    <Box gap="large">
      <Grid columns={{ count: 'fit', size: ['large', 'flex'] }} gap="small">
        <Card title="Health" help subtitle="Score out of 100 · updated daily">
          <ScoreBlock
            score={account.health.score}
            tier={account.health.tier}
            signals={account.signals}
          />
        </Card>
        <Card title="Account snapshot" subtitle="Plans, devices and activity">
          <Grid
            columns={{ count: 'fit', size: ['xsmall', 'flex'] }}
            gap="small"
          >
            <Stat
              label="Paid subscriptions"
              value={
                account.subscriptions.filter((s) => s.evaluation === 'Paid')
                  .length
              }
              unit="Paid"
            />
            <Stat
              label="Devices active"
              value={account.activeDevices}
              unit={`of ${account.devices}`}
            />
            <Stat label="Last login" value="1" unit="day ago" />
          </Grid>
          <Bullets
            items={[
              [
                '',
                `${account.devices - account.activeDevices}`,
                ' inactive devices',
              ],
              ['Last login ', account.lastLogin],
              [
                'Workspace configuration incomplete ',
                `(${account.health.dimensions.configuration}/100)`,
              ],
            ]}
          />
        </Card>
      </Grid>

      {/* Section content: each step acts on one facet of this record, so the
          arrows navigate rather than mutate; the record menu stays small. */}
      <Box gap="small">
        <SectionHeader title="What this account should be next" />
        {account.nextSteps.length ? (
          <List data={account.nextSteps} pad="none">
            {(step, index) => (
              <ListRow index={index} count={account.nextSteps.length}>
                <Box direction="row" gap="small">
                  <Text color="text-weak">{index + 1}</Text>
                  <Box>
                    <Text weight={500}>{step.title}</Text>
                    <Text size="small" color="text-weak">
                      {step.description}
                    </Text>
                  </Box>
                </Box>
                <Button
                  icon={<LinkNext />}
                  a11yTitle={step.title}
                  onClick={() => {}}
                />
              </ListRow>
            )}
          </List>
        ) : (
          <EmptyState
            level={4}
            icon={<StatusGood />}
            title="Nothing outstanding"
            description="Configuration, adoption and engagement checks all pass for this account."
          />
        )}
      </Box>

      <Box gap="small">
        <SectionHeader
          title="Permission anomalies"
          action={<PeriodToggle value={period} onChange={setPeriod} />}
        />
        {account.anomalies.length ? (
          <List data={account.anomalies} pad="none">
            {(a, index) => (
              <ListRow index={index} count={account.anomalies.length}>
                <Box direction="row" align="start" gap="small">
                  <StatusCritical
                    color="status-critical"
                    size="small"
                    aria-hidden
                  />
                  <Box>
                    <Text weight={500}>{a.what}</Text>
                    <Text size="small" color="text-weak">
                      Flagged by {a.who}
                    </Text>
                  </Box>
                </Box>
              </ListRow>
            )}
          </List>
        ) : (
          <EmptyState
            level={4}
            icon={<StatusGood />}
            title="No permission anomalies"
            description={`No unusual permission activity was detected in the last ${period}.`}
          />
        )}
      </Box>

      <Card
        title="Industry peer benchmarking"
        help
        subtitle="Score out of 100 · updated daily"
      >
        <ScoreBlock
          score={account.benchmark.score}
          tier={account.benchmark.tier}
          signals={account.signals}
        />
      </Card>
    </Box>
  );
};

const Stat = ({ label, value, unit }) => (
  <Box gap="xxsmall">
    <Text size="small" weight={500}>
      {label}
    </Text>
    <Box direction="row" align="baseline" gap="xsmall">
      <Heading level={4} size="large" margin="none">
        {value}
      </Heading>
      <Text size="small" color="text-weak">
        {unit}
      </Text>
    </Box>
  </Box>
);

// -------------------------------------------------------- User engagement
const TierDistribution = ({ mix, period, onPeriod }) => (
  <Card
    title="Engagement tier distribution"
    action={<PeriodToggle value={period} onChange={onPeriod} />}
  >
    <Meter
      type="bar"
      size="full"
      thickness="xsmall"
      round
      max={100}
      values={TIERS.map((t) => ({
        value: mix[t.key],
        color: t.color,
        label: t.label,
      }))}
      a11yTitle="Engagement tier distribution"
    />
    <Legend items={TIERS.map((t) => ({ ...t, value: `${mix[t.key]}%` }))} />
  </Card>
);

const UserEngagement = ({ account }) => {
  const [period, setPeriod] = usePeriod();
  const [chart, setChart] = useState('line');
  const { kpis } = account;
  return (
    <Box gap="medium">
      <KpiRow>
        <KpiCard
          label="Users"
          value={kpis.users.total}
          note={`${kpis.users.active} active · ${kpis.users.dormant} dormant`}
        />
        <KpiCard
          label="Administrators"
          value={kpis.admins.total}
          note={`${kpis.admins.active} active · ${kpis.admins.dormant} dormant`}
        />
        <KpiCard
          label="Logins"
          value={kpis.logins.total}
          unit={
            <Box direction="row" align="center" gap="xxsmall">
              {kpis.logins.delta < 0 ? (
                <Down size="small" color="text-weak" aria-hidden />
              ) : (
                <Up size="small" color="text-weak" aria-hidden />
              )}
              {Math.abs(kpis.logins.delta)}% vs Aug
            </Box>
          }
          action={
            <Select
              options={['Last 30 days', 'Last 90 days']}
              value="Last 30 days"
              size="small"
              width="auto"
              a11yTitle="Login period"
              onChange={() => {}}
            />
          }
        />
      </KpiRow>

      <TierDistribution
        mix={account.tierMix}
        period={period}
        onPeriod={setPeriod}
      />

      <Card
        title="Monthly login activity"
        action={
          <Box direction="row" gap="xsmall">
            <Button
              icon={<TableIcon />}
              a11yTitle="Show as table"
              active={chart === 'table'}
              onClick={() => setChart('table')}
            />
            <Button
              icon={<ChartLine />}
              a11yTitle="Show as chart"
              active={chart === 'line'}
              onClick={() => setChart('line')}
            />
          </Box>
        }
      >
        {chart === 'line' ? (
          <DataChart
            data={account.loginActivity}
            series={[
              {
                property: 'day',
                label: 'Days ago',
                render: (d) => (
                  <Text size="xsmall" style={{ whiteSpace: 'nowrap' }}>
                    {d === 0
                      ? '30 days ago'
                      : d === 30
                        ? 'Today'
                        : d === 16
                          ? '14 days ago'
                          : ''}
                  </Text>
                ),
              },
              {
                property: 'value',
                render: (v) => <Text size="xsmall">{`${v}%`}</Text>,
              },
            ]}
            chart={[
              {
                property: 'value',
                type: 'line',
                // borderSize.small (2px) — Chart thickness only maps edgeSize
                thickness: hpe.global.borderSize.small,
                round: true,
                color: 'graph-0',
              },
            ]}
            axis={{
              x: { property: 'day', granularity: 'medium' },
              y: { property: 'value', granularity: 'fine' },
            }}
            guide={{ y: { granularity: 'fine' } }}
            size={{ width: 'fill', height: '200px' }}
            detail
          />
        ) : (
          <List data={account.loginActivity} pad="none">
            {(d, index) => (
              <ListRow index={index} count={account.loginActivity.length}>
                <Text>{30 - d.day} days ago</Text>
                <Text weight={500}>{d.value}%</Text>
              </ListRow>
            )}
          </List>
        )}
        <Text size="xsmall" color="text-weak">
          Counts are platform access events from customer users history and may
          not correspond one-to-one with authentication sign-ins.
        </Text>
      </Card>

      <Box gap="small">
        <SectionHeader
          title="Most active users"
          subtitle={`${account.mostActiveUsers.filter((u) => u.tier !== 'Inactive').length} of ${account.userCount} account users are Power User or Active · Feature export: 2026-10-19.`}
        />
        {account.mostActiveUsers.length ? (
          <Box overflow="auto">
            <Table
              columns={[
                {
                  property: 'handle',
                  header: 'Users (masked)',
                  primary: true,
                  render: (u) => <Text weight={500}>{u.handle}</Text>,
                },
                {
                  property: 'roles',
                  header: 'Role',
                  render: (u) => (
                    <Box>
                      <Text>{u.roles[0]}:</Text>
                      <Text size="small" color="text-weak" truncate>
                        {u.roles[1]}:…
                      </Text>
                      <Anchor
                        size="small"
                        label={`Show more (${u.moreRoles})`}
                        href="#"
                      />
                    </Box>
                  ),
                },
                { property: 'mfa', header: 'MFA' },
                {
                  property: 'tier',
                  header: 'Engagement tier',
                  render: (u) => (
                    <TierTag
                      tier={
                        u.tier === 'Inactive'
                          ? 'At risk'
                          : u.tier === 'At-risk'
                            ? 'Neutral'
                            : 'Healthy'
                      }
                    />
                  ),
                },
                { property: 'anomaly', header: 'Login anomaly' },
              ]}
              data={account.mostActiveUsers}
            />
          </Box>
        ) : (
          <EmptyState
            level={4}
            icon={<Analytics />}
            title="No scored users"
            description="Users with login, role or workspace signals will be scored here."
          />
        )}
      </Box>
    </Box>
  );
};

// --------------------------------------------------------------- Adoption
const Adoption = ({ account }) => {
  const [period, setPeriod] = usePeriod();
  const totalGaps = account.adoptionChecks.reduce(
    (n, c) => n + (c.gaps || 0),
    0,
  );
  return (
    <Box gap="medium">
      <Grid columns={{ count: 'fit', size: ['large', 'flex'] }} gap="small">
        <Card title="Adoption checks">
          {totalGaps > 0 && (
            <Box
              background="validation-critical"
              pad={{ horizontal: 'small', vertical: 'xsmall' }}
              round="xsmall"
              direction="row"
              align="center"
              gap="xsmall"
            >
              <StatusCritical
                color="status-critical"
                size="small"
                aria-hidden
              />
              <Text weight={500}>Low adoption score</Text>
            </Box>
          )}
          <List data={account.adoptionChecks} pad="none">
            {(c, index) => (
              <ListRow index={index} count={account.adoptionChecks.length}>
                <Box>
                  <Anchor label={c.name} href="#" />
                  <Text size="small" color="text-weak">
                    {c.result}
                  </Text>
                </Box>
                <ListStatus>
                  {c.gaps == null ? (
                    <StatusText severity="na">Not applicable</StatusText>
                  ) : c.gaps === 0 ? (
                    <StatusText severity="ok">Complete</StatusText>
                  ) : (
                    <StatusText severity="critical">{`${c.gaps} gap${c.gaps > 1 ? 's' : ''} to close`}</StatusText>
                  )}
                </ListStatus>
              </ListRow>
            )}
          </List>
        </Card>
        <Card title="Provisioned apps">
          <List data={account.provisionedApps} pad="none">
            {(app, index) => (
              <ListRow index={index} count={account.provisionedApps.length}>
                <Box>
                  <ListPrimary>{app.name}</ListPrimary>
                  <Text size="small" color="text-weak">
                    {app.description}
                  </Text>
                </Box>
                <Button
                  icon={<LinkNext />}
                  a11yTitle={`Open ${app.name}`}
                  onClick={() => {}}
                />
              </ListRow>
            )}
          </List>
        </Card>
      </Grid>

      <Box gap="small">
        <SectionHeader
          title="Service launches"
          subtitle="Scored monthly · May – Oct 2026"
          action={<PeriodToggle value={period} onChange={setPeriod} />}
        />
        <DataChart
          data={account.serviceLaunches}
          series={[
            { property: 'month' },
            ...SERVICES.map((s) => ({ property: s.key, label: s.label })),
          ]}
          chart={[
            {
              property: SERVICES.map((s) => ({
                property: s.key,
                color: s.color,
              })),
              type: 'bars',
              thickness: 'medium',
              round: true,
            },
          ]}
          axis={{
            x: { property: 'month', granularity: 'fine' },
            y: { granularity: 'medium' },
          }}
          guide={{ y: { granularity: 'medium' } }}
          size={{ width: 'fill', height: 'small' }}
          legend={false}
        />
        <Legend
          items={SERVICES.map((s) => ({ ...s, value: '20% (20 TiB)' }))}
        />
      </Box>

      <Box gap="small">
        <SectionHeader title="Amplitude app engagement" />
        <Table
          columns={[
            {
              property: 'handle',
              header: 'Users (masked)',
              primary: true,
              render: (u) => <Text weight={500}>{u.handle}</Text>,
            },
            { property: 'app', header: 'App' },
            { property: 'clicks', header: 'Clicks', align: 'end' },
            { property: 'days', header: 'Days clicked / 30', align: 'end' },
          ]}
          data={account.amplitude}
        />
      </Box>
    </Box>
  );
};

// ---------------------------------------------------------- Configuration
const Configuration = ({ account }) => (
  <List data={account.configChecks} pad="none">
    {(c, index) => (
      <ListRow index={index} count={account.configChecks.length}>
        <Box>
          <ListPrimary>{c.name}</ListPrimary>
          <Text size="small" color="text-weak">
            {c.description}
          </Text>
        </Box>
        <ListStatus>
          <StatusText severity={c.severity}>{c.status}</StatusText>
        </ListStatus>
      </ListRow>
    )}
  </List>
);

// ---------------------------------------------------------- Subscriptions
const Subscriptions = ({ account }) => (
  <Box overflow="auto">
    <Table
      columns={[
        {
          property: 'name',
          header: 'Subscription',
          primary: true,
          render: (s) => <Text weight={500}>{s.name}</Text>,
        },
        { property: 'productType', header: 'Product type' },
        { property: 'evaluation', header: 'Evaluation' },
        { property: 'quantity', header: 'Quantity', align: 'end' },
        { property: 'endDate', header: 'End date' },
        { property: 'status', header: 'Status' },
      ]}
      data={account.subscriptions}
    />
  </Box>
);

// E · Detail body — same five facets as the Figma detail pages.
export const CockpitDetail = ({ account }) => {
  const [tab, setTab] = useDetailTab();
  return (
    <Box>
      <DetailHeader account={account} />
      <DetailTabs activeIndex={tab} onActive={setTab}>
        <Tab title="Overview">
          <Section title="Overview" hideTitle>
            <Summary account={account} />
          </Section>
        </Tab>
        <Tab title="User engagement">
          <Section title="User engagement" hideTitle>
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
      </DetailTabs>
    </Box>
  );
};
