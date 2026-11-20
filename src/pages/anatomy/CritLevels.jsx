import { Anchor, Box, Grid, Heading, Tag, Text } from 'grommet';
import { Card } from '../../pattern/detail';

// Design crit pages: a record of each review session. Sentiment, what
// landed, what reviewers asked for, and the ordered plan that came out of it.

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

const Verdict = ({ title, who, children }) => (
  <Card title={title} note={who}>
    <Text>{children}</Text>
  </Card>
);

const SENTIMENT = [
  'Reviewers evaluated at the pattern level rather than picking at example content, so the core interaction model read clearly.',
  'The list–detail relationship was called the most valuable part and a strong foundation.',
  'Varied content (Users, Sales Cockpit, Compute, OpsRamp) gave confidence the pattern scales across domains. Sales Cockpit was singled out because every tab shows a different structure.',
  'The live coded prototype produced richer feedback than a static one would have.',
  'The consistent ask: clearer guidance on when to use the pattern, how it behaves during navigation, and how structure and containment are defined.',
];

const VERDICTS = [
  {
    title: 'Containment: no divider, uncontained list',
    who: 'Oliver, Julia, Mike, Seamus',
    body: 'The divider reads as noise beside the scrollbar and invites a drag-to-resize that does not exist. Containing the list is heavy once nav, context pane and contained detail content are all open, and leaves an empty canvas on mobile. If a contained option stays, pad it small (16px), not medium.',
  },
  {
    title: 'Surfaces: greys are inconsistent',
    who: 'Matt',
    body: 'Nav, context pane and detail containers use different greys. Reviewers want the elevation stack made explicit, and asked whether a base-1 (inset) surface has a place alongside base, base+1, base+2.',
  },
  {
    title: 'Spacing: non-divider view needs a wider gutter',
    who: 'Matt',
    body: 'When the divider is off, spacing between the list and detail regions should step up so proximity does the separating.',
  },
  {
    title: 'Responsive: behaviour is under-specified',
    who: 'Daniel, Julia, Mike',
    body: 'Left nav should auto-collapse as width shrinks; with nav, content and context pane all open the regions fight. Proposed ladder: nav + content + pane, then content + pane, then pane alone. On entering the narrow view the selected record should be active, matching the wide view.',
  },
  {
    title: 'Scroll: full-page scroll with sticky tabs',
    who: 'Matt, Seamus',
    body: 'Two reviewers want to compare the detail-pane scroll against a full-page scroll where the header and tabs stay pinned.',
  },
  {
    title: 'Details to fix',
    who: 'Daniel, Matt, Julia',
    body: 'The "Open a Case" button in the Compute → Support card is indistinguishable from the card; name–value lists could use tighter gaps; the icon + number status in the Sales Cockpit list needs checking against the status indicator guidance.',
  },
];

const OPEN = [
  'When should list–detail be preferred over a dedicated details page? Depends on the job to be done, but no guidance exists yet.',
  'Does the pattern hold for deep task execution inside a record, or only for reviewing, comparing and triaging across many records?',
  'How should example content for the library be selected: realism, diversity, safety, or structural coverage?',
];

const PLAN = [
  [
    'Lock defaults (done)',
    'Divider off, list uncontained, contained padding small (16px, size.small). Gutter steps up to large (48px, size.large) when the divider is off.',
  ],
  [
    'Fix the details',
    'Support card button, name–value list gaps, Sales Cockpit status indicator.',
  ],
  [
    'Elevation audit',
    'One table of surface to token for nav, context pane, cards and list; align greys; frame the inset question for the DS team.',
  ],
  [
    'Responsive ladder',
    'Build the nav / content / pane priority order into the shell; narrow entry lands on the selected record with a back-to-list path.',
  ],
  ['Responsive rules', 'Write the behaviour as rules on the Responsive pages.'],
  [
    'Usage guidance',
    'When to use vs a dedicated page, 4 scenarios (gather, compare, triage, execute), anatomy with region names, example-selection criteria.',
  ],
  [
    'Scroll toggle',
    'Detail-pane scroll vs full-page scroll with sticky header and tabs, as a header switch for the next crit.',
  ],
  [
    'Persist sub-tab',
    'Keep the selected detail tab while clicking through records.',
  ],
  [
    'Resize divider',
    'Explore panes resizable via a divider revealed on hover.',
  ],
  [
    'Review process',
    'Next session: freeform stickies first, categorise afterwards.',
  ],
];

export const CritNov19Level = () => (
  <Box gap="large">
    <Lead>
      First review of the live prototype with the design system team, 19
      November 2026. Feedback was gathered on a FigJam board in 2 topics, Page
      design and Containment, then synthesised from the Teams transcript.
      Broadly positive on the pattern; clearer guidance still needed.
    </Lead>

    <Box gap="small">
      <SectionHeading>Overall sentiment</SectionHeading>
      <Bullets items={SENTIMENT} />
    </Box>

    <Box gap="small">
      <SectionHeading>Verdicts</SectionHeading>
      <Grid columns={{ count: 'fit', size: ['medium', 'flex'] }} gap="small">
        {VERDICTS.map(({ title, who, body }) => (
          <Verdict key={title} title={title} who={who}>
            {body}
          </Verdict>
        ))}
      </Grid>
    </Box>

    <Box gap="small">
      <SectionHeading>Open questions</SectionHeading>
      <Bullets items={OPEN} />
    </Box>

    <Box gap="small">
      <SectionHeading>Proposed next steps</SectionHeading>
      <Box as="ol" margin="none" pad={{ left: 'medium' }} gap="xsmall">
        {PLAN.map(([title, body]) => (
          <Text as="li" key={title}>
            <Text weight={500}>{title}.</Text> {body}
          </Text>
        ))}
      </Box>
    </Box>

    <Box direction="row" gap="small" wrap>
      <Tag value="Milestone crit-1" size="small" />
      <Anchor
        href="https://www.figma.com/board/uFZ9z3NfdpdBzKOTibKARd/List-Details?node-id=50-163"
        label="FigJam board"
        target="_blank"
        rel="noreferrer"
      />
    </Box>
  </Box>
);
