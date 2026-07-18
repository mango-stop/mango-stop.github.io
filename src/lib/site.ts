export const SITE_TITLE = 'Research Log';
export const SITE_DESCRIPTION =
  '학부연구생의 일기, 논문 리뷰, 프로젝트 진행 기록을 남기는 공간입니다.';

export const CATEGORIES = {
  diary: { label: 'Diary', slug: 'diary', color: '#d97706' },
  'paper-review': { label: 'Papers', slug: 'paper-review', color: '#4f46e5' },
  project: { label: 'Projects', slug: 'project', color: '#059669' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

/** 본문 마크다운에서 첫 번째 이미지 URL을 찾는다 (대표 이미지 폴백용) */
export function firstImageFromMarkdown(markdown: string): string | null {
  const md = markdown.match(/!\[[^\]]*\]\(\s*(\S+?)(?:\s+"[^"]*")?\s*\)/);
  if (md) return md[1];
  const html = markdown.match(/<img[^>]+src=["']([^"']+)["']/);
  return html ? html[1] : null;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
