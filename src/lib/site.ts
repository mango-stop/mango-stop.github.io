export const SITE_TITLE = 'Research Log';
export const SITE_DESCRIPTION =
  '학부연구생의 일기, 논문 리뷰, 프로젝트 진행 기록을 남기는 공간입니다.';

export const CATEGORIES = {
  diary: { label: 'Diary', slug: 'diary', color: '#d97706' },
  'paper-review': { label: 'Papers', slug: 'paper-review', color: '#4f46e5' },
  project: { label: 'Projects', slug: 'project', color: '#059669' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
