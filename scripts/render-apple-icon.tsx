/**
 * `pnpm icon:render`: renders `app/apple-icon.png` (180×180, the iOS home-screen icon) from
 * `app/icon.svg`, the single source of the monogram. Run it after editing the SVG and commit both.
 *
 * A committed PNG rather than an `app/apple-icon.tsx` route: with `output: 'export'`, Next emits a
 * generated icon as an extension-less `apple-icon` file (served with the wrong content type) and
 * links it without the base path. A static `app/apple-icon.png` gets both right.
 *
 * `app/icon.svg` carries no comment (Satori renders nothing when the markup holds one), so its
 * colours are documented here: fill = `--primary-500`, stroke = `--primary-foreground` in
 * `app/globals.css`. SVG favicons cannot read CSS variables: update both if the tokens change.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { ImageResponse } from 'next/og';

const SOURCE = new URL('../app/icon.svg', import.meta.url);
const TARGET = new URL('../app/apple-icon.png', import.meta.url);
const SIZE = { width: 180, height: 180 };
/** Mirrors `--primary-500` in `app/globals.css`, the fill of `app/icon.svg`. */
const TILE_COLOR = '#4f46e5';

async function renderAppleIcon(): Promise<void> {
  const svg = await readFile(SOURCE, 'utf8');
  if (svg.includes('<!--')) {
    throw new Error('app/icon.svg must not contain comments: Satori renders nothing when it does.');
  }
  const monogram = Buffer.from(svg).toString('base64');
  // iOS rounds the corners itself: the tile is full-bleed, the SVG's rounded corners fall on it.
  // Satori (`next/og`) only understands inline styles.
  const image = new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: TILE_COLOR,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori markup, not a page */}
      <img
        alt=""
        src={`data:image/svg+xml;base64,${monogram}`}
        width={SIZE.width}
        height={SIZE.height}
      />
    </div>,
    SIZE,
  );
  await writeFile(TARGET, Buffer.from(await image.arrayBuffer()));
  console.log(`Wrote ${TARGET.pathname}`);
}

await renderAppleIcon();
