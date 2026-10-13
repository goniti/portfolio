'use client';

import { Badge, Flex, Text } from 'goniui';
import { useMessages } from '@/shared/lib/i18n';
import { REVEAL } from '@/shared/lib/motion';
import { Surface, Tag } from '@/shared/ui/atoms';
import { SectionHeading } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import { formatIndex } from '../../model/format';
import { AI_PRACTICES, BACKEND_STACK, CORE_STACK, LEADERSHIP_SKILLS } from '../../model/skills';
import { tintVariants } from '../tint';
import { skillsMessages } from './messages';

const CARD_CLASS = 'min-w-0 gap-5.5 p-5.5 md:p-8';
const CARD_TITLE_CLASS = 'text-2xl font-bold tracking-tight';

/** Bento of four skill cards: core stack, backend, AI workflow, leadership. */
export function SkillsSection() {
  const copy = useMessages(skillsMessages);

  return (
    <PageSection id="skills" labelledBy="skills-title">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        titleId="skills-title"
        {...REVEAL.left}
      />
      <Flex wrap="wrap" gap="lg" {...REVEAL.columns}>
        <Surface
          fill="indigo"
          hover="indigo"
          className={`flex grow-2 basis-130 flex-col ${CARD_CLASS}`}
        >
          <Flex justify="between" align="baseline" gap="md">
            <Text as="h3" variant="h2" className={CARD_TITLE_CLASS}>
              {copy.core.title}
            </Text>
            <Text as="span" variant="caption" className="font-mono text-foreground-subtle">
              {copy.core.caption}
            </Text>
          </Flex>
          <Flex as="ul" wrap="wrap" className="gap-2.5">
            {CORE_STACK.map((technology) => (
              <Flex
                as="li"
                key={technology.name}
                align="center"
                className="gap-2.5 rounded-xl border border-border-strong bg-chip px-4 py-3 text-base font-medium transition duration-200 ease-spring hover:-translate-y-0.75 hover:scale-103 hover:border-tint-cyan/50 hover:shadow-chip-lift"
              >
                <span
                  aria-hidden="true"
                  className={tintVariants({
                    tint: technology.tint,
                    className: 'size-2 rounded-full bg-current glow-current',
                  })}
                />
                {technology.name}
              </Flex>
            ))}
          </Flex>
        </Surface>

        <Surface hover="cyan" className={`flex grow basis-75 flex-col ${CARD_CLASS}`}>
          <Text as="h3" variant="h2" className={CARD_TITLE_CLASS}>
            {copy.backend.title}
          </Text>
          <Flex as="ul" wrap="wrap" gap="sm">
            {BACKEND_STACK.map((technology) => (
              <li key={technology}>
                <Tag
                  size="md"
                  className="transition-colors hover:border-tint-cyan/45 hover:text-accent-cyan"
                >
                  {technology}
                </Tag>
              </li>
            ))}
          </Flex>
        </Surface>

        <Surface
          fill="violet"
          hover="violet"
          className={`flex grow basis-95 flex-col ${CARD_CLASS} gap-4.5`}
        >
          <Flex justify="between" align="center" gap="md">
            <Text as="h3" variant="h2" className={CARD_TITLE_CLASS}>
              {copy.ai.title}
            </Text>
            <Badge
              variant="outline"
              className="border-0 bg-tint-violet/15 font-mono text-2xs text-accent-violet"
            >
              {copy.ai.badge}
            </Badge>
          </Flex>
          <Flex as="ol" direction="col">
            {AI_PRACTICES.map((practiceId, index) => (
              <Flex
                as="li"
                key={practiceId}
                align="baseline"
                className="gap-3.5 border-b border-border py-3"
              >
                <Text
                  as="span"
                  variant="bodySm"
                  className="flex-none font-mono font-medium text-accent-violet"
                >
                  {formatIndex(index, 1)}
                </Text>
                <Flex direction="col" className="gap-0.5">
                  <Text as="span" variant="bodyLg" className="font-semibold">
                    {copy.ai.practices[practiceId].title}
                  </Text>
                  <Text as="span" variant="body" tone="muted" className="leading-normal">
                    {copy.ai.practices[practiceId].description}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Surface>

        <Surface hover="soft" className={`flex grow basis-75 flex-col ${CARD_CLASS}`}>
          <Text as="h3" variant="h2" className={CARD_TITLE_CLASS}>
            {copy.leadership.title}
          </Text>
          <Flex as="ul" direction="col" className="gap-3.5">
            {LEADERSHIP_SKILLS.map((skillId) => (
              <Flex as="li" key={skillId} align="center" className="gap-3.5">
                <Text
                  as="span"
                  variant="bodySm"
                  aria-hidden="true"
                  className="grid size-9.5 flex-none place-items-center rounded-lg border border-tint-indigo/25 bg-tint-indigo/10 font-mono font-semibold text-accent-indigo"
                >
                  {copy.leadership.monograms[skillId]}
                </Text>
                <Flex direction="col">
                  <Text as="span" variant="bodyLg" className="font-semibold">
                    {copy.leadership.skills[skillId].title}
                  </Text>
                  <Text as="span" variant="body" tone="muted">
                    {copy.leadership.skills[skillId].description}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Surface>
      </Flex>
    </PageSection>
  );
}
