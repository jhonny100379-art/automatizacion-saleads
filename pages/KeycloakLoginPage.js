import { BasePage } from './BasePage.js';

/**
 * Page Object para la pantalla de login de Keycloak (Saleads).
 * Selectores estándar de Keycloak para el formulario de autenticación.
 */
export class KeycloakLoginPage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    // Pantalla inicial: "Acceder a tu cuenta" con Google y Microsoft
    this.selectors = {
      titleAccederCuenta: 'text=/Acceder a tu cuenta/i',
      botonGoogle: 'text=/GOOGLE/i',
      botonMicrosoft: 'text=/MICROSOFT/i',
      // Formulario usuario/contraseña (si se muestra en otro flujo)
      username: '#username',
      password: '#password',
      submit: '#kc-login',
      form: '#kc-form-login',
      errorMessage: '#input-error',
      forgotPassword: '#kc-form-options a',
    };
  }

  async navigateToLogin(authUrl) {
    const url = authUrl || this.getDefaultAuthUrl();
    await this.goto(url);
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  getDefaultAuthUrl() {
    const realm = process.env.KEYCLOAK_REALM || 'sale-ads';
    const redirectUri = encodeURIComponent('https://saleads.ai/api/auth/callback/keycloak');
    const codeChallenge = process.env.CODE_CHALLENGE || 'F6enb-xtgo-1e8c5QCEg7eU91J34lBbbdOSTMbZtx64';
    return `${this.baseUrl}/realms/${realm}/protocol/openid-connect/auth?response_type=code&client_id=front&redirect_uri=${redirectUri}&scope=openid%20email%20profile%20offline_access&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;
  }

  async enterUsername(username) {
    const timeoutMs = parseInt(process.env.USERNAME_TIMEOUT_MS || '30000', 10);
    await this.page.waitForSelector(this.selectors.username, { state: 'visible', timeout: timeoutMs });
    await this.page.fill(this.selectors.username, username);
  }

  async enterPassword(password) {
    await this.page.fill(this.selectors.password, password);
  }

  async clickLogin() {
    await this.page.click(this.selectors.submit);
  }

  /** Intenta mostrar el formulario usuario/contraseña si está oculto (solo Google/Microsoft visibles) */
  async mostrarFormularioUsuarioContraseña() {
    const usernameVisible = await this.page.locator(this.selectors.username).isVisible().catch(() => false);
    if (usernameVisible) return;
    const enlace = this.page.locator('a, button').filter({
      hasText: /Iniciar sesión con usuario|Sign in with username|Usuario y contraseña|Username and password|Acceso con usuario/i,
    }).first();
    if (await enlace.isVisible().catch(() => false)) {
      await enlace.click();
      const timeoutMs = parseInt(process.env.USERNAME_TIMEOUT_MS || '30000', 10);
      await this.page.waitForSelector(this.selectors.username, { state: 'visible', timeout: timeoutMs });
    }
  }

  async login(username, password) {
    await this.mostrarFormularioUsuarioContraseña();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /** Abre el selector de idioma y elige una opción por nombre (ej. "English", "Español") */
  async seleccionarIdioma(nombreIdioma) {
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    const regexIdioma = new RegExp(nombreIdioma, 'i');
    const opcionVisible = this.page.locator(`a[id^="language-"], a[href*="kc_locale"]`).filter({ hasText: regexIdioma }).first();
    if (await opcionVisible.isVisible().catch(() => false)) {
      await opcionVisible.click({ timeout: 5000 });
      await this.page.waitForLoadState('networkidle').catch(() => {});
      const pausaMs = parseInt(process.env.PAUSE_AFTER_LANGUAGE_MS || '2500', 10);
      if (pausaMs > 0) await new Promise((r) => setTimeout(r, pausaMs));
      return;
    }
    const toggle = this.page.locator('#kc-locale-dropdown button, .pf-c-dropdown__toggle, [aria-haspopup="listbox"]').first();
    await toggle.click({ timeout: 5000 });
    await this.page.waitForSelector('a[id^="language-"]', { state: 'visible', timeout: 5000 });
    const opcionMenu = this.page.locator(`a[id^="language-"]`).filter({ hasText: regexIdioma }).first();
    await opcionMenu.click({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle').catch(() => {});
    const pausaMs = parseInt(process.env.PAUSE_AFTER_LANGUAGE_MS || '2500', 10);
    if (pausaMs > 0) {
      await new Promise((r) => setTimeout(r, pausaMs));
    }
  }

  /** Comprueba que la pantalla esté en el idioma esperado (por el título o texto principal) */
  async estaEnIdioma(nombreIdioma) {
    const titulos = {
      English: /Sign in to your account|Log in to your account/i,
      Español: /Acceder a tu cuenta|Iniciar sesión en tu cuenta/i,
    };
    const regex = titulos[nombreIdioma] || new RegExp(nombreIdioma, 'i');
    const titulo = this.page.locator('h1, h2, [class*="title"], [class*="heading"]').filter({ hasText: regex }).first();
    if (await titulo.isVisible().catch(() => false)) return true;
    return this.page.getByText(regex).first().isVisible().catch(() => false);
  }

  /** Pantalla inicial: título "Acceder a tu cuenta" + botones Google y Microsoft */
  async isAccessScreenWithGoogleAndMicrosoftVisible() {
    const title = this.page.getByText(/Acceder a tu cuenta/i).first();
    const google = this.page.getByText(/GOOGLE/i).first();
    const microsoft = this.page.getByText(/MICROSOFT/i).first();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await title.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    const titleOk = await title.isVisible().catch(() => false);
    const googleOk = await google.isVisible().catch(() => false);
    const microsoftOk = await microsoft.isVisible().catch(() => false);
    return titleOk && googleOk && microsoftOk;
  }

  async isLoginFormVisible() {
    const form = this.page.isVisible(this.selectors.form).catch(() => false);
    const username = this.page.isVisible(this.selectors.username).catch(() => false);
    return Promise.all([form, username]).then(([f, u]) => f || u);
  }

  async getErrorMessage() {
    return this.page.textContent(this.selectors.errorMessage).catch(() => null);
  }

  async waitForRedirect(callbackPattern = /saleads\.ai|callback|dashboard/) {
    await this.page.waitForURL(callbackPattern, { timeout: 20000 }).catch(() => {});
  }
}
