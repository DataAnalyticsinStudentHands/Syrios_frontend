import { describe, expect, it } from 'vitest';
import {
  ALLEN_MARTIN_LEAD,
  buildStudentCollaborators,
  buildStudentLeads,
  isAllenMartin,
} from './aboutUsTeamData';

describe('About page team overrides', () => {
  it('places Allen first with the requested current profile details', () => {
    const leads = buildStudentLeads([{ id: 1, name: 'Existing Lead' }]);

    expect(leads[0]).toEqual(expect.objectContaining({
      name: 'Allen Martin',
      detail: 'Full Stack Developer, 2026 - Current',
      role: 'BS in Computer Science',
      affiliation: 'Founder, Ronin Kinetic eSports',
    }));
    expect(leads[1].name).toBe('Existing Lead');
  });

  it('prevents a future CMS lead from duplicating the local Allen profile', () => {
    const leads = buildStudentLeads([
      { id: 44, name: '  ALLEN   MARTIN ' },
      { id: 2, name: 'Another Lead' },
    ]);

    expect(leads.filter((lead) => isAllenMartin(lead.name))).toEqual([ALLEN_MARTIN_LEAD]);
    expect(leads.at(-1).name).toBe('Another Lead');
  });

  it('removes Allen from collaborators while preserving everyone else in order', () => {
    const collaborators = buildStudentCollaborators([
      { id: 1, caption: 'First Student' },
      { id: 44, caption: ' Allen Martin ' },
      { id: 2, caption: 'Second Student' },
    ]);

    expect(collaborators.map((student) => student.caption)).toEqual([
      'First Student',
      'Second Student',
    ]);
  });
});
