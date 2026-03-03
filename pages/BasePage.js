/**
 * POM Base: acciones comunes para todas las páginas.
 */
export class BasePage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl || 'https://keycloak-qa.saleads.ai';
  }

  async goto(path = '') {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  }

  async getTitle() {
    return this.page.title();
  }

  async waitForUrl(pattern, timeout = 15000) {
    await this.page.waitForURL(pattern, { timeout });
  }

  async screenshot(name) {
    return this.page.screenshot({ path: `report/screenshots/${name}.png` });
  }
}
