// 보건실 침상 알리미 — 기능 소개 애니메이션 대본 (휴대폰, 15초 반복)
// 화면은 '체험용' 원본(실제 서버 코드 + 가짜 시트)을 조작하며 뜬 것(demos/health-bed/*.html, 스크립트 없음)입니다. 학번은 예시입니다.
(function () {
  const DIR = 'demos/health-bed/';
  // 장면: [화면 파일, 나타나는 시각, 사라지는 시각]
  const S = {
    start:    ['staff-start', 0, 1.8],
    typed:    ['staff-typed', 1.8, 3.4],
    sent:     ['staff-sent', 3.4, 5.4],
    wait:     ['nurse-wait', 5.4, 7.8],
    accepted: ['nurse-accepted', 7.8, 9.8],
    ok:       ['staff-ok', 9.8, 12.2],
  };
  DemoKit.define('health-bed', {
    device: 'phone',
    label: '선생님이 학번으로 침상 안정을 요청하고, 보건선생님이 수락하면 알림이 오는 예시 애니메이션',
    tag: '예시 화면 · 학번은 예시예요',
    duration: 15,
    steps: ['학번 4자리만 넣고 요청 보내기', '보건선생님 화면에 바로 새 요청', '수락 한 번으로 빈 침상 배정', '요청한 선생님께 수락 알림'],
    timeline: [
      { at: 0, step: 0, cap: '선생님 휴대폰 · 2-3 담임' },
      { at: 5.4, step: 1, cap: '보건선생님 화면' },
      { at: 7.8, step: 2, cap: '보건선생님 화면' },
      { at: 9.8, step: 3, cap: '선생님 휴대폰 · 2-3 담임' },
      { at: 12.2, step: -1, cap: '' },
    ],
    holds: [3.0, 6.6, 9.0, 11.2, 13.6],
    end: { at: 12.2, title: '보건실<br>침상 알리미', sub: '빈 침상 확인부터 요청·수락까지<br>전화 없이 알림으로' },
    html: '',
    setup(screen) {
      return DemoKit.kit.loadScenes(screen, Object.fromEntries(Object.entries(S).map(([k, v]) => [k, DIR + v[0] + '.html'])));
    },
    render(t, sc, k) {
      for (const [name, v] of Object.entries(S)) k.show(sc[name].wrap, t, v[1], v[2], 0.25);
      const tap = (name, sel, at) => { const d = sc[name].doc(); const el = d && d.querySelector(sel); if (el) k.tap(el, at); };
      tap('start', '#sidIn', 1.0);
      tap('typed', '#reqBtn', 2.8);
      tap('wait', '[data-act="accept"]', 7.1);
    },
  });
})();
