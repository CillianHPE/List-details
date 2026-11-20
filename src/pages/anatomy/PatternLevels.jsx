import { Checkmark, Close } from '@hpe-design/icons-grommet';
import { Box, Grid, Heading, Text } from 'grommet';
import { Card } from '../../pattern/detail';
import { Frame, Ghost } from './primitives';

// Pattern pages: the plain-language "what" and "when" of list–detail,
// written from the job to be done rather than from the anatomy.

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
// Lo-fi mocks. Fixed height so they line up in a grid.

const MOCK_HEIGHT = '180px';

const MockShell = ({ children, ...rest }) => (
  <Frame height={MOCK_HEIGHT} pad="xsmall" gap="xsmall" {...rest}>
    <Box direction="row" gap="xsmall" align="center" flex={false}>
      <Ghost width="18px" height="18px" round="full" />
      <Ghost width="40%" height="8px" />
    </Box>
    {children}
  </Frame>
);

const MockDetail = ({ tabs = true }) => (
  <Box flex gap="xsmall" pad={{ left: 'xsmall' }}>
    <Ghost width="55%" height="12px" />
    {tabs && (
      <Box direction="row" gap="xsmall">
        <Ghost width="36px" height="6px" background="brand" />
        <Ghost width="36px" height="6px" />
        <Ghost width="36px" height="6px" />
      </Box>
    )}
    <Box gap="xxsmall" flex>
      <Ghost width="90%" height="6px" />
      <Ghost width="75%" height="6px" />
      <Ghost width="85%" height="6px" />
      <Ghost width="60%" height="6px" />
    </Box>
  </Box>
);

// Many records on the left, the selected 1 in full on the right.
export const MockListDetail = ({ selected = 1, highlightRows }) => (
  <MockShell>
    <Box direction="row" gap="xsmall" flex>
      <Box width="42%" gap="xxsmall" flex={false}>
        {Array.from({ length: 5 }, (_, i) => (
          <Box
            key={i}
            direction="row"
            gap="xxsmall"
            align="center"
            pad="xxsmall"
            round="xsmall"
            background={i === selected ? 'background-contrast' : undefined}
          >
            {highlightRows && (
              <Ghost
                width="6px"
                height="6px"
                round="full"
                background={
                  highlightRows.includes(i) ? 'status-critical' : 'status-ok'
                }
              />
            )}
            <Ghost width="60%" height="6px" />
          </Box>
        ))}
      </Box>
      <MockDetail />
    </Box>
  </MockShell>
);

// A single record owning the whole page.
export const MockFullPage = ({ steps }) => (
  <MockShell>
    <Box gap="xsmall" flex>
      <Ghost width="45%" height="12px" />
      {steps ? (
        <Box direction="row" gap="xsmall" align="center">
          {[0, 1, 2, 3].map((i) => (
            <Ghost
              key={i}
              width="18px"
              height="18px"
              round="full"
              background={i === 0 ? 'brand' : undefined}
            />
          ))}
        </Box>
      ) : (
        <Box direction="row" gap="xsmall">
          <Ghost width="36px" height="6px" background="brand" />
          <Ghost width="36px" height="6px" />
          <Ghost width="36px" height="6px" />
        </Box>
      )}
      <Grid columns={['1fr', '1fr']} gap="xsmall" flex>
        <Box gap="xxsmall">
          <Ghost height="6px" />
          <Ghost width="80%" height="6px" />
          <Ghost width="90%" height="6px" />
        </Box>
        <Box gap="xxsmall">
          <Ghost height="6px" />
          <Ghost width="70%" height="6px" />
        </Box>
      </Grid>
      {steps && (
        <Box direction="row" justify="end">
          <Ghost width="40px" height="12px" background="brand" />
        </Box>
      )}
    </Box>
  </MockShell>
);

// Rows and columns, nothing selected.
export const MockTable = () => (
  <MockShell>
    <Box gap="xxsmall" flex>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} direction="row" gap="xsmall" pad={{ vertical: '2px' }}>
          <Ghost width="30%" height="6px" />
          <Ghost width="15%" height="6px" />
          <Ghost width="20%" height="6px" />
          <Ghost width="15%" height="6px" />
          <Ghost width="10%" height="6px" />
        </Box>
      ))}
    </Box>
  </MockShell>
);

// A handful of fields; no set to move through.
export const MockForm = () => (
  <MockShell>
    <Box gap="xsmall" flex>
      <Ghost width="40%" height="12px" />
      {[0, 1, 2].map((i) => (
        <Box key={i} gap="2px">
          <Ghost width="25%" height="5px" />
          <Ghost height="14px" background="background-front" />
        </Box>
      ))}
    </Box>
  </MockShell>
);

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

export const PatternWhatLevel = () => (
  <Box gap="large">
    <Lead>
      A list–detail page shows many records on 1 side and the selected record in
      full on the other. You move through the set without ever leaving the page.
    </Lead>

    <Grid columns={{ count: 'fit', size: ['medium', 'flex'] }} gap="medium">
      <Box gap="small">
        <SectionHeading>The job to be done</SectionHeading>
        <Card title="When I am working through a set of records…">
          <Text>
            …I want to see each one in full without losing my place in the set,
            so I can review, compare or act on many of them quickly.
          </Text>
        </Card>
      </Box>
      <Box gap="small">
        <SectionHeading>At a glance</SectionHeading>
        <MockListDetail />
      </Box>
    </Grid>

    <Box gap="small">
      <SectionHeading>How it does that job</SectionHeading>
      <Grid columns={{ count: 'fit', size: ['medium', 'flex'] }} gap="small">
        {JOB.map(([title, body]) => (
          <Card key={title} title={title}>
            <Text>{body}</Text>
          </Card>
        ))}
      </Grid>
    </Box>

    <Box gap="small">
      <SectionHeading>What it is not</SectionHeading>
      <Bullets items={NOT} />
    </Box>

    <Card title="The 1-line test">
      <Text>
        If the job is about <Text weight={500}>many records</Text>, use
        list–detail. If the job is about <Text weight={500}>1 record</Text>,
        give it its own page.
      </Text>
    </Card>
  </Box>
);

// ---------------------------------------------------------------------------
// Page 2: When to use it

const USE = [
  {
    title: 'Gather',
    when: 'I need to read a set of records 1 by 1 and build a picture.',
    eg: 'Reviewing every new user, reading through open tickets.',
    mock: <MockListDetail />,
  },
  {
    title: 'Compare',
    when: 'I need to flip between similar records to spot the difference.',
    eg: 'Two servers with the same alert, accounts in the same region.',
    mock: <MockListDetail selected={2} />,
  },
  {
    title: 'Triage',
    when: 'I need to scan for the few that need attention, then act on each.',
    eg: 'Resources in a critical state, overdue renewals.',
    mock: <MockListDetail selected={0} highlightRows={[0, 3]} />,
  },
  {
    title: 'Quick edit',
    when: 'I need to change 1 or 2 fields across a lot of records.',
    eg: 'Assigning owners, fixing tags, toggling access.',
    mock: <MockListDetail selected={3} />,
  },
];

const AVOID = [
  {
    title: 'Deep work on 1 record',
    when: 'The task is a multi-step configure or create flow.',
    instead: 'A dedicated page or wizard. The list would only steal width.',
    mock: <MockFullPage steps />,
  },
  {
    title: 'Dense records',
    when: 'Each record is a document, a long report or a complex visualisation.',
    instead: 'A full detail page the record can own, reached from a list.',
    mock: <MockFullPage />,
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
    mock: <MockForm />,
  },
];

const Scenario = ({ title, when, note, noteLabel, mock, ok }) => (
  <Card
    title={
      <Box direction="row" gap="xsmall" align="center">
        {ok ? (
          <Checkmark size="small" color="status-ok" />
        ) : (
          <Close size="small" color="status-critical" />
        )}
        <Text weight={500}>{title}</Text>
      </Box>
    }
  >
    <Box gap="small">
      {mock}
      <Text>{when}</Text>
      <Text size="small" color="text-weak">
        <Text size="small" weight={500}>
          {noteLabel}:
        </Text>{' '}
        {note}
      </Text>
    </Box>
  </Card>
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

    <Box gap="small">
      <SectionHeading>Use it when</SectionHeading>
      <Grid columns={{ count: 'fit', size: ['medium', 'flex'] }} gap="small">
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

    <Box gap="small">
      <SectionHeading>Do not use it when</SectionHeading>
      <Grid columns={{ count: 'fit', size: ['medium', 'flex'] }} gap="small">
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
    </Box>

    <Card title="Quick check">
      <Box gap="xsmall">
        <Text color="text-weak">
          If all 4 are true, list–detail is the right call.
        </Text>
        <Bullets items={CHECK} />
      </Box>
    </Card>
  </Box>
);
