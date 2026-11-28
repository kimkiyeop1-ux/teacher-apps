// AI 지시 코칭 프롬프트 — 기능 소개 애니메이션 대본 (노트북, 19.5초 반복)
// 화면은 실제 페이지를 '예시' 내용으로 조작하며 뜬 것(demos/ai-coach/*.html, 스크립트 없음)입니다.
(function () {
  const DIR = 'demos/ai-coach/';
  // 장면 이름: [화면 파일, 나타나는 시각, 사라지는 시각, 맨 위에 올 요소, 위쪽 여백]
  const S = {
    top:       ['top', 0, 2.2],
    prompt:    ['top', 2.2, 3.4, '#promptA', 70],
    copied:    ['copied', 3.4, 4.8, '#promptA', 70],
    paste:     ['top', 4.8, 6.0, '.paste', 20],
    pasted:    ['pasted', 6.0, 7.6, '.paste', 20],
    report:    ['rendered', 7.6, 10.6, '#report', 0],
    cards:     ['rendered', 10.6, 12.6, '#filters', 10],
    filtered:  ['filtered', 12.6, 14.6, '#filters', 10],
    scores:    ['rendered', 14.6, 16.8, '#scores', 60],
  };
  DemoKit.define('ai-coach', {
    device: 'laptop',
    label: '코칭 프롬프트를 복사하고, AI 답변을 붙여 넣어 맞춤 피드백 페이지를 만드는 예시 애니메이션',
    tag: '예시 화면 · 페이지에 들어 있는 예시 피드백이에요',
    duration: 19.5,
    steps: ['코칭 프롬프트를 복사해 쓰는 AI에 붙여 넣기', 'AI 답변을 그대로 붙여 넣기', '나만의 피드백 페이지 완성', '유형별로 골라 보고 명확도 점수 확인'],
    timeline: [
      { at: 0, step: 0, cap: '① 코칭 프롬프트 복사' },
      { at: 4.8, step: 1, cap: '② AI 답변 붙여 넣기' },
      { at: 7.6, step: 2, cap: '맞춤 피드백 페이지' },
      { at: 12.6, step: 3, cap: '유형 골라 보기 · 지시별 명확도' },
      { at: 16.8, step: -1, cap: '' },
    ],
    holds: [3.9, 6.9, 9.5, 13.5, 15.8, 18.2],
    end: { at: 16.8, title: 'AI 지시<br>코칭 프롬프트', sub: 'ChatGPT·Gemini·Claude 어디서든<br>내 지시 습관을 맞춤 피드백으로' },
    html: '',
    setup(screen) {
      const sc = DemoKit.kit.loadScenes(screen, Object.fromEntries(Object.entries(S).map(([k, v]) => [k, DIR + v[0] + '.html'])), 960);
      for (const [k, v] of Object.entries(S)) {
        if (!v[3]) continue;
        sc[k].onready = (d) => { const el = d.querySelector(v[3]); if (el) d.defaultView.scrollTo(0, el.getBoundingClientRect().top + d.defaultView.scrollY - v[4]); };
      }
      return sc;
    },
    render(t, sc, k) {
      for (const [name, v] of Object.entries(S)) k.show(sc[name].wrap, t, v[1], v[2], 0.25);
      const tap = (name, sel, at) => { const d = sc[name].doc(); const el = d && d.querySelector(sel); if (el) k.tap(el, at); };
      tap('prompt', '.copy[data-target="promptA"]', 2.85);
      tap('paste', '#pasteBox', 5.4);
      tap('pasted', '#renderBtn', 7.1);
      tap('cards', '.chip[data-f="vague"]', 12.1);
    },
  });
})();
