// Browser launcher.
//
// On the machine this project was built on, npm had moved past the Chromium
// build that was actually downloaded, so every probe has to point at the pinned
// binary. In a fresh checkout — CI, or a cloud agent — that path does not exist
// and Playwright's own download is correct. Try the pin, fall back.
import { existsSync } from 'node:fs';

const PINNED = 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe';

/** Playwright is imported at call time, not at module load, so a checkout
 *  without it can still run everything that does not need a browser. The cloud
 *  environment blocks npmjs; without this the whole suite was unrunnable there,
 *  including audits that never needed a dependency. */
export async function launch(opts = {}) {
  const { chromium } = await import('playwright');
  return chromium.launch(existsSync(PINNED) ? { executablePath: PINNED, ...opts } : opts);
}

export async function available() {
  try { await import('playwright'); return true; } catch { return false; }
}
