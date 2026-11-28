// demo-engine.js — 가이드 화면 위쪽의 '기능 소개 애니메이션' 엔진
// 앱마다 demos/앱이름.js 에 장면 대본을 쓰고 DemoKit.define('앱이름', {...}) 로 등록합니다.
// 엔진이 하는 일: 휴대폰·노트북 틀 그리기, 단계 목록 강조, 화면 위 설명, 누르는 동그라미,
// 마무리 카드, 반복 재생, 일시정지 버튼, '동작 줄이기' 설정 존중, 화면 밖에선 멈춤.
(function () {
  const defs = {};
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const kit = {
    // a~b 사이에서 0→1로 가는 진행도
    seg: (t, a, b) => clamp01((t - a) / (b - a)),
    eo: (x) => 1 - Math.pow(1 - x, 3),                                     // 끝이 부드러운 움직임
    eio: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), // 시작·끝이 부드러운 움직임
    // 화면(장면) 하나를 a에 나타나게, b에 사라지게
    show(el, t, a, b, d = 0.35) {
      const v = kit.eio(kit.seg(t, a, a + d)) * (1 - kit.eio(kit.seg(t, b, b + d)));
      el.style.opacity = v;
      el.style.visibility = v > 0.001 ? 'visible' : 'hidden';
      return v;
    },
  };

  function define(id, def) { defs[id] = def; }

  // 요소의 화면 위치. 실제 앱 화면을 넣은 iframe(축소해서 보여 줌) 안의 요소도 바깥 좌표로 바꿔 줌
  function screenRect(el) {
    const r = el.getBoundingClientRect();
    const fe = el.ownerDocument.defaultView.frameElement;
    if (!fe) return r;
    const fr = screenRect(fe);
    const sx = fr.width / (fe.clientWidth || fr.width), sy = fr.height / (fe.clientHeight || fr.height);
    return { left: fr.left + r.left * sx, top: fr.top + r.top * sy, width: r.width * sx, height: r.height * sy };
  }

  // 실제 앱 화면(장면별 HTML)을 휴대폰 화면 안에 겹쳐 넣기. 실제 휴대폰 폭(vw)으로 그린 뒤 틀에 맞게 축소
  // scenes: { 이름: 'demos/앱/장면.html' }  → 돌려주는 값: { 이름: { wrap, frame, doc() } }
  function loadScenes(screen, scenes, vw = 360) {
    const out = {};
    const w = screen.clientWidth || 280, h = screen.clientHeight || 580;
    const z = w / vw;
    for (const [name, src] of Object.entries(scenes)) {
      const wrap = document.createElement('div');
      wrap.className = 'demo-scene';
      wrap.style.cssText = 'position:absolute;inset:0;opacity:0;visibility:hidden;overflow:hidden';
      const f = document.createElement('iframe');
      f.src = src; f.title = ''; f.tabIndex = -1;
      f.setAttribute('aria-hidden', 'true');
      f.setAttribute('sandbox', 'allow-same-origin'); // 그림만 보여 주고 스크립트는 실행하지 않음
      f.style.cssText = `position:absolute;left:0;top:0;border:0;width:${vw}px;height:${Math.round(h / z)}px;transform:scale(${z});transform-origin:0 0;pointer-events:none`;
      wrap.appendChild(f); screen.appendChild(wrap);
      const sc = { wrap, frame: f, ready: false, doc: () => (sc.ready ? f.contentDocument : null) };
      f.addEventListener('load', () => {
        sc.ready = true;
        const d = f.contentDocument;
        // 스크롤바 숨기기
        const st = d.createElement('style'); st.textContent = 'html{scrollbar-width:none}html::-webkit-scrollbar{display:none}'; d.head.appendChild(st);
        if (sc.onready) sc.onready(d);
      });
      out[name] = sc;
    }
    return out;
  }

  function mount(container, id) {
    const def = defs[id];
    if (!def) return false;
    const device = def.device === 'laptop' ? 'laptop' : 'phone';
    container.classList.add('demo-host');
    container.innerHTML = `
      <div class="demo demo--${device}">
        <div class="demo-stage">
          <div class="demo-cap" aria-live="off"></div>
          <div class="demo-frame" role="img" aria-label="${def.label || '앱 사용 예시 애니메이션'}">
            <div class="demo-device"><div class="demo-screen"></div></div>
            <div class="demo-ring"></div>
            <div class="demo-end">
              <div class="demo-end-title"></div>
              <div class="demo-end-line"></div>
              <div class="demo-end-sub"></div>
            </div>
          </div>
          <div class="demo-foot">
            <span class="demo-tag">${def.tag || '예시 화면 · 이름은 모두 지어낸 이름이에요'}</span>
            <button type="button" class="demo-toggle" aria-pressed="false">일시정지</button>
          </div>
        </div>
        <ol class="demo-steps">${def.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      </div>`;
    const $ = (s) => container.querySelector(s);
    const screen = $('.demo-screen'), frame = $('.demo-frame'), ring = $('.demo-ring');
    const cap = $('.demo-cap'), end = $('.demo-end'), steps = [...container.querySelectorAll('.demo-steps li')];
    $('.demo-end-title').innerHTML = def.end.title;
    $('.demo-end-sub').innerHTML = def.end.sub;
    screen.innerHTML = def.html;
    const ctx = def.setup ? def.setup(screen) : {};

    // 누르는 동그라미: 대본에서 kit.tap(요소, 시작시각) 을 부르면 그 시각에 그 위치에 나타남
    let tapState = null;
    const api = Object.assign({}, kit, {
      q: (s) => screen.querySelector(s),
      qa: (s) => [...screen.querySelectorAll(s)],
      tap(el, at) { tapState = tapState || (renderT >= at && renderT < at + 0.5 ? { el, at } : null); },
    });

    let renderT = 0;
    function render(t) {
      renderT = t; tapState = null;
      def.render(t, ctx, api);
      // 단계·설명
      let cur = def.timeline[0];
      for (const k of def.timeline) if (t >= k.at) cur = k;
      steps.forEach((li, i) => li.classList.toggle('on', i === cur.step));
      if (cap.textContent !== (cur.cap || '')) cap.textContent = cur.cap || '';
      // 누르는 동그라미
      if (tapState) {
        const fr = frame.getBoundingClientRect(), r = screenRect(tapState.el);
        const p = kit.seg(t, tapState.at, tapState.at + 0.5);
        const s = fr.width / frame.offsetWidth || 1; // 화면 축소 비율 보정
        ring.style.left = ((r.left - fr.left + r.width / 2) / s) + 'px';
        ring.style.top = ((r.top - fr.top + r.height / 2) / s) + 'px';
        ring.style.opacity = 1 - kit.eo(p);
        ring.style.transform = `scale(${0.4 + kit.eo(p)})`;
      } else {
        ring.style.opacity = 0;
      }
      // 마무리 카드
      const e = kit.eio(kit.seg(t, def.end.at, def.end.at + 0.5)) * (1 - kit.eio(kit.seg(t, def.duration - 0.5, def.duration)));
      end.style.opacity = e;
      end.style.visibility = e > 0.001 ? 'visible' : 'hidden';
    }

    // 재생 제어
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let playing = !still, visible = true, t = 0, last = null, holdIdx = 0, holdTimer = null;
    const toggle = $('.demo-toggle');
    function tick(now) {
      if (last !== null && playing && visible) t = (t + (now - last) / 1000) % def.duration;
      last = now;
      if (playing && visible) render(t);
      requestAnimationFrame(tick);
    }
    function setPlaying(p) {
      playing = p;
      toggle.textContent = p ? '일시정지' : '재생';
      toggle.setAttribute('aria-pressed', String(!p));
      if (still) {
        clearInterval(holdTimer);
        if (p) holdTimer = setInterval(() => { holdIdx = (holdIdx + 1) % def.holds.length; render(def.holds[holdIdx]); }, 3500);
      }
    }
    toggle.addEventListener('click', () => setPlaying(!playing));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(frame);
    }
    if (still) {
      // '동작 줄이기'를 켠 사람: 움직임 없이 주요 장면만 보여 줌 (재생을 누르면 장면이 3.5초마다 넘어감)
      render(def.holds[0]);
      setPlaying(false);
    } else {
      render(0);
      requestAnimationFrame(tick);
    }
    return true;
  }

  kit.loadScenes = loadScenes;
  window.DemoKit = { define, mount, kit };
})();
