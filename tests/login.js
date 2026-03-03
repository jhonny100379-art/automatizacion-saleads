/**
 * Login con perfil persistente - Saleads QA
 * Si en .env tienes TEST_USER y TEST_PASSWORD, inicia sesión automáticamente
 * (formulario usuario/contraseña de Keycloak) y guarda la sesión en chromium-profile.
 * Si no, abre la pantalla de login para que inicies sesión a mano y luego Enter.
 *
 * Uso: npm run login
 */
import 'dotenv/config';
import { chromium } from 'playwright';
import { CHROMIUM_PROFILE_PATH, persistentContextOptions, IGNORE_AUTOMATION_FLAG } from '../playwright.config.js';
import { KeycloakLoginPage } from '../pages/KeycloakLoginPage.js';
import readline from 'readline';

const BASE_URL = process.env.BASE_URL || 'https://keycloak-qa.saleads.ai';
const REALM = process.env.KEYCLOAK_REALM || 'sale-ads';
const REDIRECT_URI = encodeURIComponent('https://qa.saleads.ai/api/auth/callback/keycloak');
const CODE_CHALLENGE = process.env.CODE_CHALLENGE || 'A0S4Gsbad3uo3cnXBA9xtupCW4M91Wi8y2CFr0rw3QA';

const LOGIN_URL = process.env.AUTH_URL || `${BASE_URL}/realms/${REALM}/protocol/openid-connect/auth?response_type=code&client_id=front&redirect_uri=${REDIRECT_URI}&scope=openid%20email%20profile%20offline_access&code_challenge=${encodeURIComponent(CODE_CHALLENGE)}&code_challenge_method=S256`;

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
}

async function main() {
  const cwd = process.cwd();
  log('Carpeta de ejecución: ' + cwd);
  log('Iniciando navegador con perfil persistente...');

  // Usar Chrome instalado (menos bloqueado por Google) y quitar flag de automatización
  const launchOptions = {
    headless: persistentContextOptions.headless,
    args: persistentContextOptions.args,
    viewport: persistentContextOptions.viewport,
    ignoreHTTPSErrors: persistentContextOptions.ignoreHTTPSErrors,
    locale: persistentContextOptions.locale,
    ignoreDefaultArgs: IGNORE_AUTOMATION_FLAG,
  };

  let context;
  try {
    try {
      context = await chromium.launchPersistentContext(CHROMIUM_PROFILE_PATH, {
        ...launchOptions,
        channel: 'chrome',
      });
      log('Usando Chrome instalado (mejor compatibilidad con Google).');
    } catch (_) {
      context = await chromium.launchPersistentContext(CHROMIUM_PROFILE_PATH, launchOptions);
      log('Usando Chromium. Si Google bloquea el acceso, configura TEST_USER y TEST_PASSWORD en .env para usar usuario/contraseña.');
    }
  } catch (err) {
    console.error('No se pudo abrir el navegador:', err.message);
    console.error('Asegúrate de: 1) Ejecutar desde la carpeta del proyecto. 2) Cerrar otras ventanas de Chrome/Chromium que usen el mismo perfil.');
    process.exit(1);
  }

  log('Navegador iniciado.');
  log('Perfil cargado: ' + CHROMIUM_PROFILE_PATH);

  const page = context.pages()[0] || await context.newPage();
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

  log('Pantalla de login abierta: ' + LOGIN_URL);

  const testUser = process.env.TEST_USER || '';
  const testPassword = process.env.TEST_PASSWORD || '';

  if (testUser && testPassword) {
    log('Credenciales de prueba (TEST_USER) encontradas en .env. Iniciando sesión automáticamente...');
    await new Promise((r) => setTimeout(r, 3000)); // dar tiempo a que cargue la página Keycloak
    try {
      const loginPage = new KeycloakLoginPage(page, BASE_URL);
      await loginPage.login(testUser, testPassword);
      await page.waitForURL(/qa\.saleads\.ai|saleads\.ai/, { timeout: 20000 }).catch(() => {});
      log('Sesión iniciada. La sesión se guardará al cerrar.');
    } catch (err) {
      console.error('No se pudo iniciar sesión automáticamente:', err.message);
      console.log('  Comprueba que en Keycloak exista la opción "Iniciar sesión con usuario y contraseña" y que el usuario/contraseña sean correctos.');
      console.log('  Inicia sesión manualmente en el navegador y luego presiona Enter aquí.\n');
    }
  }

  console.log('\n========================================');
  console.log('  GUARDAR SESIÓN EN EL PERFIL');
  console.log('========================================');
  console.log('  Si ya iniciaste sesión (automático o manual),');
  console.log('  presiona Enter para cerrar el navegador y guardar');
  console.log('  la sesión. Los tests no volverán a pedir correo ni contraseña.');
  console.log('========================================\n');

  await new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Presiona Enter para cerrar el navegador y guardar la sesión... ', () => {
      rl.close();
      resolve();
    });
  });

  await context.close();
  log('Navegador cerrado. Sesión guardada en el perfil.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
