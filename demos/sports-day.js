// 체육대회 원앱 — 기능 소개 애니메이션 대본 (노트북, 19.5초 반복)
// 화면은 저장소의 개발용 가짜 Firebase(에뮬레이터)에서 앱 안의 '예시 대회(2026 샘플중학교)'를 조작하며 뜬 것
// (demos/sports-day/*.html, 스크립트 없음)입니다.
(function () {
  const DIR = 'demos/sports-day/';
  // 장면: [화면 파일, 나타나는 시각, 사라지는 시각]
  const S = {
    home:   ['home', 0, 2.0],
    run:    ['run', 2.0, 3.8],
    done:   ['run-done', 3.8, 5.0],
    board:  ['board', 5.0, 7.2],
    newb:   ['bracket-new', 7.2, 8.6],
    bracket:['bracket', 8.6, 9.8],
    input:  ['match-input', 9.8, 11.4],
    after:  ['bracket-after', 11.4, 12.8],
    scores: ['scores', 12.8, 14.6],
    pub:    ['public', 14.6, 16.6],
  };
  const find = (d, sel, text) => d && [...d.querySelectorAll(sel)].find((e) => e.textContent.includes(text));
  DemoKit.define('sports-day', {
    device: 'laptop',
    label: '체육대회 진행표를 넘기면 전광판이 바뀌고, 대진표를 만들어 결과를 넣으면 점수와 학생용 대진표가 함께 바뀌는 예시 애니메이션',
    tag: '예시 화면 · 앱 안의 예시 대회(샘플중학교)예요',
    duration: 19.5,
    steps: ['진행표에서 [완료]만 누르면 전광판이 다음 순서로', '무작위 추첨으로 대진표 만들기', '경기 결과 입력 (심판 선생님은 휴대폰으로)', '반별 총점은 선생님만, 대진표는 학생과 공유'],
    timeline: [
      { at: 0, step: 0, cap: '관리자 홈' },
      { at: 2.0, step: 0, cap: '⏱ 진행표' },
      { at: 5.0, step: 0, cap: '📺 전광판 (TV에 띄우는 화면)' },
      { at: 7.2, step: 1, cap: '🏆 경기 · 대진표' },
      { at: 9.8, step: 2, cap: '경기 결과 입력' },
      { at: 12.8, step: 3, cap: '🔒 점수 (선생님만)' },
      { at: 14.6, step: 3, cap: '📋 학생용 대진표' },
      { at: 16.6, step: -1, cap: '' },
    ],
    holds: [3.0, 6.0, 8.0, 10.6, 12.2, 13.8, 15.8, 18],
    end: { at: 16.6, title: '체육대회<br>원앱', sub: '진행표·전광판·대진표·점수를<br>한 앱에서' },
    html: '',
    setup(screen) {
      return DemoKit.kit.loadScenes(screen, Object.fromEntries(Object.entries(S).map(([k, v]) => [k, DIR + v[0] + '.html'])), 960);
    },
    render(t, sc, k) {
      for (const [name, v] of Object.entries(S)) k.show(sc[name].wrap, t, v[1], v[2], 0.25);
      const tap = (el, at) => { if (el) k.tap(el, at); };
      const d = (n) => sc[n].doc();
      tap(find(d('run'), 'button', '완료'), 3.2);
      tap(find(d('newb'), 'button', '대진표 만들기'), 8.1);
      tap(find(d('bracket'), 'button', '8강 1경기') || find(d('bracket'), 'div', '8강 1경기'), 9.3);
      tap(find(d('input'), 'button', '결과 저장'), 10.9);
    },
  });
})();
