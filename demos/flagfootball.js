// 플래그풋볼 수행평가 — 기능 소개 애니메이션 대본 (휴대폰, 22초 반복)
// 화면은 실제 앱을 지어낸 명단으로 조작하며 뜬 것(demos/flagfootball/*.html, 스크립트 없음)이라 디자인이 실제 앱과 같습니다.
(function () {
  const DIR = 'demos/flagfootball/';
  const SCENES = {
    rosterEmpty: 'roster-empty', rosterFilled: 'roster-filled', rosterSaved: 'roster-saved',
    passReady: 'pass-ready', passRun: 'pass-running', passDone: 'pass-done',
    stratReady: 'strat-ready', pos1: 'strat-pos1', pos2: 'strat-pos2', pos3: 'strat-pos3', pos4: 'strat-pos4', stratOk: 'strat-ok',
    rec: 'rec', recCopy: 'rec', recCopied: 'rec-copied',
  };
  // 장면별 [나타나는 시각, 사라지는 시각]
  const T = {
    rosterEmpty: [0, 1.4], rosterFilled: [1.4, 2.9], rosterSaved: [2.9, 4.1],
    passReady: [4.1, 5.5], passRun: [5.5, 9.0], passDone: [9.0, 10.6],
    stratReady: [10.6, 11.4], pos1: [11.4, 12.0], pos2: [12.0, 12.6], pos3: [12.6, 13.2], pos4: [13.2, 14.2], stratOk: [14.2, 15.8],
    rec: [15.8, 17.4], recCopy: [17.4, 18.4], recCopied: [18.4, 20.0],
  };
  // 장면마다 화면을 어디까지 내려서 보여 줄지 (그 요소가 화면 위쪽에 오도록)
  const SCROLL = {
    passReady: ['#pairBox', 8], passRun: ['#board', 8], passDone: ['#board', 8],
    stratReady: ['#playTabs', 8], pos1: ['#playTabs', 8], pos2: ['#playTabs', 8], pos3: ['#playTabs', 8], pos4: ['#playTabs', 8], stratOk: ['#playTabs', 8],
    recCopy: ['#copyAllBtn', 260], recCopied: ['#copyAllBtn', 260],
  };
  const COUNT_AT = [5.95, 6.2, 6.45, 6.7, 6.95, 7.2, 7.45, 7.7, 7.95, 8.2, 8.45]; // 2개째부터 12개째까지 누르는 시각
  const scale = (n) => (n >= 36 ? 50 : n >= 31 ? 45 : n >= 26 ? 40 : n >= 21 ? 35 : n >= 16 ? 30 : n >= 11 ? 25 : 20);
  const POS = [['박구름', 'QB'], ['최별빛', 'C'], ['정새봄', 'RB'], ['한여름', 'W2']];

  DemoKit.define('flagfootball', {
    device: 'phone',
    label: '플래그풋볼 수행평가 앱으로 명단을 넣고, 패스와 공격 전략을 채점하고, 기록을 시트로 옮기는 예시 애니메이션',
    duration: 22.6,
    steps: ['명단을 붙여 넣으면 준비 끝', '타이머를 켜고 성공할 때마다 톡', '포지션을 고르고 ○/×로 작전 판정', '기록은 구글 시트로 한 번에 복사'],
    timeline: [
      { at: 0, step: 0, cap: '명단 탭' },
      { at: 4.1, step: 1, cap: '패스 탭 · 패스&캐치 평가' },
      { at: 10.6, step: 2, cap: '전략 탭 · 공격 전략 평가' },
      { at: 15.8, step: 3, cap: '기록 탭' },
      { at: 20.0, step: -1, cap: '' },
    ],
    holds: [3.6, 8.6, 15.2, 19.4, 21.5],
    end: { at: 20.0, title: '플래그풋볼<br>수행평가', sub: '운동장에서 휴대폰 하나로<br>채점부터 기록까지' },
    html: '',
    setup(screen) {
      const sc = DemoKit.kit.loadScenes(screen, Object.fromEntries(Object.entries(SCENES).map(([k, f]) => [k, DIR + f + '.html'])));
      for (const [name, [sel, margin]] of Object.entries(SCROLL)) {
        sc[name].onready = (d) => {
          const el = d.querySelector(sel);
          if (el) d.defaultView.scrollTo(0, el.getBoundingClientRect().top + d.defaultView.scrollY - margin);
        };
      }
      return sc;
    },
    render(t, sc, k) {
      for (const [name, [a, b]] of Object.entries(T)) k.show(sc[name].wrap, t, a, b, 0.25);
      const D = (name) => sc[name].doc();
      const $ = (name, sel) => { const d = D(name); return d ? d.querySelector(sel) : null; };
      const tap = (name, sel, at) => { const el = $(name, sel); if (el) k.tap(el, at); };

      // 1. 명단: 칸에 붙여 넣기 → 저장
      tap('rosterEmpty', '#rosterIn', 0.7);
      tap('rosterFilled', '#rosterSave', 2.3);

      // 2. 패스: 시작 → 성공할 때마다 톡 → 시간 끝 → 저장
      tap('passReady', '#startBtn', 4.9);
      const run = D('passRun');
      if (run) {
        const n = 1 + COUNT_AT.filter((x) => t >= x).length;
        const left = Math.max(1, 29 - Math.floor(Math.max(0, t - 5.5) * 6));
        run.getElementById('countText').textContent = n;
        run.getElementById('scoreText').textContent = scale(n) + '점';
        run.getElementById('timeText').textContent = `0:${String(left).padStart(2, '0')}`;
        COUNT_AT.forEach((x) => k.tap(run.getElementById('countBtn'), x - 0.05));
      }
      tap('passDone', '#saveBtn', 10.0);

      // 3. 전략: 조원마다 포지션 → ○ 성공 → 저장
      POS.forEach(([who, pos], i) => {
        const at = [11.1, 11.7, 12.3, 12.9][i];
        tap(i === 0 ? 'stratReady' : 'pos' + i, `#posGrid button[aria-label="${who} ${pos}"]`, at);
      });
      tap('pos4', '.seg .ok', 13.9);
      tap('stratOk', '#stSave', 15.3);

      // 4. 기록: 전체 기록 보기 → 시트용 기록 복사
      tap('recCopy', '#copyAllBtn', 18.0);
    },
  });
})();
