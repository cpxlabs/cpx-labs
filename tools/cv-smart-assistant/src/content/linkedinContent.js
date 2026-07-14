// LinkedIn RPA — Job Filtering & Saving Module
// Operates on /feed/ and /search/results/content/ pages

(function () {
  if (!window.location.hostname.includes('linkedin.com')) return;

  let settings = null;
  let savedIds = new Set();
  let observer = null;
  let cleanupNav = null;

  async function loadState() {
    try {
      settings = await LinkedInStorage.getSettings();
      const jobs = await LinkedInStorage.getSavedJobs();
      savedIds = new Set(jobs.map((j) => j.id));
    } catch {
      settings = { ...LinkedInStorage.DEFAULT_SETTINGS };
    }
  }

  function processPosts() {
    if (!settings || !settings.isFilterActive) return;

    const allPosts = document.querySelectorAll(LinkedInDOM.POST_SELECTORS.join(','));
    for (const el of allPosts) {
      const post = LinkedInDOM.getPostContainer(el);
      if (!post) continue;
      if (post.dataset.rpaProcessed) continue;
      post.dataset.rpaProcessed = '1';

      const parsed = LinkedInDOM.parsePost(post);
      if (!parsed) continue;

      const matched = LinkedInDOM.matchesKeywords(parsed.contentPreview + ' ' + parsed.authorName, settings.keywords);
      if (matched.length === 0) continue;

      parsed.matchedKeywords = matched;
      post.rpaData = parsed;

      LinkedInUI.highlightPost(post, settings.highlightColor);

      if (!savedIds.has(parsed.id)) {
        LinkedInUI.injectSaveButton(post, (done) => {
          const data = post.rpaData;
          if (!data) return done(false);
          LinkedInStorage.saveJob({
            id: data.id,
            url: data.url,
            authorName: data.authorName,
            contentPreview: data.contentPreview,
            matchedKeywords: data.matchedKeywords,
          }).then((saved) => {
            if (saved) savedIds.add(data.id);
            done(saved);
          }).catch(() => done(false));
        });
      }
    }
  }

  function init() {
    if (!LinkedInDOM.isRelevantPage()) return;

    LinkedInUI.injectStyles();
    loadState().then(() => {
      processPosts();
      observer = LinkedInDOM.createObserver(processPosts);
      observer.start();
    });

    cleanupNav = LinkedInDOM.watchPageNavigation(() => {
      if (LinkedInDOM.isRelevantPage()) {
        processPosts();
        if (observer) observer.start();
      } else {
        if (observer) observer.stop();
      }
    });
  }

  function destroy() {
    if (observer) observer.stop();
    if (cleanupNav) cleanupNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.linkedin_userSettings) {
      settings = { ...LinkedInStorage.DEFAULT_SETTINGS, ...(changes.linkedin_userSettings.newValue || {}) };
      if (settings.isFilterActive) processPosts();
    }
    if (changes.linkedin_savedJobs) {
      const jobs = changes.linkedin_savedJobs.newValue || [];
      savedIds = new Set(jobs.map((j) => j.id));
    }
  });
})();
