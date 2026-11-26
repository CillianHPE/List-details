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
    body: 'Nav, context pane and detail containers use different greys. Reviewers want the background token stack made explicit, and asked whether a base-1 (inset) surface has a place alongside base, base+1, base+2.',
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
    'Divider off, list uncontained, contained padding small (16px, size.small). The list zone and the detail zone are each a content section (own toolbar or header, own scroll), side by side in the primary content area, so the gutter between them is the content-section gap of 48px (size.xlarge), not the 24px (size.medium) block gap used inside a section, set as a grid gap with no divider and no per-side padding.',
  ],
  [
    'Fix the details (done)',
    'Support card button is now secondary; name–value rows tightened to 8px (size.xxsmall); the Sales Cockpit list shows icon + status name with the score as secondary text, per the status indicator guidance.',
  ],
  [
    'Background token audit (done)',
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
    'Usage guidelines → When to use: 6 decision questions (list–detail vs a dedicated page), context-preservation first since the 23 Nov 1:1, the 4 scenarios.',
  ],
  [
    'Scroll default (decided 23 Nov)',
    'Full-page scroll is the default: the page scrolls as 1, the list keeps its own scroll, and the list toolbar and detail tab bar pin 24px (size.medium) below the global header. "Detail-pane scroll" in prototype options restores the bounded pane for comparison.',
  ],
  [
    'Persist sub-tab (done)',
    'Default on: the selected detail tab is kept while clicking through records, per page. "Keep tab across records" in prototype options switches it off to compare.',
  ],
  [
    'Divider (dropped, 23 Nov)',
    'Removed as a prop and visual style after the 1:1 with Oliver. It read as noise beside the scrollbar and implied a drag-to-resize that does not exist; the 48px (edgeSize.xlarge) gutter separates the zones.',
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

// Tracker: every request since Crit 01, with what changed and where it
// stands. Mirrors the "Tracker and changelog" page on the FigJam board;
// IDs (R01…) are stable so they can be quoted in Teams or Confluence.
const LANES = [
  {
    key: 'decided',
    label: 'Decided',
    note: 'Agreed and built. Lives in the prototype and Confluence.',
    status: 'ok',
  },
  {
    key: 'review',
    label: 'In review',
    note: 'Built as an option, waiting on named people on the FigJam sign-off page.',
    status: 'warning',
  },
  {
    key: 'open',
    label: 'Open',
    note: 'No treatment yet. Needs a decision or more use cases.',
    status: 'unknown',
  },
];

const REQUESTS = [
  {
    id: 'R01',
    lane: 'decided',
    title: 'Resize divider',
    raised: 'Oliver (Crit 01)',
    ask: 'The divider reads as noise and implies a drag-to-resize that does not exist.',
    change:
      'Removed as a prop and visual style. The 48px (size.xlarge) gutter separates the zones.',
    when: 'Decided 23 Nov, 1:1 with Oliver',
    href: '#/v3',
    see: 'Users list–detail',
  },
  {
    id: 'R02',
    lane: 'decided',
    title: 'Scroll default',
    raised: 'Matt, Seamus (Crit 01)',
    ask: 'Compare detail-pane scroll with a full-page scroll where header and tabs stay pinned.',
    change:
      'Full-page scroll is the default. The list scrolls independently; toolbar and tab bar pin 24px (size.medium) below the header. "Detail-pane scroll" kept as a prototype option.',
    when: 'Decided 23 Nov, 1:1 with Oliver',
    href: '#/behaviour/scroll',
    see: 'Behaviour → Scroll',
  },
  {
    id: 'R03',
    lane: 'decided',
    title: 'Usage guidance: context first',
    raised: 'Oliver (1:1), Crit 01 open question',
    ask: 'When should list–detail be preferred over a dedicated page? Put "Does the list matter?" and context preservation higher.',
    change:
      '6 decision questions, "Does keeping their place in the list matter?" first. Benefit made explicit: do the task without disrupting your context. Identifiers in the list, the rest in the pane.',
    when: 'Decided 23 Nov, wording sharpened 25 Nov',
    href: '#/pattern/use',
    see: 'Usage guidelines → When to use',
  },
  {
    id: 'R04',
    lane: 'decided',
    title: 'Gutter between list and detail',
    raised: 'Matt (Crit 01)',
    ask: 'With no divider, step the spacing up so proximity does the separating.',
    change:
      'List and detail are 2 content sections, so the gap is the content-section gap: 48px (size.xlarge), a grid gap with no per-side padding.',
    when: 'Done 20 Nov',
    href: '#/anatomy',
    see: 'Anatomy → Spacing',
  },
  {
    id: 'R05',
    lane: 'decided',
    title: 'Responsive ladder',
    raised: 'Daniel, Julia, Mike (Crit 01)',
    ask: 'Nav should auto-collapse; regions fight when nav, content and pane are all open; narrow entry should land on the selected record.',
    change:
      'Nav rails under 1080px (medium) or when the pane is open under 1440px (xlarge); overlays under 768px (small). Narrow entry lands on the record with Back. 2 columns while the surface is at least 784px.',
    when: 'Done 20 Nov',
    href: '#/responsive/breakpoints',
    see: 'Responsive → Breakpoints',
  },
  {
    id: 'R06',
    lane: 'decided',
    title: 'Details to fix',
    raised: 'Daniel, Matt, Julia (Crit 01)',
    ask: '"Open a Case" button blends into its card; name–value gaps too loose; Sales Cockpit status icon + number needs checking.',
    change:
      'Button is now secondary; rows tightened to 8px (size.xxsmall); the list shows icon + status name with the score as secondary text.',
    when: 'Done 20 Nov',
    href: '#/compute-servers',
    see: 'Compute → Servers',
  },
  {
    id: 'R07',
    lane: 'decided',
    title: 'Keep tab across records',
    raised: 'Cillian (compare use case)',
    ask: 'Keep the selected detail tab active while moving between records.',
    change: 'Default on, per page. Prototype option to switch off for comparison.',
    when: 'Done 21 Nov',
    href: '#/v3',
    see: 'Users list–detail',
  },
  {
    id: 'R08',
    lane: 'decided',
    title: 'Containment: list, detail, content, wrapper',
    raised: 'Oliver, Julia, Mike, Seamus (Crit 01)',
    ask: 'Containing the list is heavy once nav, pane and contained content are all open, and leaves an empty canvas on mobile.',
    change:
      'Default: contained list (16px, size.small padding), uncontained detail. Containment inside the detail depends on its content (Sales Cockpit may need it, Users does not). Toggles kept in Prototype options.',
    when: 'Decided 25 Nov, design review with Oliver',
    href: '#/v3',
    see: 'Users list–detail',
  },
  {
    id: 'R09',
    lane: 'review',
    title: 'Surface greys and inset (base −1)',
    raised: 'Matt (Crit 01)',
    ask: 'Nav, pane and detail containers use different greys. Make the token stack explicit. Is there a place for an inset surface?',
    change:
      'Anatomy → Surfaces lists surface to token. Containers share background-back; background-contrast kept for selection. Inset is framed as a question for the DS team.',
    when: 'Containment, scrolling and spacing confirmed solid by Matt 25 Nov; inset question still open with the DS team',
    href: '#/anatomy',
    see: 'Anatomy → Surfaces',
  },
  {
    id: 'R10',
    lane: 'decided',
    title: 'When not to use',
    raised: 'Crit 01 open question',
    ask: 'Does the pattern hold for deep task execution inside a record, or only review, compare and triage?',
    change:
      'Usage guidelines → When not to use: signals to give a record its own page, same format as When to use.',
    when: 'Shown at Show & Tell 25 Nov, no pushback',
    href: '#/pattern/when-not',
    see: 'Usage guidelines → When not to use',
  },
  {
    id: 'R11',
    lane: 'decided',
    title: 'Section hierarchy',
    raised: 'Oliver (1:1, 23 Nov)',
    ask: 'Is list–detail 1 content section with sub-sections, or 2 content sections? Spacing follows from the answer.',
    change:
      'Model: the page is the parent; list and detail are 2 content sections nested in it, 48px (size.xlarge) apart. Rationale added to Anatomy → Zoning (Gutter).',
    when: 'Agreed with Oliver 25 Nov; confirmed by Matt and Julia at Show & Tell 25 Nov ("spot on", "best of the 3 options")',
    href: '#/anatomy',
    see: 'Anatomy → Zoning',
  },
  {
    id: 'R12',
    lane: 'open',
    title: 'Example content for the library',
    raised: 'Crit 01 open question',
    ask: 'How should example content be chosen: realism, diversity, safety or structural coverage?',
    change: 'Nothing yet. 4 examples live: Users, Sales Cockpit, Compute, OpsRamp.',
    when: 'Open',
  },
  {
    id: 'R13',
    lane: 'open',
    title: 'Path to publish',
    raised: 'Cillian',
    ask: 'What does the pattern need before it is a published HPE DS template: Figma kit, docs home, examples?',
    change:
      'Confluence Usage guidelines pages drafted (Overview, When to use, JTBD, User stories).',
    when: 'Open, needs Oliver',
  },
  {
    id: 'R14',
    lane: 'decided',
    title: 'Spacing inside containers',
    raised: 'Oliver (review, 25 Nov)',
    ask: 'Are the container spacings specified, or should they change for the examples library?',
    change:
      'Keep the current direction: 16px (size.small) between containers, 12px (size.xsmall) between items inside a container. Revisit only if a change proves necessary.',
    when: 'Decided 25 Nov, design review with Oliver',
    href: '#/anatomy',
    see: 'Anatomy → Spacing',
  },
  {
    id: 'R15',
    lane: 'decided',
    title: 'Sharper definitions and rationale per question',
    raised: 'Matt, Julia (Show & Tell, 25 Nov)',
    ask: 'Tighten the adjectives in When to use ("short", "snappy", "many") and add the reasoning behind each question so the call can be defended.',
    change:
      'Short defined as under about a minute, decided from the pane; long as minutes or revisited. "Several" became "several to many" against "1 or 2". A Why line added under each of the 6 questions.',
    when: 'Done 25 Nov',
    href: '#/pattern/use',
    see: 'Usage guidelines → When to use',
  },
  {
    id: 'R16',
    lane: 'open',
    title: 'Collapsible list (focus mode)',
    raised: 'Matt, Scott (Show & Tell, 25 Nov)',
    ask: 'Let the list collapse to a rail or hide so the detail takes the width when the work on a record runs longer than expected.',
    change:
      'Logged as a future exploration. Not building yet; the current answer is to give long work its own page.',
    when: 'Open, explore later',
    href: '#/pattern/when-not',
    see: 'Usage guidelines → When not to use',
  },
  {
    id: 'R17',
    lane: 'open',
    title: 'GreenLake Data Science test case',
    raised: 'Matt (Show & Tell, 25 Nov)',
    ask: 'Run an editing-heavy list–detail from GreenLake Data Science through the 6 questions. Does it fit, or does it need a variant?',
    change: 'Nothing yet. Waiting on Matt to send the example.',
    when: 'Open, awaiting Matt',
    href: '#/pattern/use',
    see: 'Usage guidelines → When to use',
  },
  {
    id: 'R18',
    lane: 'review',
    title: 'View controls left, actions right',
    raised: 'Matt (Show & Tell, 25 Nov)',
    ask: 'Make it a rule: find and view controls (search, filter, sort) sit top-left of the list; actions on the set sit top-right.',
    change:
      'Already how the toolbar is built in every example. Needs writing up as a rule in Anatomy → Toolbar.',
    when: 'Awaiting write-up',
    href: '#/anatomy',
    see: 'Anatomy → Toolbar',
  },
];

const CHANGELOG = [
  [
    '25 Nov',
    'Show & Tell with the DS team. Framework called "very solid"; 48px (size.xlarge) gutter, containment and page scroll confirmed. Section hierarchy and When not to use moved to Decided. When to use sharpened with definitions and a Why per question. New: collapsible list (future), GreenLake Data Science test case, controls-left actions-right rule.',
  ],
  [
    '25 Nov',
    'Design review with Oliver. Decided: contained list by default, detail containment by content; page scroll confirmed; "keeping their place in the list" wording; container spacing kept. Section hierarchy model agreed, pending Matt.',
  ],
  [
    '23 Nov',
    'Divider removed as prop and style. Full-page scroll made the default. When to use reordered: 6 questions, context first. Confluence Overview and When to use updated. Tracker page added here and on FigJam.',
  ],
  [
    '23 Nov',
    '1:1 with Oliver. Decided: drop divider, full-page scroll default, context test first. Open: section hierarchy, containment feedback.',
  ],
  [
    '22 Nov',
    'Prototype options persist across examples. Toggles added: Contained detail, Contained content. Menu grouped by Containment, Behaviour, Shell.',
  ],
  [
    '21 Nov',
    'When not to use page restored in the When to use format. Keep tab across records on by default. Async sign-off sections per person on FigJam, respond by 25 Nov.',
  ],
  [
    '20 Nov',
    'Crit 01 synthesis published. Gutter set to 48px (size.xlarge). Details fixed: secondary button, 8px rows, status indicator. Surfaces token table. Responsive ladder and breakpoint rules. Confluence Usage guidelines pages created with mocks.',
  ],
  [
    '19 Nov',
    'Crit 01 with the DS team on the live prototype. Feedback in 2 topics: Page design and Containment.',
  ],
];

const Field = ({ label, children }) => (
  <Box gap="xxsmall">
    <Text size="small" weight={500}>
      {label}
    </Text>
    <Text size="small">{children}</Text>
  </Box>
);

const RequestCard = ({ item }) => (
  <Card title={`${item.id} ${item.title}`} note={item.when}>
    <Box gap="small">
      <Field label="Raised by">{item.raised}</Field>
      <Field label="Ask">{item.ask}</Field>
      <Field label="What changed">{item.change}</Field>
      {item.href && (
        <Anchor
          href={item.href}
          label={`${item.see} ↗`}
          size="small"
          target={item.href.startsWith('#') ? undefined : '_blank'}
          rel="noreferrer"
        />
      )}
    </Box>
  </Card>
);

export const TrackerLevel = () => {
  const counts = Object.fromEntries(
    LANES.map((l) => [l.key, REQUESTS.filter((r) => r.lane === l.key).length]),
  );
  return (
    <Box gap="large">
      <Lead>
        Every request from Crit 01 (19 Nov), the async sign-off, the 1:1 with
        Oliver (23 Nov) and the design review (25 Nov), with what changed and
        where it stands.{' '}
        {counts.decided} decided, {counts.review} in review, {counts.open} open.
        IDs are stable: quote them in Teams or Confluence.
      </Lead>

      {LANES.map((lane) => (
        <Box gap="small" key={lane.key}>
          <Box direction="row" align="center" gap="small">
            <SectionHeading>
              {lane.label} · {counts[lane.key]}
            </SectionHeading>
            <Text size="small" color="text-weak">
              {lane.note}
            </Text>
          </Box>
          <Grid columns={{ count: 'fit', size: ['medium', 'flex'] }} gap="small">
            {REQUESTS.filter((r) => r.lane === lane.key).map((item) => (
              <RequestCard key={item.id} item={item} />
            ))}
          </Grid>
        </Box>
      ))}

      <Box gap="small">
        <SectionHeading>Changelog</SectionHeading>
        <Box gap="xsmall">
          {CHANGELOG.map(([date, body], i) => (
            <Box direction="row" gap="medium" key={`${date}-${i}`}>
              <Text weight={500} style={{ minWidth: '5em' }}>
                {date}
              </Text>
              <Text>{body}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      <Box direction="row" gap="small" wrap>
        <Anchor
          href="https://www.figma.com/board/uFZ9z3NfdpdBzKOTibKARd/List-Details?node-id=130-238"
          label="FigJam tracker"
          target="_blank"
          rel="noreferrer"
        />
      </Box>
    </Box>
  );
};
