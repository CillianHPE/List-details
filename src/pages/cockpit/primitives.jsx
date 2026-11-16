import { useState } from 'react';
import {
  Accordion,
  AccordionPanel,
  Box,
  Grid,
  Heading,
  Meter,
  Paragraph,
  Tag,
  Text,
  ToggleGroup,
} from 'grommet';
import { Info } from '@hpe-design/icons-grommet';
import { PERIODS } from '../../data/cockpit';

// Building blocks that recur across the Sales Cockpit pages: KPI cards,
// contained cards with a title/subtitle, the period toggle that sits beside
// a section heading, the big-number score block and the Data notes accordion.

export const KpiCard = ({ label, value, unit, note, action }) => (
  <Box
    background="background-contrast"
    round="medium"
    pad="medium"
    gap="small"
    flex="grow"
  >
    <Box direction="row" align="center" justify="between" gap="small">
      <Text weight={500}>{label}</Text>
      {action && <Box flex={false}>{action}</Box>}
    </Box>
    <Box gap="xsmall">
      <Box direction="row" align="baseline" gap="xsmall">
        <Heading level={3} margin="none" size="large">
          {value}
        </Heading>
        {unit && (
          <Text size="small" color="text-weak">
            {unit}
          </Text>
        )}
      </Box>
      {note && (
        <Text size="small" color="text-weak">
          {note}
        </Text>
      )}
    </Box>
  </Box>
);

export const KpiRow = ({ children }) => (
  <Grid columns={{ count: 'fit', size: ['small', 'flex'] }} gap="small">
    {children}
  </Grid>
);

// Contained card. `help` adds the (i) affordance the designs put beside the
// title; `action` is a trailing control such as a period toggle.
export const Card = ({ title, subtitle, help, action, children, ...rest }) => (
  <Box
    background="background-contrast"
    round="medium"
    pad="medium"
    gap="medium"
    {...rest}
  >
    {(title || action) && (
      <Box direction="row" align="start" justify="between" gap="medium" wrap>
        <Box gap="xxsmall">
          <Box direction="row" align="center" gap="xsmall">
            <Heading level={3} size="small" margin="none">
              {title}
            </Heading>
            {help && <Info size="small" color="text-weak" aria-hidden />}
          </Box>
          {subtitle && (
            <Text size="small" color="text-weak">
              {subtitle}
            </Text>
          )}
        </Box>
        {action}
      </Box>
    )}
    {children}
  </Box>
);

// Un-contained section with the same header shape (heading + trailing
// control), for content that is itself a list or table.
export const SectionHeader = ({ title, subtitle, action, level = 3 }) => (
  <Box direction="row" align="start" justify="between" gap="medium" wrap>
    <Box gap="xxsmall">
      <Heading level={level} size="small" margin="none">
        {title}
      </Heading>
      {subtitle && (
        <Text size="small" color="text-weak">
          {subtitle}
        </Text>
      )}
    </Box>
    {action}
  </Box>
);

export const PeriodToggle = ({ value, onChange, size = 'small' }) => (
  <ToggleGroup
    options={PERIODS}
    value={value}
    onToggle={({ value: v }) => onChange(v)}
    a11yTitle="Time period"
    size={size}
  />
);

export const usePeriod = (initial = '6 months') => useState(initial);

export const TIER_TINT = {
  Healthy: 'validation-ok',
  Neutral: 'validation-warning',
  'At risk': 'validation-critical',
};
export const TIER_COLOR = {
  Healthy: 'status-ok',
  Neutral: 'status-warning',
  'At risk': 'status-critical',
};

export const TierTag = ({ tier }) => (
  <Tag size="xsmall" value={tier} background={TIER_TINT[tier]} border={false} />
);

// Big number · tier tag · meter · signal bullets (Health, Peer benchmarking)
export const ScoreBlock = ({ score, tier, signals }) => (
  <Box gap="small">
    <Box direction="row" align="start" gap="small">
      <Heading level={3} margin="none" size="xlarge">
        {score}
      </Heading>
      <Box gap="xxsmall" pad={{ top: 'xsmall' }}>
        <TierTag tier={tier} />
        <Text size="small" color="text-weak">
          of 100
        </Text>
      </Box>
    </Box>
    <Box gap="xxsmall">
      <Meter
        type="bar"
        size="full"
        thickness="xsmall"
        round
        max={100}
        values={[{ value: score, color: TIER_COLOR[tier] }]}
        a11yTitle={`${score} of 100`}
      />
      <Box direction="row" justify="between">
        <Text size="xsmall" color="text-weak">
          0
        </Text>
        <Text size="xsmall" color="text-weak">
          100
        </Text>
      </Box>
    </Box>
    {signals && <Bullets items={signals} />}
  </Box>
);

// Bullet list where alternate fragments are emphasised, as in the designs
// ("Only **6 of 38** users active in the last **30 days**").
export const Bullets = ({ items }) => (
  <Box as="ul" margin="none" pad={{ left: 'medium' }} gap="xxsmall">
    {items.map((parts, i) => (
      <Text as="li" size="small" key={i}>
        {parts.map((p, j) =>
          j % 2 ? (
            <Text size="small" weight={500} key={j}>
              {p}
            </Text>
          ) : (
            p
          ),
        )}
      </Text>
    ))}
  </Box>
);

export const Legend = ({ items }) => (
  <Box direction="row" gap="medium" wrap>
    {items.map(({ label, color, value }) => (
      <Box key={label} direction="row" align="center" gap="xsmall">
        <Box width="12px" height="12px" round="xsmall" background={color} />
        <Text size="small">{label}</Text>
        {value != null && (
          <Text size="small" weight={500}>
            {value}
          </Text>
        )}
      </Box>
    ))}
  </Box>
);

export const DataNotes = ({ notes }) => (
  <Accordion margin={{ top: 'medium' }}>
    <AccordionPanel label="Data notes">
      <Box pad={{ vertical: 'small' }} gap="xsmall">
        {notes.map((n) => (
          <Paragraph key={n} size="small" margin="none" fill>
            {n}
          </Paragraph>
        ))}
      </Box>
    </AccordionPanel>
  </Accordion>
);
