const normalizeTeamName = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();

export const ALLEN_MARTIN_LEAD = Object.freeze({
  id: 'allen-martin-local',
  name: 'Allen Martin',
  detail: 'Full Stack Developer, 2026 - Current',
  role: 'BS in Computer Science, University of Houston',
  isLocalProfile: true,
});

export const isAllenMartin = (value) => normalizeTeamName(value) === 'allen martin';

export const buildStudentLeads = (cmsLeads = []) => [
  ALLEN_MARTIN_LEAD,
  ...cmsLeads.filter((lead) => !isAllenMartin(lead?.name)),
];

export const buildStudentCollaborators = (cmsCollaborators = []) => cmsCollaborators
  .filter((collaborator) => !isAllenMartin(collaborator?.caption));
