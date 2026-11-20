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
    'Divider off, list uncontained, contained padding small (16px, size.small). List and detail are sibling zones inside the primary content area, so the gutter between them is a single content-section gap of 48px (size.xlarge), set as a grid gap with no divider and no per-side padding.',
  ],
  [
    'Fix the details (done)',
    'Support card button is now secondary; name–value rows tightened to 8px (size.xxsmall); the Sales Cockpit list shows icon + status name with the score as secondary text, per the status indicator guidance.',
  ],
  [
    'Elevation audit (done)',
    'Anatomy → Surfaces: 1 table of surface to token. Containers now share background-back; background-contrast is kept for selection. Inset (base −1) framed as a question for the DS team.',
  ],
  [
    'Responsive ladder (done)',
    'Nav collapses to its rail under 1080px (medium) or whenever the context pane is open under 1440px (xlarge); under 768px (small) the nav and context pane become overlays. Narrow entry lands on the selected record with Back in the page header. List and detail stay 2 columns while the surface is at least 784px.',
  ],
  [
    'Responsive rules (done)',
    'Responsive → Breakpoints, Regions by width and Shell configurations now state the ladder as rules and show the surface width each shell configuration leaves.',
  ],
  [
    'Usage guidance (done)',
    'Pattern → When to use: 5 decision questions (list–detail vs a dedicated page), the 4 scenarios with Execute named as the boundary, and the 4 example-selection criteria.',
  ],
  [
    'Scroll toggle (done)',
    '"Full-page scroll" in prototype options: the page scrolls as 1, with the list toolbar and the detail tab bar pinned 24px (size.medium) below the global header. Off (default) the detail pane scrolls on its own.',
  ],
  [
    'Persist sub-tab (done)',
    'Default on: the selected detail tab is kept while clicking through records, per page. "Keep tab across records" in prototype options switches it off to compare.',
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
