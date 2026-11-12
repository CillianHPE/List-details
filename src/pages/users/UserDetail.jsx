import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  List,
  Menu,
  NameValueList,
  NameValuePair,
  Tab,
  Tabs,
  Tag,
  Text,
  TextInput,
} from 'grommet';
import {
  Checkmark,
  Close,
  More,
  StatusCritical,
  StatusGood,
  StatusInfo,
} from '@hpe-design/icons-grommet';

// HPE DS status indicator template: semantic icon + visible label.
// https://design-system.hpe.design/templates/status-indicator
const STATUS_MAP = {
  Active: { Icon: StatusGood, color: 'status-ok' },
  Invited: { Icon: StatusInfo, color: 'text-weak' },
  Suspended: { Icon: StatusCritical, color: 'status-critical' },
};

const StatusIndicator = ({ status }) => {
  const { Icon, color } = STATUS_MAP[status] ?? STATUS_MAP.Invited;
  return (
    <Box direction="row" align="center" gap="3xsmall">
      <Icon color={color} size="xsmall" aria-hidden />
      <Text>{status}</Text>
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

// Keeps a heading in the document outline without rendering it visibly
const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const Section = ({ title, hideTitle, action, contained, children }) => (
  <Box
    gap="small"
    flex={false}
    margin={{ top: 'medium' }}
    pad={contained ? 'medium' : undefined}
    round={contained ? 'medium' : undefined}
    background={contained ? 'background-contrast' : undefined}
  >
    {hideTitle && (
      <Heading level={3} margin="none" style={visuallyHidden}>
        {title}
      </Heading>
    )}
    {((title && !hideTitle) || action) && (
      <Box
        direction="row"
        align="center"
        justify={hideTitle ? 'end' : 'between'}
      >
        {!hideTitle && (
          <Heading level={3} size="xsmall" margin="none">
            {title}
          </Heading>
        )}
        {action}
      </Box>
    )}
    {children}
  </Box>
);

// Horizontal name/value pairs; stack vertically once the container is too
// narrow to hold the name column plus a reasonable value column.
const PAIR_ROW_MIN_WIDTH = 480;

const Properties = ({ user }) => {
  const ref = useRef(null);
  const [direction, setDirection] = useState('row');
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) =>
      setDirection(
        entry.contentRect.width < PAIR_ROW_MIN_WIDTH ? 'column' : 'row',
      ),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <Box ref={ref}>
      <NameValueList pairProps={{ direction }} nameProps={{ width: 'small' }}>
        <NameValuePair name="Email">
          <Text>{user.email}</Text>
        </NameValuePair>
        <NameValuePair name="Role">
          <Box align="start">
            <Tag value={user.role} size="small" />
          </Box>
        </NameValuePair>
        <NameValuePair name="Status">
          <StatusIndicator status={user.status} />
        </NameValuePair>
        <NameValuePair name="Multi-factor auth">
          <Text>{user.mfa}</Text>
        </NameValuePair>
        <NameValuePair name="Created">
          <Text>{user.created}</Text>
        </NameValuePair>
        <NameValuePair name="Last active">
          <Text>{user.lastActive}</Text>
        </NameValuePair>
      </NameValueList>
    </Box>
  );
};

const Groups = ({ user }) =>
  user.groups.length ? (
    <List data={user.groups} pad="none">
      {(group, index) => (
        <Box
          direction="row"
          align="center"
          justify="between"
          gap="small"
          pad={{ vertical: 'small' }}
          border={
            index < user.groups.length - 1
              ? { side: 'bottom', color: 'border-weak' }
              : false
          }
        >
          <Box>
            <Text weight={500}>{group.name}</Text>
            <Text size="small" color="text-weak">
              {group.type} · {group.members}{' '}
              {group.members === 1 ? 'member' : 'members'}
            </Text>
          </Box>
          <Box direction="row" align="center" gap="small">
            <Menu
              icon={<More />}
              a11yTitle={`Actions for ${group.name}`}
              dropProps={{ align: { top: 'bottom', right: 'right' } }}
              items={[
                { label: 'View group', onClick: () => {} },
                { label: 'Change role', onClick: () => {} },
                { label: 'Remove from group', onClick: () => {} },
              ]}
            />
          </Box>
        </Box>
      )}
    </List>
  ) : (
    <Box
      pad="medium"
      align="center"
      border={{ color: 'border-weak', style: 'dashed' }}
      round="xsmall"
    >
      <Text color="text-weak">No groups assigned</Text>
    </Box>
  );

const Activity = ({ user }) => (
  <List data={user.activity} pad="none">
    {(a, index) => (
      <Box
        direction="row"
        align="start"
        justify="between"
        gap="small"
        pad={{ vertical: 'small' }}
        border={
          index < user.activity.length - 1
            ? { side: 'bottom', color: 'border-weak' }
            : false
        }
      >
        <Text>{a.what}</Text>
        <Text size="xsmall" color="text-weak" flex={false}>
          {a.when}
        </Text>
      </Box>
    )}
  </List>
);

// E · Detail body — Tabs own their panels so each tabpanel is labelled by its
// tab; a visually hidden h3 keeps every panel in the heading outline.
const DetailBody = ({ user, tab, setTab }) => (
  <Tabs
    activeIndex={tab}
    onActive={setTab}
    justify="start"
    flex={false}
    margin={{ top: 'small' }}
  >
    <Tab title="Details">
      <Section title="Details" hideTitle>
        <Properties user={user} />
      </Section>
    </Tab>
    <Tab title="Roles & groups">
      <Section
        title="Roles & groups"
        hideTitle
        action={<Button label="Assign" size="small" />}
      >
        <Groups user={user} />
      </Section>
    </Tab>
    <Tab title="Activity">
      <Section title="Activity" hideTitle>
        <Activity user={user} />
      </Section>
    </Tab>
  </Tabs>
);

export const UserDetail = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [tab, setTab] = useState(0);
  return (
    <Box>
      <DetailHeader user={user} name={name} onRename={setName} />
      <DetailBody user={user} tab={tab} setTab={setTab} />
    </Box>
  );
};
