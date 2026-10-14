/**
 * Sanity project of the portfolio (ADR-003). Neither value is a secret: the `production` dataset
 * is public. `SANITY_STUDIO_DATASET` points the Studio, the CLI and the seed at another dataset
 * (for example `development`, to test the failure path).
 */
export const projectId = '8i6zw2b7';
export const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
