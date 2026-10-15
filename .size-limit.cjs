// Bundle size budget (gzip), checked by `pnpm size` after the build.
// ADAPT: tighten each limit to the current size plus a margin once the app has real features.
module.exports = [
  {
    name: 'JavaScript shipped to the browser',
    path: '.next/static/chunks/**/*.js',
    limit: '400 kB',
  },
];
