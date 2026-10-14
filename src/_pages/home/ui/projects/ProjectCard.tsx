import Image from 'next/image';
import { Box, Flex, Link, Text } from 'goniui';
import { tv } from 'tailwind-variants';
import { CtaButton, OWN_CURSOR_TARGET, Surface, Tag } from '@/shared/ui/atoms';
import type { Project } from '../../model/content';

const projectMediaVariants = tv({
  base: 'relative grid aspect-16/10 place-items-center overflow-hidden border-b border-border bg-media',
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

interface ProjectCardCopy {
  title: string;
  kind: string;
  description: string;
  imageAlt: string;
  /** Caption shown while the project has no screenshot. */
  placeholder: string;
  demo: string;
  demoLabel: string;
  source: string;
  sourceLabel: string;
}

export interface ProjectCardProps {
  project: Project;
  copy: ProjectCardCopy;
}

/**
 * A project: screenshot (or placeholder), pitch, technologies and links. The cursor outlines
 * each action on its own.
 */
export function ProjectCard({ project, copy }: ProjectCardProps) {
  return (
    <Surface as="article" hover="project" className="flex w-full flex-col overflow-hidden">
      <Box className={projectMediaVariants({ tint: project.tint })}>
        {project.image ? (
          <Image
            src={project.image.src}
            alt={copy.imageAlt}
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
            className="rounded-lg border border-dashed border-border-strong px-2.5 py-1.5 font-mono text-foreground-subtle"
          >
            {copy.placeholder}
          </Text>
        )}
        <Text
          as="span"
          variant="bodySm"
          className="absolute top-3.5 left-3.5 rounded-full border border-terminal-edge bg-scrim px-2.5 py-1 font-mono text-2xs text-terminal-text backdrop-blur-sm"
        >
          {copy.kind}
        </Text>
      </Box>
      <Flex direction="col" gap="md" className="flex-1 p-5.5">
        <Text as="h3" variant="h2" className="text-xl leading-tight font-bold tracking-tight">
          {copy.title}
        </Text>
        <Text variant="body" tone="muted" className="leading-relaxed text-pretty">
          {copy.description}
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
              <Link href={project.demoUrl} variant="unstyled" aria-label={copy.demoLabel}>
                {copy.demo}
              </Link>
            </CtaButton>
          ) : null}
          <CtaButton {...OWN_CURSOR_TARGET} asChild tone="quiet" size="md" block>
            <Link href={project.sourceUrl} variant="unstyled" aria-label={copy.sourceLabel}>
              {copy.source}
            </Link>
          </CtaButton>
        </Flex>
      </Flex>
    </Surface>
  );
}
