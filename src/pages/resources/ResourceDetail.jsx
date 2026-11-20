import { useDetailTab } from '../../shell/ShellContext';
import { Anchor, Box, List, Menu, Tab, Tag, Text } from 'grommet';
import { EmptyState } from '../../components/EmptyState';
import {
  Card,
  ListPrimary,
  ListRow,
  ListStatus,
  Pairs,
  Section,
  DetailHeading,
  DetailTabs,
} from '../../pattern/detail';
import { relatedResources } from '../../data/resources';
import { ALERT_STATUS, ResourceStatus } from './ResourceStatus';

// Kubernetes · OpsRamp resource. The preview's "Resource Details" card, read
// beside the list: identity in the header, alert counts directly under it,
// then the 3 facets as tabs.

// ----------------------------------------------------------------- header

// D · Detail header — name and record actions; facts live in the alerts card and Overview
const DetailHeader = ({ resource, children }) => (
  <Box flex={false} gap="small">
    <DetailHeading
      heading={resource.name}
      trailing={
        <Menu
          label="Actions"
          dropProps={{ align: { top: 'bottom', right: 'right' } }}
          items={[
            [
              { label: 'Run discovery' },
              { label: 'Open remote console' },
              { label: 'Create ticket' },
            ],
            [{ label: 'Edit custom attributes' }, { label: 'Manage traits' }],
            [{ label: 'Decommission resource' }],
          ]}
        />
      }
    />
    {children}
  </Box>
);

// Alert counts at one type scale: 5 severities side by side, each a labelled
// figure with its status icon, so the strip reads as one row of facts.
const AlertCount = ({ severity, count }) => {
  const { label, Icon, color } = ALERT_STATUS[severity];
  return (
    <Box gap="4xsmall" flex={false} width={{ min: '72px' }}>
      <Text size="small" color="text-weak">
        {label}
      </Text>
      <Box direction="row" align="center" gap="xsmall">
        <Icon color={color} size="small" aria-hidden />
        <Text size="xlarge" weight={500}>
          {count}
        </Text>
      </Box>
    </Box>
  );
};

const ResourceAlerts = ({ resource }) => {
  const total = Object.values(resource.alerts).reduce((a, b) => a + b, 0);
  return (
    <Card
      title="Resource alerts"
      note={total === 1 ? '1 open alert' : `${total} open alerts`}
      action={
        <Box direction="row" gap="medium" flex={false}>
          <Anchor
            label={`Tickets: ${resource.tickets}`}
            href="#"
            size="small"
          />
          <Anchor label={`Notes: ${resource.notes}`} href="#" size="small" />
        </Box>
      }
    >
      <Box direction="row" gap="large" wrap>
        {Object.keys(ALERT_STATUS).map((severity) => (
          <AlertCount
            key={severity}
            severity={severity}
            count={resource.alerts[severity]}
          />
        ))}
      </Box>
    </Card>
  );
};

// ----------------------------------------------------------------- facets

const Facet = ({ children }) => <Box gap="small">{children}</Box>;

const Overview = ({ resource }) => {
  const { os, ip, make, model, serial } = resource.overview;
  return (
    <Facet>
      <Card title="System">
        <Pairs
          pairs={[
            ['Operating system', os],
            ['IP address', ip],
            ['Make', make],
            ['Model', model],
            ['Serial number', serial],
          ]}
        />
      </Card>
      <Card
        title="Traits"
        note="Characteristics OpsRamp has discovered for this resource"
      >
        <Box direction="row" gap="xsmall" wrap>
          {resource.traits.map((trait) => (
            <Tag key={trait} value={trait} size="small" />
          ))}
        </Box>
      </Card>
    </Facet>
  );
};

// Single-block facets: the tab already names the content, so it sits flat
// with no container or repeated heading.
const Related = ({ resource }) => {
  const related = relatedResources(resource);
  return (
    <Facet>
      {related.length ? (
        <List data={related} pad="none" border={false} itemKey="id">
          {(r, index) => (
            <ListRow index={index} count={related.length}>
              <Box>
                <ListPrimary>{r.name}</ListPrimary>
                <Text size="small" color="text-weak">
                  {r.ip}
                </Text>
              </Box>
              <ListStatus>
                <ResourceStatus availability={r.availability} />
              </ListStatus>
            </ListRow>
          )}
        </List>
      ) : (
        <EmptyState
          level={4}
          title="No related resources"
          description="Resources discovered in the same cluster will be listed here."
        />
      )}
    </Facet>
  );
};

const CustomAttributes = ({ resource }) => (
  <Facet>
    {resource.attributes.length ? (
      <Pairs pairs={resource.attributes} />
    ) : (
      <EmptyState
        level={4}
        title="No custom attributes"
        description="Add attributes from the Actions menu to tag this resource for your organisation."
      />
    )}
  </Facet>
);

// E · Detail body
export const ResourceDetail = ({ resource }) => {
  const [tab, setTab] = useDetailTab();
  return (
    <Box>
      <DetailHeader resource={resource}>
        <ResourceAlerts resource={resource} />
      </DetailHeader>
      <DetailTabs activeIndex={tab} onActive={setTab}>
        <Tab title="Overview">
          <Section title="Overview" hideTitle>
            <Overview resource={resource} />
          </Section>
        </Tab>
        <Tab title="Related resources">
          <Section title="Related resources" hideTitle>
            <Related resource={resource} />
          </Section>
        </Tab>
        <Tab title="Custom attributes">
          <Section title="Custom attributes" hideTitle>
            <CustomAttributes resource={resource} />
          </Section>
        </Tab>
      </DetailTabs>
    </Box>
  );
};
