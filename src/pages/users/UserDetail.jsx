import { useState } from 'react';
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
  Edit,
  Key,
  More,
  Trash,
} from '@hpe-design/icons-grommet';

const statusColor = {
  Active: 'status-ok',
  Invited: 'status-unknown',
  Suspended: 'status-critical',
};

const StatusTag = ({ status }) => (
  <Box direction="row" align="center" gap="xsmall">
    <Box
      width="10px"
      height="10px"
      round="full"
      background={statusColor[status] ?? 'status-unknown'}
    />
    <Text size="small">{status}</Text>
  </Box>
);

// D · Detail header — identity, inline rename, status, sub-tabs
const DetailHeader = ({ user, name, onRename, tab, setTab }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const commit = () => {
    if (draft.trim()) onRename(draft.trim());
    setEditing(false);
  };

  return (
    <Box
      pad={{ horizontal: 'medium', top: 'small' }}
      flex={false}
      gap="small"
    >
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
              <Button icon={<Checkmark />} onClick={commit} a11yTitle="Save name" />
              <Button
                icon={<Close />}
                onClick={() => setEditing(false)}
                a11yTitle="Cancel"
              />
            </Box>
          ) : (
            <Heading level={2} size="small" margin="none">
              {name}
            </Heading>
          )}
          <Box flex />
          {!editing && (
            <Button
              label="Edit"
              icon={<Edit />}
              secondary
              onClick={() => {
                setDraft(name);
                setEditing(true);
              }}
            />
          )}
        </Box>
      </Box>
      <Tabs activeIndex={tab} onActive={setTab} justify="start">
        <Tab title="Overview" />
        <Tab title="Roles & groups" />
        <Tab title="Activity" />
      </Tabs>
    </Box>
  );
};

const Section = ({ title, action, contained, children }) => (
  <Box
    gap="small"
    flex={false}
    pad={contained ? 'medium' : undefined}
    round={contained ? 'medium' : undefined}
    background={contained ? 'background-contrast' : undefined}
  >
    {(title || action) && (
      <Box direction="row" align="center" justify="between">
        <Heading level={3} size="xsmall" margin="none">
          {title}
        </Heading>
        {action}
      </Box>
    )}
    {children}
  </Box>
);

const Properties = ({ user }) => (
  <NameValueList nameProps={{ width: 'small' }}>
    <NameValuePair name="Email">
      <Text>{user.email}</Text>
    </NameValuePair>
    <NameValuePair name="Role">
      <Box align="start">
        <Tag value={user.role} size="small" />
      </Box>
    </NameValuePair>
    <NameValuePair name="Status">
      <StatusTag status={user.status} />
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
);

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

// E · Detail body — properties → related entities → activity
const DetailBody = ({ user, tab }) => (
  <Box pad="medium" gap="large" overflow="auto" flex>
    {tab === 0 && (
      <>
        <Section title="Details" contained>
          <Properties user={user} />
        </Section>
        <Section
          title="Roles & groups"
          action={<Button label="Assign" size="small" />}
        >
          <Groups user={user} />
        </Section>
        <Section title="Recent activity">
          <Activity user={user} />
        </Section>
      </>
    )}
    {tab === 1 && (
      <Section
        title="Roles & groups"
        action={<Button label="Assign" size="small" />}
      >
        <Groups user={user} />
      </Section>
    )}
    {tab === 2 && (
      <Section title="Activity">
        <Activity user={user} />
      </Section>
    )}
  </Box>
);

// F · Sticky footer — destructive leftmost, item-level actions, updated-at right
const DetailFooter = ({ user }) => (
  <Box
    direction="row"
    align="center"
    justify="between"
    gap="small"
    wrap
    pad={{ horizontal: 'medium', vertical: 'small' }}
    border={{ side: 'top', color: 'border-weak' }}
    flex={false}
  >
    <Box direction="row" gap="xsmall" wrap>
      <Button label="Remove user" icon={<Trash />} kind="toolbar" />
      <Button label="Reset password" icon={<Key />} kind="toolbar" />
      <Button
        label={user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
        kind="toolbar"
      />
    </Box>
    <Text size="small" color="text-weak" style={{ whiteSpace: 'nowrap' }}>
      Last active {user.lastActive.toLowerCase()}
    </Text>
  </Box>
);

export const UserDetail = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [tab, setTab] = useState(0);
  return (
    <Box flex overflow="hidden">
      <DetailHeader
        user={user}
        name={name}
        onRename={setName}
        tab={tab}
        setTab={setTab}
      />
      <DetailBody user={user} tab={tab} />
      <DetailFooter user={user} />
    </Box>
  );
};
