// Bundle size budget (brotli), checked by `pnpm size` after the build: every script of the static
// export (`out/`), the JavaScript GitHub Pages serves. The limit is the size measured when it was
// set (224 kB, 2026-10) plus a margin of about 10%; raise it only for a reason.
module.exports = [
  {
    name: 'JavaScript shipped to the browser',
    path: 'out/_next/static/chunks/**/*.js',
    limit: '250 kB',
  },
];
