import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest runs without globals: unmount what each test rendered.
afterEach(() => cleanup());
