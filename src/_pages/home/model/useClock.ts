import { useEffect, useState } from 'react';

const CLOCK_TICK_MS = 1000;

/** `HH:MM:SS` (24 h) in the given time zone. */
export function formatClock(date: Date, timeZone: string): string {
  return date.toLocaleTimeString('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * A ticking clock for `timeZone`. Empty until mounted, so the server and the first client
 * render agree.
 */
export function useClock(timeZone: string): string {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(formatClock(new Date(), timeZone));
    tick();
    const timer = window.setInterval(tick, CLOCK_TICK_MS);
    return () => window.clearInterval(timer);
  }, [timeZone]);

  return time;
}
