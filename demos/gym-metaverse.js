// 갱갱중학교 가상 체육관 — 기능 소개 애니메이션 대본 (노트북, 16.5초 반복)
// 3D 화면은 HTML로 뜰 수 없어서, 실제 체육관을 '혼자 하기'로 조작하며 녹화한 화면에서 뽑은 사진을 넘겨 보여 줍니다.
(function () {
  const DIR = 'demos/gym-metaverse/';
  // 구간: [사진 이름, 장 수, 시작 시각, 초당 장 수]
  const SEQ = {
    enter: ['enter', 1, 0, 1],
    walk:  ['turn', 25, 2.2, 6],
    jump:  ['jump', 12, 6.4, 6],
    look:  ['look', 10, 8.4, 2],
  };
  const END = 13.6;
  const ends = { enter: 2.2, walk: 6.4, jump: 8.4, look: END };
  DemoKit.define('gym-metaverse', {
    device: 'laptop',
    label: '가상 체육관에 입장해 아바타로 돌아다니고, 점프하고, 아바타를 꾸미는 예시 애니메이션',
    tag: '실제 체육관 화면 · 혼자 하기 모드',
    duration: 16.5,
    steps: ['닉네임만 넣고 바로 입장 (설치·로그인 없음)', '키보드·조이스틱으로 체육관 돌아다니기', '점프·잡기·던지기로 종목 동작 체험', '머리·신발·등번호로 아바타 꾸미기'],
    timeline: [
      { at: 0, step: 0, cap: '입장' },
      { at: 2.2, step: 1, cap: '체육관 돌아다니기' },
      { at: 6.4, step: 2, cap: '스페이스 · 점프' },
      { at: 8.4, step: 3, cap: '👕 꾸미기' },
      { at: END, step: -1, cap: '' },
    ],
    holds: [1.2, 4.6, 7.0, 10.5, 15],
    end: { at: END, title: '갱갱중학교<br>가상 체육관', sub: '방 코드만 같으면<br>우리 반 친구들과 함께' },
    html: '',
    setup(screen) {
      const sc = {};
      for (const [k, [name, count]] of Object.entries(SEQ)) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'position:absolute;inset:0;opacity:0;visibility:hidden;background:#cfdccf';
        const img = document.createElement('img');
        img.alt = ''; img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
        const srcs = Array.from({ length: count }, (_, i) => `${DIR}${name}-${String(i + 1).padStart(2, '0')}.jpg`);
        srcs.forEach((s) => { const pre = new Image(); pre.src = s; }); // 미리 받아 두기
        img.src = srcs[0];
        wrap.appendChild(img); screen.appendChild(wrap);
        sc[k] = { wrap, img, srcs, cur: 0 };
      }
      // 누르는 위치 표시용 (사진 속 버튼 자리)
      const spot = (left, top) => { const d = document.createElement('div'); d.style.cssText = `position:absolute;left:${left}%;top:${top}%;width:1px;height:1px`; screen.appendChild(d); return d; };
      sc.enterBtn = spot(50, 56);
      sc.randomBtn = spot(87.5, 7.5);
      return sc;
    },
    render(t, sc, k) {
      for (const [key, [, count, start, fps]] of Object.entries(SEQ)) {
        const s = sc[key];
        k.show(s.wrap, t, start, ends[key], 0.2);
        const i = Math.min(count - 1, Math.max(0, Math.floor((t - start) * fps)));
        if (i !== s.cur) { s.cur = i; s.img.src = s.srcs[i]; }
      }
      k.tap(sc.enterBtn, 1.5);
      [8.9, 10.4, 11.9].forEach((x) => k.tap(sc.randomBtn, x));
    },
  });
})();
