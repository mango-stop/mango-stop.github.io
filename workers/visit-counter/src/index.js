/**
 * 블로그 방문자 카운터 (Cloudflare Worker + KV)
 *
 * GET /hit          → 오늘/전체 카운트 +1 후 반환 (허용된 Origin에서만 증가)
 * GET /hit?count=0  → 증가 없이 현재 값만 반환
 *
 * 응답: { "today": n, "total": n }
 *
 * 중복 방문 판정은 클라이언트(localStorage, KST 날짜 기준)가 하고,
 * 이 Worker는 요청받은 대로 세기만 한다.
 */

const ALLOWED_ORIGINS = ['https://mango-stop.github.io'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') ?? '';
    const allowed =
      ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost');

    const headers = {
      'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'GET' || url.pathname !== '/hit') {
      return new Response(JSON.stringify({ error: 'not found' }), {
        status: 404,
        headers,
      });
    }

    // 한국 시간 기준 날짜 키
    const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const dayKey = `d:${kst.toISOString().slice(0, 10)}`;

    const [total, today] = await Promise.all([
      env.COUNTS.get('total'),
      env.COUNTS.get(dayKey),
    ]);
    let totalN = parseInt(total ?? '0', 10);
    let todayN = parseInt(today ?? '0', 10);

    const shouldCount = allowed && url.searchParams.get('count') !== '0';
    if (shouldCount) {
      totalN += 1;
      todayN += 1;
      await Promise.all([
        env.COUNTS.put('total', String(totalN)),
        // 날짜 키는 3일 뒤 자동 삭제 (KV 용량 관리)
        env.COUNTS.put(dayKey, String(todayN), { expirationTtl: 60 * 60 * 24 * 3 }),
      ]);
    }

    return new Response(JSON.stringify({ today: todayN, total: totalN }), {
      headers,
    });
  },
};
