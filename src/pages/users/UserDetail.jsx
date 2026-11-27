import { useState } from 'react';
import { useDetailTab } from '../../shell/ShellContext';
import {
  Anchor,
  Box,
  Button,
  Heading,
  List,
  Menu,
  NameValueList,
  NameValuePair,
  Tab,
  Text,
  TextInput,
} from 'grommet';
import {
  Checkmark,
  Close,
  Group,
  More,
  Organization,
  ShieldCheck,
  StatusCritical,
  StatusGood,
  StatusInfo,
  Trash,
} from '@hpe-design/icons-grommet';
import { EmptyState } from '../../components/EmptyState';
import {
  ListRow,
  Section,
  usePairDirection,
  DetailTabs,
} from '../../pattern/detail';

// HPE DS status indicator template: semantic icon + visible label.
// https://design-system.hpe.design/templates/status-indicator
const STATUS_MAP = {
  Active: { Icon: StatusGood, color: 'status-ok' },
  Invited: { Icon: StatusInfo, color: 'text-weak' },
  Suspended: { Icon: StatusCritical, color: 'status-critical' },
  Deactivated: { Icon: StatusCritical, color: 'status-critical' },
};

export const StatusIndicator = ({ status, size }) => {
  const { Icon, color } = STATUS_MAP[status] ?? STATUS_MAP.Invited;
  return (
    <Box direction="row" align="center" gap="3xsmall" flex={false}>
      <Icon color={color} size="xsmall" aria-hidden />
      <Text size={size}>{status}</Text>
    </Box>
  );
};

// D · Detail header — identity, inline rename, status, sub-tabs
const DetailHeader = ({ user, name, onRename }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const commit = () => {
    if (draft.trim()) onRename(draft.trim());
    setEditing(false);
  };

  return (
    <Box flex={false} gap="small">
      <Box gap="xsmall">
        <Box direction="row" align="center" gap="small" wrap>
          {editing ? (
            <Box direction="row" align="center" gap="xsmall">
              <TextInput
                size="large"
                value={draft}
                autoFocus
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commit();
                  if (e.key === 'Escape') setEditing(false);
                }}
              />
              <Button
                icon={<Checkmark />}
                onClick={commit}
                a11yTitle="Save name"
              />
              <Button
                icon={<Close />}
                onClick={() => setEditing(false)}
                a11yTitle="Cancel"
              />
            </Box>
          ) : (
            <Heading level={2} margin="none">
              {name}
            </Heading>
          )}
          <Box flex />
          {!editing && (
            <Menu
              label="Actions"
              dropProps={{ align: { top: 'bottom', right: 'right' } }}
              items={[
                [
                  {
                    label: 'Edit name',
                    onClick: () => {
                      setDraft(name);
                      setEditing(true);
                    },
                  },
                  { label: 'Change role' },
                  { label: 'Reset password' },
                  { label: 'Resend invite' },
                ],
                [
                  {
                    label:
                      user.status === 'Suspended' ? 'Reactivate' : 'Suspend',
                  },
                ],
                [{ label: 'Remove user' }],
              ]}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Details are broken into titled groups, each its own NameValueList,
// separated by a weak divider so the page doesn't read as one long list.
// `optional` groups are dropped for the short variant.
const DETAIL_GROUPS = [
  {
    title: 'Identity',
    pairs: [
      ['First name', 'firstName'],
      ['Last name', 'lastName'],
      ['Email', 'email'],
      ['ID', 'userId'],
      ['Principal ID', 'principalId'],
    ],
  },
  {
    title: 'Account',
    pairs: [
      ['Status', 'status'],
      ['Verified', 'verified'],
      ['Authorization source', 'authorizationSource'],
      ['Lifecycle source', 'lifecycleSource'],
    ],
  },
  {
    title: 'Membership & activity',
    optional: true,
    pairs: [
      ['Joined organization', 'joinedOrganization'],
      ['Joined this workspace', 'joinedWorkspace'],
      ['Last launch of this workspace', 'lastLaunch'],
      ['Last sign in', 'lastSignIn'],
    ],
  },
];

const DetailValue = ({ field, user }) =>
  field === 'status' ? (
    <StatusIndicator status={user.status} />
  ) : (
    <Text>{user[field]}</Text>
  );

// Team variant: a generic team-access page with its own vocabulary
// (profile, access, permissions, teams, projects).
const TEAM_GROUPS = [
  {
    title: 'Profile',
    pairs: [
      ['Full name', 'name'],
      ['Username', 'username'],
      ['Email', 'email'],
      ['Job title', 'role'],
      ['Member since', 'memberSince'],
    ],
  },
  {
    title: 'Access',
    pairs: [
      ['Status', 'status'],
      ['Sign-in method', 'signIn'],
      ['Two-step verification', 'mfa'],
      ['Invited by', 'invitedBy'],
    ],
  },
];

const TEAM_TABS = [
  {
    title: 'Permissions',
    icon: <ShieldCheck />,
    emptyTitle: 'No permissions granted yet',
    emptyDescription:
      'What this member can see and change will be listed here once a permission set is applied.',
    render: (user) => <Permissions user={user} />,
    cta: 'Grant permissions',
  },
  {
    title: 'Teams',
    icon: <Group />,
    emptyTitle: 'Not on any teams',
    emptyDescription:
      'Teams share permissions and notifications. Add this member to a team to get started.',
    render: (user) => <Teams user={user} />,
    cta: 'Add to a team',
  },
  {
    title: 'Projects',
    icon: <Organization />,
    emptyTitle: 'No projects assigned',
    emptyDescription:
      'Projects this member contributes to will be listed here.',
    render: (user) => <Projects user={user} />,
  },
];

const LEVEL_SEVERITY = { Manage: 'ok', Edit: 'ok', Run: 'ok', View: 'info' };
const PROJECT_STATE = { Active: 'ok', Planning: 'info', 'On hold': 'warn' };

const PlainList = ({ rows, children }) => (
  <List data={rows} pad="none" border={false}>
    {(row, index) => (
      <ListRow index={index} count={rows.length}>
        {children(row)}
      </ListRow>
    )}
  </List>
);

const Permissions = ({ user }) => (
  <PlainList rows={user.permissions}>
    {(p) => (
      <>
        <Text weight={500}>{p.area}</Text>
        <Text color="text-weak">{p.level}</Text>
      </>
    )}
  </PlainList>
);

const Teams = ({ user }) => (
  <PlainList rows={user.teams}>
    {(t) => (
      <>
        <Anchor label={t.name} href="#" weight={500} />
        <Text color="text-weak">
          {t.members} {t.members === 1 ? 'member' : 'members'}
        </Text>
      </>
    )}
  </PlainList>
);

const Projects = ({ user }) => (
  <PlainList rows={user.projects}>
    {(p) => (
      <>
        <Box>
          <Anchor label={p.name} href="#" weight={500} />
          <Text size="small" color="text-weak">
            {p.role}
          </Text>
        </Box>
        <Text color="text-weak">{p.state}</Text>
      </>
    )}
  </PlainList>
);

const Properties = ({ user, groups = DETAIL_GROUPS }) => {
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
          {/* HPE heading `size` is a token scale independent of level
              (small 18px is the h4 default → medium 22px). One step up so
              groups read distinctly from the 16px name/value pairs below. */}
          <Heading level={4} size="medium" margin="none">
            {group.title}
          </Heading>
          <NameValueList
            pairProps={{ direction }}
            nameProps={{ width: 'small' }}
          >
            {group.pairs.map(([label, field]) => (
              <NameValuePair key={field} name={label}>
                <DetailValue field={field} user={user} />
              </NameValuePair>
            ))}
          </NameValueList>
        </Box>
      ))}
    </Box>
  );
};

const RoleAssignments = ({ user }) => {
  const rows = user.roleAssignments;
  return rows.length ? (
    <List data={rows} pad="none">
      {(r, index) => (
        <ListRow index={index} count={rows.length}>
          <Box>
            <Anchor label={r.role} weight={500} href="#" />
            <Text size="small" color="text-weak">
              {r.service} · {r.scope} ·{' '}
              {r.source === 'Direct' ? 'Direct' : `Via ${r.source}`}
            </Text>
          </Box>
          {/* Right edge is reserved for actions only; metadata such as the
              assignment source lives in the supplementary text. */}
          <Menu
            icon={<More />}
            a11yTitle={`Actions for ${r.role}`}
            dropProps={{ align: { top: 'bottom', right: 'right' } }}
            items={[
              { label: 'Edit', onClick: () => {} },
              {
                label: 'Remove',
                disabled: r.source !== 'Direct',
                onClick: () => {},
              },
            ]}
          />
        </ListRow>
      )}
    </List>
  ) : (
    <EmptyState
      level={4}
      icon={<ShieldCheck />}
      title="No role assignments"
      description="Roles granted to this user, directly or through a group, will be listed here."
      actions={<Button label="Assign roles" primary />}
    />
  );
};

const Groups = ({ user }) =>
  user.groups.length ? (
    <List data={user.groups} pad="none">
      {(group, index) => (
        <ListRow index={index} count={user.groups.length}>
          <Box>
            <Anchor label={group.name} weight={500} href="#" />
            <Text size="small" color="text-weak">
              Lifecycle source: {group.lifecycleSource} · {group.members}{' '}
              {group.members === 1 ? 'member' : 'members'}
            </Text>
          </Box>
          <Button
            icon={<Trash />}
            a11yTitle={`Remove from ${group.name}`}
            onClick={() => {}}
          />
        </ListRow>
      )}
    </List>
  ) : (
    <EmptyState
      level={4}
      icon={<Group />}
      title="Not a member of any user groups"
      description="Groups this user belongs to will be listed here."
      actions={<Button label="Add to user groups" primary />}
    />
  );

const OrgWorkspaces = ({ user }) =>
  user.orgWorkspaces.length ? (
    <List data={user.orgWorkspaces} pad="none">
      {(w, index) => (
        <ListRow index={index} count={user.orgWorkspaces.length}>
          <Box>
            <Anchor label={w.name} weight={500} href="#" />
            <Text size="small" color="text-weak">
              {w.role}
            </Text>
          </Box>
        </ListRow>
      )}
    </List>
  ) : (
    <EmptyState
      level={4}
      icon={<Organization />}
      title="No organization workspace membership"
      description="Workspaces in the organization that this user can access will be listed here."
    />
  );

// E · Detail body — Tabs own their panels so each tabpanel is labelled by its
// tab; a visually hidden h3 keeps every panel in the heading outline.
// Tabs never wrap: Grommet's Tabs detects overflow and swaps to a scrolling
// tablist with previous/next arrows (Anatomy › Responsive › Detail tabs).
// Grommet's overflow check (scrollWidth > offsetWidth) misfires on fractional
// widths, so the page keeps the grid columns in whole px (see listDetail.js).
const DetailBody = ({ user, tab, setTab, groups = DETAIL_GROUPS }) => (
  <DetailTabs activeIndex={tab} onActive={setTab}>
    <Tab title="Overview">
      <Section title="Overview" hideTitle>
        <Properties user={user} groups={groups} />
      </Section>
    </Tab>
    <Tab title="Role assignments">
      <Section
        title="Role assignments"
        hideTitle
        action={
          user.roleAssignments.length > 0 && (
            <Button label="Assign roles" secondary />
          )
        }
      >
        <RoleAssignments user={user} />
      </Section>
    </Tab>
    <Tab title="User group membership">
      <Section
        title="User group membership"
        hideTitle
        action={
          user.groups.length > 0 && (
            <Button label="Add to user groups" secondary />
          )
        }
      >
        <Groups user={user} />
      </Section>
    </Tab>
    <Tab title="Organization workspace membership">
      <Section title="Organization workspace membership" hideTitle>
        <OrgWorkspaces user={user} />
      </Section>
    </Tab>
  </DetailTabs>
);

const TEAM_DATA = { Permissions: 'permissions', Teams: 'teams', Projects: 'projects' };

const TeamBody = ({ user, tab, setTab }) => (
  <DetailTabs activeIndex={tab} onActive={setTab}>
    <Tab title="Overview">
      <Section title="Overview" hideTitle>
        <Properties user={user} groups={TEAM_GROUPS} />
      </Section>
    </Tab>
    {TEAM_TABS.map((t) => {
      const rows = user[TEAM_DATA[t.title]] ?? [];
      return (
        <Tab key={t.title} title={t.title}>
          <Section
            title={t.title}
            hideTitle
            action={rows.length > 0 && t.cta && <Button label={t.cta} secondary />}
          >
            {rows.length ? (
              t.render(user)
            ) : (
              <EmptyState
                level={4}
                icon={t.icon}
                title={t.emptyTitle}
                description={t.emptyDescription}
                actions={t.cta && <Button label={t.cta} primary />}
              />
            )}
          </Section>
        </Tab>
      );
    })}
  </DetailTabs>
);

// variant="short": a record with one facet — no tabs, identity only.
// variant="team": tabs kept, with its own profile/access groups; invited
// members show empty states in the other tabs.
export const UserDetail = ({ user, variant = 'full' }) => {
  const [name, setName] = useState(user.name);
  const [tab, setTab] = useDetailTab();
  return (
    <Box>
      <DetailHeader user={user} name={name} onRename={setName} />
      {variant === 'short' ? (
        <Section title="Overview" hideTitle>
          <Properties user={user} groups={DETAIL_GROUPS.slice(0, 1)} />
        </Section>
      ) : variant === 'team' ? (
        <TeamBody user={user} tab={tab} setTab={setTab} />
      ) : (
        <DetailBody user={user} tab={tab} setTab={setTab} />
      )}
    </Box>
  );
};
