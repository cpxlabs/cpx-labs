const BUTTON_CLASS = 'rpa-save-btn';
const HIGHLIGHT_CLASS = 'rpa-highlighted';
const SAVED_CLASS = 'rpa-saved';

function injectStyles() {
  const id = 'rpa-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      border-left: 4px solid #0a66c2 !important;
      transition: background-color 0.3s ease;
    }
    .${BUTTON_CLASS} {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      margin-left: 8px;
      font-size: 12px;
      font-weight: 600;
      line-height: 20px;
      border-radius: 16px;
      border: 1px solid #0a66c2;
      background: #fff;
      color: #0a66c2;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto;
    }
    .${BUTTON_CLASS}:hover {
      background: #0a66c2;
      color: #fff;
    }
    .${BUTTON_CLASS}.${SAVED_CLASS} {
      background: #057642;
      border-color: #057642;
      color: #fff;
      cursor: default;
      opacity: 0.85;
    }
    .${BUTTON_CLASS}.${SAVED_CLASS}:hover {
      background: #057642;
    }
  `;
  document.head.appendChild(style);
}

function highlightPost(post, color) {
  post.classList.add(HIGHLIGHT_CLASS);
  if (color) {
    post.style.backgroundColor = color;
  }
}

function removeHighlight(post) {
  post.classList.remove(HIGHLIGHT_CLASS);
  post.style.backgroundColor = '';
}

function findToolbar(post) {
  return (
    post.querySelector('.feed-shared-actor__container') ||
    post.querySelector('.update-components-actor') ||
    post.querySelector('.occludable-update__header') ||
    post.querySelector('.feed-shared-control-menu') ||
    post
  );
}

function injectSaveButton(post, onSave) {
  if (post.querySelector(`.${BUTTON_CLASS}`)) return;

  const btn = document.createElement('button');
  btn.className = BUTTON_CLASS;
  btn.textContent = 'Salvar Vaga';

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (btn.classList.contains(SAVED_CLASS)) return;
    btn.textContent = 'Salvando...';
    btn.disabled = true;
    onSave((success) => {
      if (success) {
        btn.textContent = 'Salvo';
        btn.classList.add(SAVED_CLASS);
      } else {
        btn.textContent = 'Salvar Vaga';
        btn.disabled = false;
      }
    });
  });

  const toolbar = findToolbar(post);
  toolbar.appendChild(btn);
}

function injectButtonsOnPosts(posts, saveHandler) {
  for (const post of posts) {
    injectSaveButton(post, saveHandler);
  }
}

const LinkedInUI = { injectStyles, highlightPost, removeHighlight, injectSaveButton, injectButtonsOnPosts, findToolbar, BUTTON_CLASS, HIGHLIGHT_CLASS, SAVED_CLASS };

if (typeof window !== 'undefined') {
  window.LinkedInUI = LinkedInUI;
}
if (typeof module !== 'undefined') {
  module.exports = LinkedInUI;
}
