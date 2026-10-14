// Safe in client components. The server environment (zod-validated) has its own entry point,
// `@/shared/config/server`, so the browser bundle never ships zod.
export { CALENDLY_PAGE_PATTERN, clientEnv } from './clientEnv';
