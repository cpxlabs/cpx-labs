/**
 * @jest-environment jsdom
 */
const path = require('path');
const fs = require('fs');

const uiSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'content', 'linkedinUI.js'), 'utf-8');

function loadUI() {
  global.eval(uiSrc);
}

beforeEach(() => {
  document.body.innerHTML = '';
  loadUI();
});

afterEach(() => {
  delete global.LinkedInUI;
});

describe('LinkedInUI', () => {
  describe('injectStyles', () => {
    test('injects style element into head', () => {
      LinkedInUI.injectStyles();
      const style = document.getElementById('rpa-styles');
      expect(style).not.toBeNull();
      expect(style.tagName).toBe('STYLE');
    });

    test('does not duplicate styles', () => {
      LinkedInUI.injectStyles();
      LinkedInUI.injectStyles();
      const styles = document.querySelectorAll('#rpa-styles');
      expect(styles).toHaveLength(1);
    });
  });

  describe('highlightPost', () => {
    test('adds highlight class and background color', () => {
      const post = document.createElement('div');
      LinkedInUI.highlightPost(post, '#ff0');
      expect(post.classList.contains(LinkedInUI.HIGHLIGHT_CLASS)).toBe(true);
      expect(post.style.backgroundColor).toBe('rgb(255, 255, 0)');
    });
  });

  describe('removeHighlight', () => {
    test('removes highlight class and clears background', () => {
      const post = document.createElement('div');
      LinkedInUI.highlightPost(post, '#ff0');
      LinkedInUI.removeHighlight(post);
      expect(post.classList.contains(LinkedInUI.HIGHLIGHT_CLASS)).toBe(false);
      expect(post.style.backgroundColor).toBe('');
    });
  });

  describe('injectSaveButton', () => {
    test('injects button into post', () => {
      const post = document.createElement('div');
      const toolbar = document.createElement('div');
      toolbar.className = 'feed-shared-actor__container';
      post.appendChild(toolbar);

      LinkedInUI.injectSaveButton(post, (done) => done(true));
      const btn = post.querySelector('.' + LinkedInUI.BUTTON_CLASS);
      expect(btn).not.toBeNull();
      expect(btn.textContent).toBe('Salvar Vaga');
    });

    test('does not inject duplicate button', () => {
      const post = document.createElement('div');
      LinkedInUI.injectSaveButton(post, (done) => done(true));
      LinkedInUI.injectSaveButton(post, (done) => done(true));
      const btns = post.querySelectorAll('.' + LinkedInUI.BUTTON_CLASS);
      expect(btns).toHaveLength(1);
    });

    test('button click calls save handler and transitions state', () => {
      jest.useFakeTimers();
      const post = document.createElement('div');
      const toolbar = document.createElement('div');
      toolbar.className = 'feed-shared-actor__container';
      post.appendChild(toolbar);

      const saveHandler = jest.fn((done) => {
        setTimeout(() => done(true), 100);
      });

      LinkedInUI.injectSaveButton(post, saveHandler);
      const btn = post.querySelector('.' + LinkedInUI.BUTTON_CLASS);
      btn.click();

      expect(saveHandler).toHaveBeenCalledTimes(1);
      expect(btn.textContent).toBe('Salvando...');
      expect(btn.disabled).toBe(true);

      jest.advanceTimersByTime(100);
      expect(btn.textContent).toBe('Salvo');
      expect(btn.classList.contains(LinkedInUI.SAVED_CLASS)).toBe(true);

      jest.useRealTimers();
    });

    test('button prevents event propagation on click', () => {
      const post = document.createElement('div');
      const toolbar = document.createElement('div');
      post.appendChild(toolbar);

      const stopPropagation = jest.fn();
      const preventDefault = jest.fn();

      LinkedInUI.injectSaveButton(post, (done) => done(true));
      const btn = post.querySelector('.' + LinkedInUI.BUTTON_CLASS);
      btn.click();

      btn.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));
    });
  });

  describe('findToolbar', () => {
    test('finds toolbar by class name', () => {
      const post = document.createElement('div');
      const toolbar = document.createElement('div');
      toolbar.className = 'feed-shared-actor__container';
      post.appendChild(toolbar);
      expect(LinkedInUI.findToolbar(post)).toBe(toolbar);
    });

    test('falls back to post itself', () => {
      const post = document.createElement('div');
      expect(LinkedInUI.findToolbar(post)).toBe(post);
    });
  });
});
