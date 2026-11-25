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
  $('#gMeta').innerHTML = `<span class="g-cat">${esc(app.category)}</span><span>${esc(app.type)}</span>${app.date ? `<span>${esc(app.date)}</span>` : ''}`;
  $('#gTitle').textContent = app.title;
  $('#gSummary').textContent = app.summary;

  const extra = (g.extraLinks || []).map((l) => l.url
    ? `<a class="btn btn--ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`
    : `<span class="btn btn--ghost is-disabled" aria-disabled="true">${esc(l.label)} (준비 중)</span>`).join('');
  $('#gActions').innerHTML = `<a class="btn btn--main" href="${esc(app.url)}" target="_blank" rel="noopener">바로 열기</a>${extra}`;

  $('#gShot').innerHTML = app.thumb ? `<img src="${esc(app.thumb)}" alt="${esc(app.title)} 화면">` : '';
  const shot = $('#gShot img');
  if (shot) {
    const fit = () => $('#gShot').classList.toggle('is-portrait', shot.naturalHeight > shot.naturalWidth);
    shot.complete ? fit() : shot.addEventListener('load', fit);
  }

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
    `<p class="g-bottom"><a class="btn btn--main" href="${esc(app.url)}" target="_blank" rel="noopener">${esc(app.title)} 열기</a></p>`;
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
