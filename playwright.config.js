/**
 * Configuración Playwright - Saleads QA
 * Incluye opciones para perfil persistente y desactivación de WebAuthn (Passkey/Windows Hello).
 */
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Ruta del perfil persistente de Chromium (login manual una vez, sesión guardada) */
export const CHROMIUM_PROFILE_PATH = path.join(__dirname, 'chromium-profile');

/** Opciones para launchPersistentContext: desactiva WebAuthn y reduce detección de automatización (Google) */
export const persistentContextOptions = {
  headless: false,
  args: [
    '--disable-features=WebAuthentication',
    '--disable-webauthn',
    '--disable-blink-features=AutomationControlled',
  ],
  viewport: { width: 1280, height: 720 },
  ignoreHTTPSErrors: true,
  locale: 'es-CO',
};

/** Quitar flag --enable-automation para que Google no bloquee el login (usar en login y en world) */
export const IGNORE_AUTOMATION_FLAG = ['--enable-automation'];

export default defineConfig({
  testDir: './',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'report/playwright', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://saleads.ai',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  outputDir: 'test-results',
});
