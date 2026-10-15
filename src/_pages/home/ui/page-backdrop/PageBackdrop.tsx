import { Box } from 'goniui';

/** Organic contour line, scaled and rotated into concentric rings. */
const CONTOUR_PATH =
  'M100,0 C100,55 60,95 5,98 C-50,101 -105,60 -98,5 C-92,-48 -55,-96 0,-95 C58,-94 100,-52 100,0Z';

const UPPER_RINGS = [
  'rotate(0) scale(0.6)',
  'rotate(8) scale(1.1,1)',
  'rotate(16) scale(1.7,1.5)',
  'rotate(24) scale(2.3,2)',
  'rotate(30) scale(3,2.55)',
  'rotate(36) scale(3.8,3.15)',
  'rotate(41) scale(4.7,3.8)',
  'rotate(45) scale(5.7,4.5)',
  'rotate(48) scale(6.8,5.3)',
];

const LOWER_RINGS = [
  'rotate(-20) scale(0.8,0.6)',
  'rotate(-26) scale(1.5,1.1)',
  'rotate(-32) scale(2.3,1.7)',
  'rotate(-37) scale(3.2,2.35)',
  'rotate(-41) scale(4.2,3.05)',
  'rotate(-44) scale(5.3,3.8)',
];

interface ContourRingsProps {
  origin: string;
  rings: readonly string[];
  className: string;
}

function ContourRings({ origin, rings, className }: ContourRingsProps) {
  return (
    <g transform={origin} className={className}>
      {rings.map((ring) => (
        <path key={ring} vectorEffect="non-scaling-stroke" transform={ring} d={CONTOUR_PATH} />
      ))}
    </g>
  );
}

/**
 * Decorative layers behind the top of the page: two soft glows, topographic contours and a
 * crosshair grid, the last two drifting with the scroll (parallax).
 */
export function PageBackdrop() {
  return (
    <Box aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
      <Box className="radial-glow-indigo absolute -top-55 left-1/2 h-175 w-275 -translate-x-3/5" />
      <Box className="radial-glow-cyan absolute top-30 -right-50 size-150" />
      <Box className="parallax-slow mask-fade-bottom absolute inset-x-0 top-0 h-275">
        <svg
          aria-hidden="true"
          width="100%"
          height="100%"
          viewBox="0 0 1440 1100"
          preserveAspectRatio="xMidYMin slice"
          className="fill-none stroke-1"
        >
          <ContourRings
            origin="translate(1180 330)"
            rings={UPPER_RINGS}
            className="stroke-contour-indigo"
          />
          <ContourRings
            origin="translate(140 820)"
            rings={LOWER_RINGS}
            className="stroke-contour-cyan"
          />
        </svg>
      </Box>
      <Box className="parallax-fast absolute inset-x-0 top-0 h-250 bg-crosshair" />
    </Box>
  );
}
