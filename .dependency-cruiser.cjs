// Architecture rules, checked by `pnpm lint:arch` (CI included).
// Description of the architecture: .agents/rules/architecture.md.
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'Modules importing each other (directly or through a chain) break the initialization order: move the shared part one level down. Type-only cycles are erased at build time and allowed.',
      from: {},
      to: { circular: true, viaOnly: { dependencyTypesNot: ['type-only'] } },
    },
    // The FSD layers and public APIs are checked by Steiger (steiger.config.js);
    // the Atomic Design levels of shared/ui are checked here.
    {
      name: 'atoms-are-indivisible',
      severity: 'error',
      comment: 'An atom only builds on other atoms.',
      from: { path: '^src/shared/ui/atoms/' },
      to: { path: '^src/shared/ui/(molecules|organisms|templates)/' },
    },
    {
      name: 'molecules-compose-atoms',
      severity: 'error',
      comment: 'A molecule composes atoms, never an organism or a template.',
      from: { path: '^src/shared/ui/molecules/' },
      to: { path: '^src/shared/ui/(organisms|templates)/' },
    },
    {
      name: 'organisms-compose-molecules',
      severity: 'error',
      comment: 'An organism composes atoms and molecules, never a template.',
      from: { path: '^src/shared/ui/organisms/' },
      to: { path: '^src/shared/ui/templates/' },
    },
    {
      name: 'routes-on-top',
      severity: 'error',
      comment:
        'app/ holds the Next.js routes: they import the FSD code, never the other way around.',
      from: { path: '^src/' },
      to: { path: '^app/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    includeOnly: '^(app|src)/',
    // Type-only imports are part of the graph (see `no-circular`).
    tsPreCompilationDeps: true,
    // Resolves the `@/…` alias.
    tsConfig: { fileName: 'tsconfig.json' },
  },
};
