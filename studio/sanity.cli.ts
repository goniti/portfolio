import { defineCliConfig } from 'sanity/cli';
import { dataset, projectId } from './env';

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: 'goniti-portfolio',
  deployment: { appId: 'ywbqr0hno67nr27uiv4l1slt', autoUpdates: true },
  // ADR-003: types of the site's GROQ queries, generated into the site (committed, drift-checked
  // in CI). `pnpm typegen` extracts the schema with `--enforce-required-fields` first.
  typegen: {
    path: '../src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../src/shared/api/sanity/sanity.types.ts',
    overloadClientMethods: true,
  },
});
