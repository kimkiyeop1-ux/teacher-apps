// main.js — data/apps.json을 읽어 메인 화면(검색·탭·카드)을 그립니다.
// 프로그램을 추가할 때는 이 파일이 아니라 data/apps.json을 고치세요.

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

let apps = [];
let currentCat = '전체';

function renderSite(site) {
  document.title = site.name;
  $('#siteName').textContent = site.name;
  $('#intro').textContent = site.intro;
  $('#byline').textContent = `by ${site.author}`;
  $('#footText').textContent = `${site.name} · by ${site.author}`;
}

function renderTabs(categories) {
  const all = ['전체', ...categories];
  $('#tabs').innerHTML = all.map((c) => {
    const n = c === '전체' ? apps.length : apps.filter((a) => a.category === c).length;
    return `<button type="button" class="tab" data-cat="${esc(c)}" aria-pressed="${c === currentCat}">${esc(c)}<span class="count">${n}</span></button>`;
  }).join('');
}

function renderCards() {
  const q = $('#q').value.trim().toLowerCase();
  const list = apps.filter((a) => {
    const inCat = currentCat === '전체' || a.category === currentCat;
    const text = [a.title, a.summary, a.category, a.type, ...(a.tags || [])].join(' ').toLowerCase();
    return inCat && (!q || text.includes(q));
  });
  $('#cards').innerHTML = list.map((a) => `
    <li>
      <a class="card-link" href="guide.html?id=${encodeURIComponent(a.id)}">
        <div class="thumb"><img src="${esc(a.thumb)}" alt="" loading="lazy"></div>
        <div class="card-meta"><span class="card-cat">${esc(a.category)}</span><span>${esc(a.type)}</span>${a.date ? `<span>${esc(a.date)}</span>` : ''}${a.url ? '' : '<span class="card-private">가이드만 공개</span>'}</div>
        <h3 class="card-title">${esc(a.title)}</h3>
        <p class="card-summary">${esc(a.summary)}</p>
        <span class="card-more">사용 가이드 보기</span>
      </a>
    </li>`).join('');
  $('#empty').hidden = list.length > 0;
}

async function init() {
  try {
    const res = await fetch('data/apps.json', { cache: 'no-cache' });
    const data = await res.json();
    apps = data.apps;
    renderSite(data.site);
    renderTabs(data.categories);
    renderCards();
  } catch (e) {
    $('#empty').textContent = '프로그램 목록을 불러오지 못했어요. 새로고침해 보세요.';
    $('#empty').hidden = false;
  }
  $('#tabs').addEventListener('click', (e) => {
    const b = e.target.closest('.tab');
    if (!b) return;
    currentCat = b.dataset.cat;
    document.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-pressed', t === b));
    renderCards();
  });
  $('#q').addEventListener('input', renderCards);
}

init();
