# Saleads – Automatización QA

Proyecto de pruebas E2E con **Playwright**, **BDD Gherkin** (Cucumber) y **POM** en JavaScript.

## Estructura

```
├── config/playwright.config.js
├── features/login/           # Features Gherkin
├── step-definitions/         # Pasos Cucumber
├── pages/                    # Page Object Model (BasePage, KeycloakLoginPage)
├── support/                  # World, hooks
├── report/                   # Reportes (generados)
├── cucumber.config.js
├── .env.example
└── PROMPT_EXPERTO_AUTOMATIZACION_QA.md   # Prompt para el experto QA
```

## Requisitos

- Node.js 18+
- npm o pnpm
- **Reporte Allure:** Java 8+ (para `allure-commandline`)

## Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` y configura (opcional):

- `BASE_URL` – Base de Keycloak (por defecto: https://keycloak-qa.saleads.ai)
- `TEST_USER` / `TEST_PASSWORD` – Credenciales de prueba para login
- `AUTH_URL` – URL completa de login (si usas la URL con `code_challenge` de tu app, pégala aquí)
- `HEADLESS=false` – Para ver el navegador durante las pruebas

Para usar la URL exacta de acceso a cuenta (con PKCE):

```env
AUTH_URL=https://keycloak-qa.saleads.ai/realms/sale-ads/protocol/openid-connect/auth?response_type=code&client_id=front&redirect_uri=https%3A%2F%2Fqa.saleads.ai%2Fapi%2Fauth%2Fcallback%2Fkeycloak&scope=openid+email+profile+offline_access&code_challenge=...&code_challenge_method=S256
```

## Ejecución

**Primera vez:** instalar navegadores de Playwright:

```bash
npx playwright install chromium
```

```bash
# Todas las features (headless)
npm test

# Ver el navegador
HEADLESS=false npm run test:headed

# Ver reporte HTML de Cucumber
npm test
# Abrir report/cucumber-report.html

# Ejecutar tests y abrir reporte Allure en el navegador
npm run test:allure

# Ver el navegador durante los tests y luego abrir reporte Allure (recomendado)
npm run test:allure:ver
```

- **`test:allure`**: ejecuta los casos en headless, genera el reporte Allure y lo abre en el navegador.
- **`test:allure:ver`**: abre el navegador para ver los casos en pantalla, al terminar genera y abre el reporte Allure.

El servidor del reporte permanece activo hasta que cierres la terminal (Ctrl+C).

### Sesión persistente (npm run login)

Para que los tests no pidan correo ni contraseña cada vez:

```bash
npm run login
```

- Se abre el navegador (Chrome si está instalado, si no Chromium) con opciones que reducen el bloqueo de Google ("No puedes acceder").
- Inicia sesión (con Google, Microsoft o usuario/contraseña) y al terminar presiona **Enter** en la consola. La sesión se guarda en `chromium-profile/`.
- Si **Google sigue bloqueando**: pon en `.env` tu usuario de pruebas (`TEST_USER` y `TEST_PASSWORD`) y en la pantalla de Keycloak elige **"Iniciar sesión con usuario y contraseña"**; el script intentará iniciar sesión automáticamente y guardar la sesión.

## Casos de prueba incluidos

- **Ver formulario de login**: Navegar a la URL de Keycloak y comprobar que el formulario de login está visible.
- **Login con credenciales válidas**: Ejemplo con tabla (ajusta usuario/contraseña en `.env` o en la tabla del feature).
- **Login con credenciales inválidas**: Comprobar que se muestra mensaje de error.

## Prompt experto

En `PROMPT_EXPERTO_AUTOMATIZACION_QA.md` tienes el **prompt para que un asistente actúe como experto** en automatización (POM, BDD, Gherkin, Playwright, JavaScript) y te ayude a ampliar o refactorizar el proyecto.
