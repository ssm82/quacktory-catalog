const cover = document.querySelector('.cover');
const enterButton = document.querySelector('[data-enter]');
const settingsButton = document.querySelector('[data-tool="settings"]');
const audioButton = document.querySelector('[data-tool="audio"]');

enterButton.addEventListener('click', () => {
  const entered = cover.classList.toggle('is-entered');
  enterButton.setAttribute('aria-pressed', String(entered));
});

settingsButton.addEventListener('click', () => {
  const quiet = cover.classList.toggle('is-quiet');
  settingsButton.setAttribute('aria-pressed', String(quiet));
});

audioButton.addEventListener('click', () => {
  const muted = audioButton.getAttribute('aria-pressed') === 'true';
  audioButton.setAttribute('aria-pressed', String(!muted));
});
