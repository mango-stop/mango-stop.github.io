# 학부연구생 블로그 구축 계획

**상태:** pending approval (실행 승인 대기)
**작성일:** 2026-07-18
**대상 디렉토리:** /Users/myung_sejin/Desktop/Project/my_blog

## 1. 요구사항 요약

- **목적:** 학부연구생 생활 일기, 논문 리뷰, 프로젝트 진행 기록을 담는 포트폴리오 겸 블로그
- **호스팅:** GitHub Pages (무료, 서버/DB 없음)
- **글 작성:** 웹 관리자 페이지(`/admin`)에서 작성·수정·삭제, 관리자(GitHub 계정 소유자)만 접근 가능
- **프레임워크:** Astro (React 컴포넌트 사용 가능)
- **기능:** 수식 렌더링(KaTeX), 태그 + 검색, 다크모드, 댓글(giscus), 게시물 관리(CMS)

## 2. 아키텍처 결정

| 항목 | 선택 | 이유 |
|------|------|------|
| 사이트 생성 | Astro (정적 빌드) | 콘텐츠 특화, 마크다운/수식/코드 하이라이팅 기본 지원, GitHub Pages 궁합 |
| 콘텐츠 저장 | repo 내 마크다운 (`src/content/posts/*.md`) | DB 불필요, git이 곧 백업/히스토리 |
| 관리자 편집 | Sveltia CMS (`/admin`) — git 기반 CMS | 정적 사이트에서 웹 편집 UI 제공, 저장 시 repo에 커밋 → 자동 재배포 |
| 인증 | GitHub 로그인 (repo 쓰기 권한자만 편집 가능) | 별도 회원 시스템 불필요, "관리자만 편집" 요구 충족 |
| 배포 | GitHub Actions → GitHub Pages | push 시 자동 빌드·배포 |
| 검색 | Pagefind | 정적 사이트용 클라이언트 검색, 서버 불필요 |
| 댓글 | giscus (GitHub Discussions) | 무료, 서버 불필요 |
| 수식 | remark-math + rehype-katex | 논문 리뷰의 LaTeX 수식 렌더링 |

## 3. 구현 단계

### Phase 1: 프로젝트 초기화 + 기본 블로그
1. `npm create astro@latest` 로 프로젝트 생성 (현재 디렉토리, TypeScript)
2. git 저장소 초기화, GitHub repo 생성 및 연결
3. 콘텐츠 컬렉션 정의 — `src/content.config.ts`
   - 스키마: `title`, `description`, `pubDate`, `category` (`diary` | `paper-review` | `project`), `tags[]`, `draft`
4. 기본 레이아웃/페이지
   - `src/layouts/BaseLayout.astro` — 공통 헤더/푸터/네비게이션
   - `src/pages/index.astro` — 최근 글 목록
   - `src/pages/posts/[...slug].astro` — 글 상세
   - `src/pages/about.astro` — 자기소개(포트폴리오)
5. 샘플 글 3개 작성 (일기/논문리뷰/프로젝트 각 1개, 수식·코드 포함)

### Phase 2: 콘텐츠 기능
6. KaTeX 수식 — `astro.config.mjs`에 `remark-math`, `rehype-katex` 연동, 수식 포함 샘플로 검증
7. 코드 하이라이팅 — Astro 내장 Shiki 테마 설정 (다크모드 대응 dual theme)
8. 카테고리/태그 페이지 — `src/pages/categories/[category].astro`, `src/pages/tags/[tag].astro`
9. 다크모드 — 토글 버튼 + `localStorage` 저장 + `prefers-color-scheme` 기본값, FOUC 방지 인라인 스크립트
10. 검색 — Pagefind 연동 (`astro-pagefind`), 검색 UI 페이지

### Phase 3: 배포
11. `astro.config.mjs`에 `site`/`base` 설정 (repo 이름에 따라 결정)
12. GitHub Actions 워크플로 — `.github/workflows/deploy.yml` (공식 `withastro/action` 사용)
13. GitHub Pages 활성화 (Settings → Pages → GitHub Actions 소스), 배포 확인

### Phase 4: 관리자 CMS
14. Sveltia CMS 설치 — `public/admin/index.html` + `public/admin/config.yml`
    - backend: `github`, 컬렉션: posts (카테고리·태그·draft 필드 매핑)
15. 인증 설정 — 1차: GitHub PAT(개인 액세스 토큰) 로그인 (설정 5분, 본인만 사용 가능)
    - 선택 확장: Cloudflare Worker OAuth 프록시로 "GitHub로 로그인" 버튼화
16. `/admin`에서 글 작성 → 커밋 → 자동 배포 전체 흐름 검증

### Phase 5: 댓글
17. GitHub repo Discussions 활성화 + giscus 앱 설치
18. 글 상세 페이지에 giscus 컴포넌트 추가 (다크모드 테마 연동)

## 4. 수용 기준 (테스트 가능)

- [ ] `npm run build` 가 오류 없이 완료된다
- [ ] 배포된 사이트 URL에서 홈·글 상세·카테고리·태그·about 페이지가 열린다
- [ ] `$E=mc^2$` 형태의 인라인/블록 수식이 렌더링된다
- [ ] 코드 블록에 문법 하이라이팅이 적용된다 (라이트/다크 모두)
- [ ] 다크모드 토글이 동작하고 새로고침 후에도 유지된다
- [ ] 검색창에 키워드 입력 시 해당 글이 결과에 나타난다
- [ ] 태그/카테고리 클릭 시 해당 글 목록이 필터링된다
- [ ] `/admin`에서 로그인 후 글 작성·수정·삭제가 가능하고, 저장 시 수 분 내 사이트에 반영된다
- [ ] 로그인하지 않은 사용자는 `/admin`에서 콘텐츠를 수정할 수 없다
- [ ] 글 하단에서 GitHub 계정으로 댓글을 남길 수 있다
- [ ] `draft: true` 글은 사이트에 노출되지 않는다
- [ ] main 브랜치 push 시 GitHub Actions가 자동으로 재배포한다

## 5. 리스크와 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| GitHub Pages base path (`/repo-name/`) 문제로 링크·CSS 깨짐 | 중 | repo를 `<username>.github.io`로 만들거나 `base` 설정 + 모든 링크에 base 적용 검증 |
| Sveltia CMS OAuth는 GitHub Pages 단독으로 불가 (서버리스 함수 필요) | 중 | 1차 PAT 로그인으로 회피, 필요 시 무료 Cloudflare Worker 추가 |
| giscus는 public repo + Discussions 필요 | 저 | repo를 public으로 생성 (포트폴리오 목적상 public이 유리) |
| public repo 특성상 draft 글도 소스에서는 보임 | 저 | 민감한 내용은 로컬 보관 후 완성 시 커밋하는 규칙 안내 |
| CMS 커밋과 로컬 작업 충돌 | 저 | 작업 전 `git pull` 습관화, CMS는 main 직접 커밋 |

## 6. 검증 단계

1. 로컬: `npm run dev` 로 전 페이지 육안 확인, `npm run build && npm run preview` 로 프로덕션 빌드 확인
2. 배포: Actions 로그 성공 확인 → 실제 URL 접속 → 수용 기준 체크리스트 전수 확인
3. CMS 왕복 테스트: `/admin`에서 테스트 글 발행 → 사이트 반영 확인 → 삭제 → 사라짐 확인
4. 모바일 뷰포트(375px) 레이아웃 확인

## 7. 선행 준비물 (사용자 제공 필요)

- GitHub 계정 및 repo 이름 결정 (`<username>.github.io` 권장)
- CMS 로그인용 GitHub PAT 발급 (Phase 4 시점에 안내)
