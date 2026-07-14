/**
 * @jest-environment jsdom
 */
const path = require('path');
const fs = require('fs');

const domSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'content', 'linkedinDOM.js'), 'utf-8');

function loadDOM() {
  global.eval(domSrc);
}

beforeEach(() => {
  document.body.innerHTML = '';
  loadDOM();
});

afterEach(() => {
  delete global.LinkedInDOM;
  delete global.POST_SELECTORS;
  delete global.SPONSORED_INDICATORS;
  delete global.WIDGET_BLOCKLIST;
  jest.restoreAllMocks();
});

function createPost(overrides = {}) {
  const post = document.createElement('div');
  post.className = 'feed-shared-update-v2';
  post.setAttribute('data-urn', overrides.urn || 'urn:li:activity:12345');
  if (overrides.sponsored) {
    const badge = document.createElement('span');
    badge.className = 'promoted-text';
    badge.textContent = 'Promoted';
    post.appendChild(badge);
  }
  if (overrides.author) {
    const actor = document.createElement('span');
    actor.className = 'feed-shared-actor__name';
    actor.textContent = overrides.author;
    post.appendChild(actor);
  }
  if (overrides.description) {
    const desc = document.createElement('div');
    desc.className = 'feed-shared-update-v2__description';
    desc.textContent = overrides.description;
    post.appendChild(desc);
  }
  if (overrides.nested) {
    const nested = document.createElement('div');
    nested.className = 'feed-shared-update-v2--nested-container';
    nested.setAttribute('data-urn', overrides.nested.urn || 'urn:li:activity:99999');
    if (overrides.nested.description) {
      const nd = document.createElement('div');
      nd.className = 'feed-shared-update-v2__description';
      nd.textContent = overrides.nested.description;
      nested.appendChild(nd);
    }
    if (overrides.nested.author) {
      const na = document.createElement('span');
      na.className = 'feed-shared-actor__name';
      na.textContent = overrides.nested.author;
      nested.appendChild(na);
    }
    post.appendChild(nested);
  }
  return post;
}

describe('LinkedInDOM', () => {
  describe('getPostContainer', () => {
    test('returns the closest post container', () => {
      const post = createPost();
      document.body.appendChild(post);
      const inner = document.createElement('span');
      inner.className = 'inner';
      post.appendChild(inner);
      expect(LinkedInDOM.getPostContainer(inner)).toBe(post);
    });
  });

  describe('extractURN', () => {
    test('extracts from data-urn attribute', () => {
      const post = createPost({ urn: 'urn:li:activity:42' });
      expect(LinkedInDOM.extractURN(post)).toBe('urn:li:activity:42');
    });

    test('extracts from nested container', () => {
      const post = createPost({ urn: 'urn:li:fsd_foobar', nested: { urn: 'urn:li:activity:2' } });
      expect(LinkedInDOM.extractURN(post)).toBe('urn:li:activity:2');
    });

    test('returns null for non-activity URN', () => {
      const post = document.createElement('div');
      post.setAttribute('data-urn', 'urn:li:fsd_foobar');
      expect(LinkedInDOM.extractURN(post)).toBeNull();
    });
  });

  describe('extractAuthorName', () => {
    test('extracts from actor name element', () => {
      const post = createPost({ author: 'John Recruiter' });
      expect(LinkedInDOM.extractAuthorName(post)).toBe('John Recruiter');
    });

    test('returns Unknown when no author found', () => {
      const post = createPost({});
      expect(LinkedInDOM.extractAuthorName(post)).toBe('Unknown');
    });
  });

  describe('extractContentPreview', () => {
    test('extracts description text', () => {
      const post = createPost({ description: 'We are hiring a remote developer' });
      expect(LinkedInDOM.extractContentPreview(post)).toContain('remote developer');
    });

    test('includes nested reshare description', () => {
      const post = createPost({
        description: 'Original post',
        nested: { description: 'Reshared content' },
      });
      const preview = LinkedInDOM.extractContentPreview(post);
      expect(preview).toContain('Original post');
      expect(preview).toContain('Reshared content');
    });

    test('truncates at 300 chars', () => {
      const long = 'x'.repeat(400);
      const post = createPost({ description: long });
      expect(LinkedInDOM.extractContentPreview(post).length).toBeLessThanOrEqual(303);
    });
  });

  describe('isNonActivityWidget', () => {
    test('returns true for non-activity URN prefix', () => {
      const post = document.createElement('div');
      post.setAttribute('data-urn', 'urn:li:fsd_something');
      expect(LinkedInDOM.isNonActivityWidget(post)).toBe(true);
    });

    test('returns false for a valid activity post', () => {
      const post = createPost({});
      expect(LinkedInDOM.isNonActivityWidget(post)).toBe(false);
    });

    test('returns true for "people you may know" text', () => {
      const post = createPost({ description: 'People you may know' });
      expect(LinkedInDOM.isNonActivityWidget(post)).toBe(true);
    });
  });

  describe('isSponsored', () => {
    test('returns true when promoted-text element exists', () => {
      const post = createPost({ sponsored: true });
      expect(LinkedInDOM.isSponsored(post)).toBe(true);
    });
  });

  describe('parsePost', () => {
    test('parses a valid post', () => {
      const post = createPost({ description: 'Remote job opening', author: 'Tech Corp' });
      const parsed = LinkedInDOM.parsePost(post);
      expect(parsed).not.toBeNull();
      expect(parsed.id).toBe('urn:li:activity:12345');
      expect(parsed.authorName).toBe('Tech Corp');
    });

    test('returns null for sponsored posts', () => {
      const post = createPost({ sponsored: true });
      expect(LinkedInDOM.parsePost(post)).toBeNull();
    });

    test('returns null for non-activity widgets', () => {
      const post = document.createElement('div');
      post.setAttribute('data-urn', 'urn:li:fsd_whatever');
      expect(LinkedInDOM.parsePost(post)).toBeNull();
    });
  });

  describe('matchesKeywords', () => {
    test('matches keyword with word boundaries', () => {
      const result = LinkedInDOM.matchesKeywords('remote job opening', ['remote']);
      expect(result).toEqual(['remote']);
    });

    test('does not match partial words', () => {
      const result = LinkedInDOM.matchesKeywords('remotely awesome', ['remote']);
      expect(result).toEqual([]);
    });

    test('matches multiple keywords', () => {
      const result = LinkedInDOM.matchesKeywords('home office remote job', ['remote', 'home office']);
      expect(result).toHaveLength(2);
    });

    test('returns empty for empty keywords', () => {
      const result = LinkedInDOM.matchesKeywords('text', []);
      expect(result).toEqual([]);
    });

    test('handles accented characters', () => {
      const result = LinkedInDOM.matchesKeywords('trabalho remoto disponível', ['remoto']);
      expect(result).toEqual(['remoto']);
    });
  });

  describe('isRelevantPage', () => {
    test('returns true for /feed/ path', () => {
      delete window.location;
      window.location = new URL('https://linkedin.com/feed/');
      expect(LinkedInDOM.isRelevantPage()).toBe(true);
    });

    test('returns false for /jobs/ path', () => {
      delete window.location;
      window.location = new URL('https://linkedin.com/jobs/');
      expect(LinkedInDOM.isRelevantPage()).toBe(false);
    });
  });

  describe('createObserver', () => {
    test('calls callback after debounce', async () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      const obs = LinkedInDOM.createObserver(callback);
      obs.start();
      document.body.innerHTML = '<div>new content</div>';
      await Promise.resolve();
      jest.advanceTimersByTime(1500);
      expect(callback).toHaveBeenCalledTimes(1);
      obs.stop();
      jest.useRealTimers();
    });
  });
});
