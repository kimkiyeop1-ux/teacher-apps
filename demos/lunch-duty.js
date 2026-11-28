// 급식지도 알리미 — 기능 소개 애니메이션 대본 (휴대폰, 14초 반복)
// 화면은 실제 앱 화면에 가짜 서버 응답(지어낸 선생님 이름)을 붙여 뜬 것(demos/lunch-duty/*.html, 스크립트 없음)입니다.
// 휴대폰 알림 배너는 앱 밖(휴대폰)의 화면이라 따로 그렸습니다.
(function () {
  const DIR = 'demos/lunch-duty/';
  const S = {
    setup:  ['setup', 0, 2.4],
    g3:     ['g3-active', 2.4, 5.0],
    g3done: ['g3-done', 5.0, 6.8],
    g2:     ['g2-turn', 6.8, 11.2],
  };
  const NOTI = `<div class="ld-noti" style="position:absolute;left:10px;right:10px;top:10px;z-index:10;background:#fff;border-radius:16px;padding:11px 13px;
    box-shadow:0 10px 24px rgba(0,0,0,.22);display:flex;flex-direction:column;gap:2px;opacity:0;font-family:'Noto Sans KR','Apple SD Gothic Neo',sans-serif;color:#172033">
    <div style="font-size:10px;font-weight:700;color:#5B6474">급식지도 알리미 · 지금</div>
    <div style="font-size:14px;font-weight:800">3학년 급식지도가 끝났어요</div>
    <div style="font-size:12px;color:#3A4354">2학년 학생들과 출발해 주세요.</div></div>`;
  DemoKit.define('lunch-duty', {
    device: 'phone',
    label: '3학년 당번 선생님이 완료를 누르면 2학년 선생님들 휴대폰에 알림이 가는 예시 애니메이션',
    tag: '예시 화면 · 선생님 이름은 모두 지어낸 이름이에요',
    duration: 14,
    steps: ['처음 한 번만 학년과 이름 고르기', '오늘 당번과 학급 입장 순서 확인', '급식지도가 끝나면 완료 누르기', '다음 학년 선생님들께 바로 알림'],
    timeline: [
      { at: 0, step: 0, cap: '처음 한 번만' },
      { at: 2.4, step: 1, cap: '3학년 당번 선생님 휴대폰' },
      { at: 4.0, step: 2, cap: '3학년 당번 선생님 휴대폰' },
      { at: 6.8, step: 3, cap: '2학년 당번 선생님 휴대폰' },
      { at: 11.2, step: -1, cap: '' },
    ],
    holds: [1.6, 3.4, 6.0, 8.2, 12.6],
    end: { at: 11.2, title: '급식지도<br>알리미', sub: '전화 돌리지 않아도<br>다음 학년에 알림이 가요' },
    html: NOTI,
    setup(screen) {
      const sc = DemoKit.kit.loadScenes(screen, Object.fromEntries(Object.entries(S).map(([k, v]) => [k, DIR + v[0] + '.html'])));
      sc.noti = screen.querySelector('.ld-noti');
      return sc;
    },
    render(t, sc, k) {
      for (const [name, v] of Object.entries(S)) k.show(sc[name].wrap, t, v[1], v[2], 0.25);
      const tap = (name, sel, at) => { const d = sc[name].doc(); const el = d && d.querySelector(sel); if (el) k.tap(el, at); };
      tap('setup', '#startBtn', 1.8);
      tap('g3', '[data-done="3"]', 4.3);
      // 휴대폰 알림 배너: 위에서 내려왔다가 올라감
      const nIn = k.eo(k.seg(t, 7.2, 7.6)), nOut = k.seg(t, 9.4, 9.75);
      sc.noti.style.opacity = t < 7.2 || t > 9.75 ? 0 : 1;
      sc.noti.style.transform = `translateY(${-140 * (1 - nIn) - 140 * nOut * nOut}px)`;
    },
  });
})();
