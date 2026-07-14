const POST_SELECTORS = [
  '.feed-shared-update-v2',
  '[data-urn^="urn:li:activity:"]',
  '.occludable-update',
  '.update-components-actor',
];

const NESTED_CONTAINER_SELECTOR = '.feed-shared-update-v2--nested-container';

const ACTIVITY_URN_RE = /^urn:li:activity:/;
const LINKEDIN_ACTIVITY_RE = /\/activity\/(\d+)/;
const LINKEDIN_UGCPOST_RE = /\/ugcPost\/(\d+)/;

const SPONSORED_SELECTORS = [
  '.update-components-promo-footer',
  '.promoted-text',
  '[data-test-promo-footer="true"]',
  '[data-tracking="promo"]',
];

const SPONSORED_TEXT_MARKERS = ['promoted', 'patrocinado', 'sponsored'];

const WIDGET_BLOCKLIST = [
  'people you may know',
  'suggested for you',
  'seguir',
  'follow',
  '+ follow',
  '+ seguir',
  'recommended for you',
  'recomendado para ti',
  'you might like',
  'try this feature',
  'add to your feed',
  'adicionar ao seu feed',
];

const WIDGET_EXCLUDE_SELECTORS = [
  '[data-urn^="urn:li:fsd_"]',
  '[data-urn^="urn:li:fs_sales"]',
  '.feed-shared-update-v2--widget',
  '.feed-shared-news-module',
  '.feed-shared-carousel',
];

function matchesSelector(el, selectors) {
  for (const sel of selectors) {
    if (el.matches(sel)) return true;
    try {
      if (el.querySelector(sel)) return true;
    } catch {}
  }
  return false;
}

function getPostContainer(el) {
  for (const sel of POST_SELECTORS) {
    const candidate = el.closest(sel);
    if (candidate) return candidate;
  }
  return null;
}

function isNonActivityWidget(post) {
  const urn = post.getAttribute('data-urn') || '';
  if (urn && !ACTIVITY_URN_RE.test(urn)) return true;

  if (matchesSelector(post, WIDGET_EXCLUDE_SELECTORS)) return true;

  const text = (post.textContent || '').toLowerCase();
  for (const marker of WIDGET_BLOCKLIST) {
    if (text.includes(marker)) return true;
  }

  const links = post.querySelectorAll('a[href*="linkedin.com"]');
  let hasProfileLink = false;
  let hasExternalLink = false;
  for (const link of links) {
    const href = link.href || '';
    if (href.includes('/in/') || href.includes('/company/')) hasProfileLink = true;
    else if (!href.includes(window.location.hostname)) hasExternalLink = true;
  }
  if (hasExternalLink && !hasProfileLink) return true;

  return false;
}

function isSponsored(post) {
  if (matchesSelector(post, SPONSORED_SELECTORS)) return true;
  const text = (post.textContent || '').toLowerCase();
  for (const marker of SPONSORED_TEXT_MARKERS) {
    if (text.includes(marker)) return true;
  }
  return false;
}

function findNestedContainer(post) {
  return post.querySelector(NESTED_CONTAINER_SELECTOR);
}

function extractURN(post) {
  const urn = post.getAttribute('data-urn');
  if (urn && ACTIVITY_URN_RE.test(urn)) return urn;

  const nested = findNestedContainer(post);
  if (nested) {
    const nestedUrn = nested.getAttribute('data-urn');
    if (nestedUrn && ACTIVITY_URN_RE.test(nestedUrn)) return nestedUrn;
  }

  const links = post.querySelectorAll('a[href*="/activity/"], a[href*="/ugcPost/"]');
  for (const link of links) {
    const m = link.href.match(LINKEDIN_ACTIVITY_RE);
    if (m) return `urn:li:activity:${m[1]}`;
    const m2 = link.href.match(LINKEDIN_UGCPOST_RE);
    if (m2) return `urn:li:ugcPost:${m2[1]}`;
  }

  if (nested) {
    const nestedLinks = nested.querySelectorAll('a[href*="/activity/"], a[href*="/ugcPost/"]');
    for (const link of nestedLinks) {
      const m = link.href.match(LINKEDIN_ACTIVITY_RE);
      if (m) return `urn:li:activity:${m[1]}`;
      const m2 = link.href.match(LINKEDIN_UGCPOST_RE);
      if (m2) return `urn:li:ugcPost:${m2[1]}`;
    }
  }

  return null;
}

function extractAuthorName(post) {
  const actorEl = post.querySelector('.feed-shared-actor__name, .update-components-actor__name, [data-testid="actor-title"]');
  if (actorEl) return actorEl.textContent.trim();

  const link = post.querySelector('a[href*="/in/"], a[href*="/company/"]');
  if (link) {
    const span = link.querySelector('span[dir="ltr"], span:not([dir])');
    if (span) return span.textContent.trim();
    return link.textContent.trim();
  }

  const nested = findNestedContainer(post);
  if (nested) {
    const nestedAuthor = nested.querySelector('.feed-shared-actor__name, .update-components-actor__name');
    if (nestedAuthor) return nestedAuthor.textContent.trim();
  }

  return 'Unknown';
}

function extractContentPreview(post) {
  const parts = [];

  const outerDesc = post.querySelector('.feed-shared-update-v2__description, .update-components-text, [data-testid="main-feed-activity-card"] .break-words');
  if (outerDesc) parts.push(outerDesc.textContent.trim());

  const nested = findNestedContainer(post);
  if (nested) {
    const nestedDesc = nested.querySelector('.feed-shared-update-v2__description, .update-components-text, .feed-shared-text__description');
    if (nestedDesc) parts.push(nestedDesc.textContent.trim());
  }

  const text = parts.join(' \n ').trim();
  return text.length > 300 ? text.slice(0, 300) + '...' : text;
}

function matchesKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) return [];
  if (!text) return [];
  const lower = text.toLowerCase();
  return keywords.filter((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      return new RegExp('\\b' + escaped + '\\b', 'iu').test(lower);
    } catch {
      return lower.includes(kw.toLowerCase());
    }
  });
}

function parsePost(post) {
  if (isNonActivityWidget(post)) return null;
  if (isSponsored(post)) return null;

  const urn = extractURN(post);
  if (!urn) return null;

  const text = extractContentPreview(post);
  return {
    id: urn,
    url: window.location.href.split('?')[0],
    authorName: extractAuthorName(post),
    contentPreview: text,
    matchedKeywords: [],
    element: post,
  };
}

function isRelevantPage() {
  const path = window.location.pathname;
  return path.includes('/feed/') || path.includes('/search/results/content/');
}

function createObserver(callback) {
  let timer = null;

  const observer = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
      timer = null;
    }, 1000);
  });

  function start() {
    const target = document.querySelector('main') || document.querySelector('.scaffold-finite-scroll') || document.body;
    observer.observe(target, { childList: true, subtree: true });
  }

  function stop() {
    observer.disconnect();
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  return { start, stop };
}

function watchPageNavigation(onChange) {
  let lastUrl = window.location.href;
  const check = () => {
    const current = window.location.href;
    if (current !== lastUrl) {
      lastUrl = current;
      onChange();
    }
  };
  window.addEventListener('popstate', check);
  window.addEventListener('pushstate', check);
  window.addEventListener('replacestate', check);
  const interval = setInterval(check, 2000);
  return () => {
    window.removeEventListener('popstate', check);
    clearInterval(interval);
  };
}

const LinkedInDOM = {
  getPostContainer, extractURN, extractAuthorName, extractContentPreview,
  isSponsored, isNonActivityWidget, matchesKeywords, parsePost,
  isRelevantPage, createObserver, watchPageNavigation,
  POST_SELECTORS, NESTED_CONTAINER_SELECTOR, WIDGET_BLOCKLIST,
};

if (typeof window !== 'undefined') {
  window.LinkedInDOM = LinkedInDOM;
}
if (typeof module !== 'undefined') {
  module.exports = LinkedInDOM;
}
