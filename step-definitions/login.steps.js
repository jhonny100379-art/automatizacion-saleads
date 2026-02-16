import { Given, When, Then } from '@cucumber/cucumber';
import { KeycloakLoginPage } from '../pages/KeycloakLoginPage.js';
import { expect } from '@playwright/test';

Given('que estoy en la página de login de Keycloak de Saleads', async function () {
  this.loginPage = new KeycloakLoginPage(this.page, this.baseUrl);
});

When('abro la URL de autenticación de Saleads', async function () {
  const authUrl = process.env.AUTH_URL || this.loginPage.getDefaultAuthUrl();
  await this.loginPage.navigateToLogin(authUrl);
});

When('inicio sesión con usuario {string} y contraseña {string}', async function (usuario, contraseña) {
  const user = process.env.TEST_USER || usuario;
  const pass = process.env.TEST_PASSWORD || contraseña;
  await this.loginPage.login(user, pass);
});

Then('debo ver la pantalla {string} con las opciones de Google y Microsoft', async function (_tituloEsperado) {
  const visible = await this.loginPage.isAccessScreenWithGoogleAndMicrosoftVisible();
  expect(visible).toBeTruthy();
});

When('hago clic en el botón Microsoft', async function () {
  this.popupMicrosoft = null;
  const context = this.page.context();
  try {
    const [popup] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }),
      this.loginPage.clickBotonMicrosoft(),
    ]);
    this.popupMicrosoft = popup;
  } catch {
    this.popupMicrosoft = null;
  }
});

When('cierro la ventana emergente de Microsoft', async function () {
  await this.loginPage.cerrarVentanaEmergenteMicrosoft(this.popupMicrosoft || null);
  this.popupMicrosoft = null;
  await this.page.waitForLoadState('domcontentloaded').catch(() => {});
});

When('cierro la ventana de Microsoft con la X', async function () {
  await this.loginPage.cerrarVentanaEmergenteMicrosoft(this.popupMicrosoft || null);
  this.popupMicrosoft = null;
  await this.page.waitForLoadState('domcontentloaded').catch(() => {});
});

Then('debo permanecer en la pantalla de acceso con Google y Microsoft', async function () {
  const visible = await this.loginPage.isAccessScreenWithGoogleAndMicrosoftVisible();
  expect(visible).toBeTruthy();
});

When('en el modal {string} doy clic en el botón Comenzar', async function (textoModal) {
  await this.loginPage.enModalConTextoClicComenzar(textoModal);
});

When('en el modal {string} doy clic en la X', async function (_textoModal) {
  await this.loginPage.enModalConectaMetaClicX();
});

When('selecciono el idioma {string}', async function (nombreIdioma) {
  await this.loginPage.seleccionarIdioma(nombreIdioma);
});

Then('la pantalla debe mostrarse en el idioma {string}', async function (nombreIdioma) {
  const ok = await this.loginPage.estaEnIdioma(nombreIdioma);
  expect(ok).toBeTruthy();
});

Then('la pantalla debe mostrarse en inglés', async function () {
  const ok = await this.loginPage.estaEnIdioma('English');
  expect(ok).toBeTruthy();
});

Then('la pantalla debe mostrarse en español', async function () {
  const ok = await this.loginPage.estaEnIdioma('Español');
  expect(ok).toBeTruthy();
});

Then('debo ver el formulario de inicio de sesión', async function () {
  const visible = await this.loginPage.isLoginFormVisible();
  expect(visible).toBeTruthy();
});

Then('debo ser redirigido tras el login exitoso', async function () {
  await this.loginPage.waitForRedirect();
  const url = this.page.url();
  const success = /saleads\.ai|callback|dashboard|auth/.test(url) && !/login-actions/.test(url);
  expect(success).toBeTruthy();
});

Then('debo ver un mensaje de error en el formulario', async function () {
  const error = await this.loginPage.getErrorMessage();
  expect(error).toBeTruthy();
});
