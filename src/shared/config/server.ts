// Build-time and server-side environment, validated with zod. Never import it from client code:
// it would ship zod to the browser (`pnpm bundle:check` fails the build on it).
export { env, loadEnv, SANITY_PROJECT_ID_REQUIRED } from './env';
