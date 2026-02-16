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

When('selecciono el idioma {string}', async function (nombreIdioma) {
  await this.loginPage.seleccionarIdioma(nombreIdioma);
});

Then('la pantalla debe mostrarse en el idioma {string}', async function (nombreIdioma) {
  const ok = await this.loginPage.estaEnIdioma(nombreIdioma);
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
