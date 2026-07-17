// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  // TODO: GitHub repo 생성 후 실제 값으로 변경
  // - repo가 <username>.github.io 인 경우: site만 설정, base 삭제
  // - 그 외 repo 이름인 경우: base: '/<repo-name>' 추가
  site: 'https://USERNAME.github.io',
  integrations: [pagefind()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
