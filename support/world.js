import { setWorldConstructor } from '@cucumber/cucumber';
import { chromium } from 'playwright';

/**
 * World de Cucumber: mantiene el contexto del navegador y las páginas.
 * Cada escenario obtiene una instancia nueva (aislamiento).
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
    if (this.browser) return;
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
      slowMo: process.env.SLOW_MO !== undefined ? parseInt(process.env.SLOW_MO, 10) : (process.env.HEADLESS === 'false' ? 80 : 0),
      args: [
        '--disable-features=TranslateUI,Translate',
        '--disable-translate',
        '--lang=es-CO',
        '--no-first-run',
      ],
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      locale: 'es-CO',
    });
    this.page = await this.context.newPage();
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
