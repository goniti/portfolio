import Image from 'next/image';
import { Box, Flex, Link, Text } from 'goniui';
import { tv } from 'tailwind-variants';
import { useLocalized } from '@/shared/lib/i18n';
import { CtaButton, OWN_CURSOR_TARGET, Surface, Tag } from '@/shared/ui/atoms';
import type { Project } from '../../model/content';
import type { ProjectsCopy } from './messages';

const projectMediaVariants = tv({
  base: 'relative grid aspect-16/10 place-items-center overflow-hidden border-border border-b bg-media',
  variants: {
    tint: {
      amber: 'media-tone-amber',
      cyan: 'media-tone-cyan',
      emerald: 'media-tone-emerald',
      violet: 'media-tone-violet',
      sky: 'media-tone-sky',
    },
  },
});

type ProjectCardCopy = Pick<ProjectsCopy, 'demo' | 'demoLabel' | 'source' | 'sourceLabel'>;

export interface ProjectCardProps {
  /** Content of the project, in every locale; the card shows the current one. */
  project: Project;
  copy: ProjectCardCopy;
}

/**
 * A project: screenshot (or placeholder), pitch, technologies and links. The cursor outlines
 * each action on its own.
 */
export function ProjectCard({ project, copy }: ProjectCardProps) {
  const localize = useLocalized();
  const title = localize(project.title);

  return (
    <Surface as="article" hover="project" className="flex w-full flex-col overflow-hidden">
      <Box className={projectMediaVariants({ tint: project.tint })}>
        {project.image ? (
          <Image
            src={project.image.src}
            alt={localize(project.image.alt)}
            fill
            placeholder={project.image.lqip ? 'blur' : 'empty'}
            blurDataURL={project.image.lqip ?? undefined}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-left-top"
          />
        ) : (
          <Text
            as="span"
            variant="bodySm"
            className="rounded-lg border border-border-strong border-dashed px-2.5 py-1.5 font-mono text-foreground-subtle"
          >
            {project.placeholder ? localize(project.placeholder) : null}
          </Text>
        )}
        <Text
          as="span"
          variant="bodySm"
          className="absolute top-3.5 left-3.5 rounded-full border border-terminal-edge bg-scrim px-2.5 py-1 font-mono text-2xs text-terminal-text backdrop-blur-sm"
        >
          {localize(project.kind)}
        </Text>
      </Box>
      <Flex direction="col" gap="md" className="flex-1 p-5.5">
        <Text as="h3" variant="h2" className="font-bold text-xl leading-tight tracking-tight">
          {title}
        </Text>
        <Text variant="body" tone="muted" className="text-pretty leading-relaxed">
          {localize(project.description)}
        </Text>
        <Flex as="ul" wrap="wrap" className="mt-auto gap-1.5 pt-1.5">
          {project.technologies.map((technology) => (
            <li key={technology}>
              <Tag filled={false}>{technology}</Tag>
            </li>
          ))}
        </Flex>
        <Flex gap="sm" className="pt-2">
          {project.demoUrl ? (
            <CtaButton {...OWN_CURSOR_TARGET} asChild tone="soft" size="md" block>
              <Link href={project.demoUrl} variant="unstyled" aria-label={copy.demoLabel(title)}>
                {copy.demo}
              </Link>
            </CtaButton>
          ) : null}
          <CtaButton {...OWN_CURSOR_TARGET} asChild tone="quiet" size="md" block>
            <Link href={project.sourceUrl} variant="unstyled" aria-label={copy.sourceLabel(title)}>
              {copy.source}
            </Link>
          </CtaButton>
        </Flex>
      </Flex>
    </Surface>
  );
}
