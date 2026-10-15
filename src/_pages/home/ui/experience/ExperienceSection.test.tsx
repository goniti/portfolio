import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { ExperienceSection } from './ExperienceSection';

const title = HOME_CONTENT_FIXTURE.sectionTitles.experience;
const jobs = HOME_CONTENT_FIXTURE.jobs;

describe('ExperienceSection', () => {
  it('labels each card with its sector, above the dates', () => {
    render(<ExperienceSection title={title} jobs={jobs} />);
    const label = screen.getByText('Public affairs & influence');
    const period = screen.getByText('Jul 2024 — Present');
    expect(label.compareDocumentPosition(period) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getAllByText('MedTech')).toHaveLength(2);
  });

  it('styles two jobs of the same sector alike', () => {
    render(<ExperienceSection title={title} jobs={jobs} />);
    const [first, second] = screen.getAllByText('MedTech');
    expect(first?.className).toContain('text-tint-label-emerald');
    expect(first?.className).toBe(second?.className);
  });

  it('shows the company summary under the role', () => {
    render(<ExperienceSection title={title} jobs={jobs} />);
    expect(screen.getByText(/Public affairs consultancy/)).toBeTruthy();
  });

  it('renders a job without a sector or a summary, with no label and the default tint', () => {
    const bareJobs = jobs.map((job) => ({ ...job, sector: null, summary: null }));
    const { container } = render(<ExperienceSection title={title} jobs={bareJobs} />);
    expect(screen.queryByText('MedTech')).toBeNull();
    expect(screen.queryByText(/Public affairs consultancy/)).toBeNull();
    expect(screen.getByRole('heading', { level: 3, name: 'Saper Vedere' })).toBeTruthy();
    expect(container.querySelector('.text-tint-label-emerald')).toBeNull();
    expect(container.querySelectorAll('.text-tint-label-indigo').length).toBeGreaterThan(0);
  });

  it('draws the sector top line only on cards with a sector', () => {
    const mixedJobs = jobs.map((job, index) => (index === 0 ? { ...job, sector: null } : job));
    const { container } = render(<ExperienceSection title={title} jobs={mixedJobs} />);
    expect(container.querySelectorAll('.via-current')).toHaveLength(jobs.length - 1);
  });
});
