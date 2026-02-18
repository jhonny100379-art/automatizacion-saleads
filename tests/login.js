/**
 * Login manual con perfil persistente - Saleads QA
 * Primera ejecución: abre saleads.ai y permite hacer login manual (sin Passkey/WebAuthn).
 * Siguientes ejecuciones: reutiliza la sesión guardada en ./chromium-profile.
 *
 * Uso: npm run login
 */
import { chromium } from 'playwright';
import { CHROMIUM_PROFILE_PATH, persistentContextOptions } from '../playwright.config.js';
import readline from 'readline';

const SALEADS_URL = 'https://saleads.ai';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
}

async function main() {
  const cwd = process.cwd();
  log('Carpeta de ejecución: ' + cwd);
  log('Iniciando navegador con perfil persistente...');

  let context;
  try {
    context = await chromium.launchPersistentContext(CHROMIUM_PROFILE_PATH, {
    headless: persistentContextOptions.headless,
    args: persistentContextOptions.args,
    viewport: persistentContextOptions.viewport,
    ignoreHTTPSErrors: persistentContextOptions.ignoreHTTPSErrors,
    locale: persistentContextOptions.locale,
  });
  } catch (err) {
    console.error('No se pudo abrir el navegador:', err.message);
    console.error('Asegúrate de: 1) Ejecutar desde la carpeta del proyecto. 2) Cerrar otras ventanas de Chromium que usen el mismo perfil.');
    process.exit(1);
  }

  log('Navegador iniciado.');
  log('Perfil cargado: ' + CHROMIUM_PROFILE_PATH);

  const page = context.pages()[0] || await context.newPage();
  await page.goto(SALEADS_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

  log('Página abierta: ' + SALEADS_URL);

  console.log('\n--- Realiza el login manualmente en la ventana del navegador. ---');
  console.log('--- La sesión se guardará en el perfil para la próxima vez. ---');
  console.log('--- Presiona Enter en esta consola cuando termines (o cierra el navegador). ---\n');

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
