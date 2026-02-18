import { setWorldConstructor } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROMIUM_PROFILE_PATH = path.join(__dirname, '..', 'chromium-profile');

/** Usar perfil persistente (sesión de npm run login) cuando no estamos en CI */
const usePersistentProfile = process.env.USE_PERSISTENT_PROFILE === 'true' || !process.env.CI;

/**
 * World de Cucumber: mantiene el contexto del navegador y las páginas.
 * Si usePersistentProfile: usa el mismo perfil que npm run login (sesión guardada, sin pedir correo/PIN).
 */
class World {
  constructor({ parameters }) {
    this.parameters = parameters;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.baseUrl = process.env.BASE_URL || 'https://keycloak.saleads.ai';
  }

  async init() {
    if (this.context) return;

    const headless = process.env.HEADLESS !== 'false';
    const args = [
      '--disable-features=TranslateUI,Translate,WebAuthentication',
      '--disable-translate',
      '--disable-webauthn',
      '--lang=es-CO',
      '--no-first-run',
    ];

    if (usePersistentProfile) {
      this.context = await chromium.launchPersistentContext(CHROMIUM_PROFILE_PATH, {
        headless,
        args,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        locale: 'es-CO',
        slowMo: process.env.SLOW_MO !== undefined ? parseInt(process.env.SLOW_MO, 10) : (headless ? 0 : 80),
      });
      this.page = this.context.pages()[0] || await this.context.newPage();
    } else {
      this.browser = await chromium.launch({
        headless,
        slowMo: process.env.SLOW_MO !== undefined ? parseInt(process.env.SLOW_MO, 10) : (headless ? 0 : 80),
        args,
      });
      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        locale: 'es-CO',
      });
      this.page = await this.context.newPage();
    }
  }

  async close() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    this.page = null;
    this.context = null;
    this.browser = null;
  }
}

setWorldConstructor(World);
