// Browser launcher.
//
// On the machine this project was built on, npm had moved past the Chromium
// build that was actually downloaded, so every probe has to point at the pinned
// binary. In a fresh checkout — CI, or a cloud agent — that path does not exist
// and Playwright's own download is correct. Try the pin, fall back.
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const PINNED = 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe';

export const launch = (opts = {}) =>
  chromium.launch(existsSync(PINNED) ? { executablePath: PINNED, ...opts } : opts);

export { chromium };
