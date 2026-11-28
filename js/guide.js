// guide.js — 주소의 ?id= 값으로 data/apps.json에서 프로그램을 찾아 사용 가이드를 그립니다.
// 가이드 내용은 data/apps.json의 각 프로그램 "guide" 항목을 고치세요.

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function section(title, inner) {
  return inner ? `<section class="g-sec"><h2>${esc(title)}</h2>${inner}</section>` : '';
}

function render(app, site) {
  const g = app.guide || {};
  document.title = `${app.title} 사용 가이드 · ${site.name}`;
  $('.back').textContent = `← ${site.name}`;
  $('#gMeta').innerHTML = `<span class="g-cat">${esc(app.category)}</span><span>${esc(app.type)}</span>${app.date ? `<span>${esc(app.date)}</span>` : ''}${app.badge ? `<span class="g-badge">${esc(app.badge)}</span>` : ''}`;
  $('#gTitle').textContent = app.title;
  $('#gSummary').textContent = app.summary;

  const extra = (g.extraLinks || []).map((l) => l.url
    ? `<a class="btn btn--ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`
    : `<span class="btn btn--ghost is-disabled" aria-disabled="true">${esc(l.label)} (준비 중)</span>`).join('');
  // url이 비어 있으면(학교 데이터를 다루는 앱 등) 열기 버튼 없이 가이드만 보여 줍니다.
  const openable = Boolean(app.url);
  $('#gActions').innerHTML = openable
    ? `<a class="btn btn--main" href="${esc(app.url)}" target="_blank" rel="noopener">바로 열기</a>${extra}`
    : `<p class="g-private">학교 데이터를 다루는 앱이라 사용 가이드만 공개해요.</p>${extra}`;

  // 기능 소개 애니메이션(demo)이 있으면 그것을, 없으면 시연 영상, 그것도 없으면 캡처 이미지를 보여 줍니다.
  // '동작 줄이기'를 켠 사람에게는 자동 재생하지 않고 재생 버튼만 보여 줍니다.
  showMedia(app);

  const list = (arr) => arr && arr.length ? `<ul class="g-list">${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const steps = g.steps && g.steps.length
    ? `<ol class="g-steps">${g.steps.map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${s.image ? `<img src="${esc(s.image)}" alt="${esc(s.title)} 화면" loading="lazy">` : ''}</li>`).join('')}</ol>`
    : '';
  const faq = g.faq && g.faq.length
    ? g.faq.map((f) => `<details class="g-faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')
    : '';

  $('#gBody').innerHTML =
    section('이런 분께 좋아요', list(g.for)) +
    section('주요 기능', list(g.features)) +
    section('사용 방법', steps) +
    section('자주 묻는 질문', faq) +
    (openable ? `<p class="g-bottom"><a class="btn btn--main" href="${esc(app.url)}" target="_blank" rel="noopener">${esc(app.title)} 열기</a></p>` : '');
}

// 가이드 위쪽 그림 자리: 애니메이션 → 영상 → 이미지 순서로 있는 것을 보여 줌
function showMedia(app) {
  const box = $('#gShot');
  const fallback = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.classList.remove('demo-host');
    if (app.video) {
      box.innerHTML = `<video src="${esc(app.video)}" ${app.thumb ? `poster="${esc(app.thumb)}"` : ''} muted loop playsinline controls preload="metadata" ${reduceMotion ? '' : 'autoplay'} aria-label="${esc(app.title)} 시연 영상"></video>`;
    } else {
      box.innerHTML = app.thumb ? `<img src="${esc(app.thumb)}" alt="${esc(app.title)} 화면">` : '';
    }
    const shot = $('#gShot img');
    if (shot) {
      const fit = () => box.classList.toggle('is-portrait', shot.naturalHeight > shot.naturalWidth);
      shot.complete ? fit() : shot.addEventListener('load', fit);
    }
  };
  if (app.demo && window.DemoKit) {
    const s = document.createElement('script');
    s.src = app.demo;
    s.onload = () => { if (!window.DemoKit.mount(box, app.id)) fallback(); };
    s.onerror = fallback;
    document.body.appendChild(s);
  } else {
    fallback();
  }
}

function notFound() {
  $('#gTitle').textContent = '가이드를 찾을 수 없어요';
  $('#gSummary').textContent = '주소가 바뀌었거나 없는 프로그램이에요. 목록에서 다시 골라 주세요.';
  $('#gActions').innerHTML = '<a class="btn btn--main" href="./">목록으로 가기</a>';
}

(async () => {
  const id = new URLSearchParams(location.search).get('id');
  try {
    const data = await (await fetch('data/apps.json', { cache: 'no-cache' })).json();
    const app = data.apps.find((a) => a.id === id);
    app ? render(app, data.site) : notFound();
  } catch (e) {
    notFound();
  }
})();
