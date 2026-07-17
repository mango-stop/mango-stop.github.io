export const SITE_TITLE = '연구실 일지';
export const SITE_DESCRIPTION =
  '학부연구생 생활 일기, 논문 리뷰, 프로젝트 기록을 담는 블로그';

export const CATEGORIES = {
  diary: { label: '일기', slug: 'diary' },
  'paper-review': { label: '논문 리뷰', slug: 'paper-review' },
  project: { label: '프로젝트', slug: 'project' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
