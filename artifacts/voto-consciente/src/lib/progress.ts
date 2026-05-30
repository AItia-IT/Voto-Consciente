export function getQuizScore(): number {
  return Number(localStorage.getItem('quizScore')) || 0;
}

export function addQuizScore(pts: number): void {
  const current = getQuizScore();
  localStorage.setItem('quizScore', String(current + pts));
}

export function getQuizMedals(): string[] {
  try {
    return JSON.parse(localStorage.getItem('quizMedals') || '[]');
  } catch {
    return [];
  }
}

export function addMedal(medal: string): void {
  const medals = getQuizMedals();
  if (!medals.includes(medal)) {
    medals.push(medal);
    localStorage.setItem('quizMedals', JSON.stringify(medals));
  }
}

export function getAcademyXP(): number {
  return Number(localStorage.getItem('academyXP')) || 0;
}

export function addXP(xp: number): void {
  const current = getAcademyXP();
  localStorage.setItem('academyXP', String(current + xp));
}

export function getMissionsCompleted(): number[] {
  try {
    return JSON.parse(localStorage.getItem('missionsCompleted') || '[]');
  } catch {
    return [];
  }
}

export function completeMission(id: number): void {
  const missions = getMissionsCompleted();
  if (!missions.includes(id)) {
    missions.push(id);
    localStorage.setItem('missionsCompleted', JSON.stringify(missions));
  }
}

export function getUserLevel(): string {
  const xp = getAcademyXP();
  if (xp <= 200) return 'Novato';
  if (xp <= 500) return 'Iniciante';
  return 'Cidadão';
}
