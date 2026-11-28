// 얼티미트 학급 대항 리그전 — 기능 소개 애니메이션 대본 (노트북, 18초 반복)
// 화면은 원본 앱을 내장 예시 대회 + 지어낸 이름으로 조작하며 뜬 것(demos/ultimate-league/*.html, 스크립트 없음)입니다.
(function () {
  const DIR = 'demos/ultimate-league/';
  // 장면: [화면 파일, 나타나는 시각, 사라지는 시각, 맨 위에 올 요소, 위쪽 여백]
  const S = {
    draw:    ['draw', 0, 2.4],
    play:    ['play', 2.4, 4.2, '[data-panel="play"] .goal', 330],
    scorer:  ['play-scorer', 4.2, 5.6, '[data-panel="play"] .goal', 330],
    assist:  ['play-assist', 5.6, 7.0, '[data-panel="play"] .goal', 330],
    after:   ['play-after', 7.0, 9.0, '[data-panel="play"] .goal', 330],
    results: ['results', 9.0, 11.0],
    players: ['players', 11.0, 12.8],
    board:   ['board', 12.8, 15.0, '#sheet', 40],
  };
  const byText = (d, sel, text) => d && [...d.querySelectorAll(sel)].find((e) => e.textContent.includes(text));
  DemoKit.define('ultimate-league', {
    device: 'laptop',
    label: '학급 대항 얼티미트 토너먼트의 대진 편성, 득점·도움 기록, 결과 집계, 게시용 결과지를 보여 주는 예시 애니메이션',
    duration: 18,
    steps: ['반 수에 맞춘 대진표와 점심 일정 자동 편성', '득점·도움 학생을 번호로 바로 기록', '대진표·순위·득점왕이 저절로 정리', '학년게시판용 결과지 바로 출력'],
    timeline: [
      { at: 0, step: 0, cap: '대진 편성' },
      { at: 2.4, step: 1, cap: '경기 진행 · 득점 기록' },
      { at: 9.0, step: 2, cap: '결과 · 개인 기록' },
      { at: 12.8, step: 3, cap: '게시용 출력' },
      { at: 15.0, step: -1, cap: '' },
    ],
    holds: [1.5, 5.0, 8.2, 10.2, 14.0, 16.5],
    end: { at: 15.0, title: '얼티미트<br>학급 대항 리그전', sub: '대진·일정·점수·개인 기록부터<br>게시용 결과지까지 한 화면에서' },
    html: '',
    setup(screen) {
      const sc = DemoKit.kit.loadScenes(screen, Object.fromEntries(Object.entries(S).map(([k, v]) => [k, DIR + v[0] + '.html'])), 960);
      for (const [k, v] of Object.entries(S)) {
        sc[k].onready = (d) => {
          const el = v[3] && d.querySelector(v[3]);
          d.defaultView.scrollTo(0, el ? el.getBoundingClientRect().top + d.defaultView.scrollY - v[4] : 0);
        };
      }
      return sc;
    },
    render(t, sc, k) {
      for (const [name, v] of Object.entries(S)) k.show(sc[name].wrap, t, v[1], v[2], 0.25);
      const tapEl = (el, at) => { if (el) k.tap(el, at); };
      const d = (n) => sc[n].doc();
      tapEl(d('play') && d('play').querySelector('[data-panel="play"] .goal'), 3.6);
      tapEl(byText(d('scorer'), '#dlgPick button', '이바다'), 5.0);
      tapEl(byText(d('assist'), '#dlgPick button', '신나은'), 6.4);
    },
  });
})();
