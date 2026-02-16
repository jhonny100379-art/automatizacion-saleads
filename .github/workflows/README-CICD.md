# CI/CD - Daily QA Automation

## Configuración en GitHub

### Secrets necesarios para el envío de email

En **Settings → Secrets and variables → Actions** agrega:

| Secret             | Descripción |
|--------------------|-------------|
| `EMAIL_USERNAME`   | Correo (ej. tu_cuenta@gmail.com) |
| `EMAIL_PASSWORD`   | Contraseña de aplicación (Gmail: no la contraseña normal) |
| `EMAIL_SMTP_SERVER`| Opcional; por defecto `smtp.gmail.com` |
| `EMAIL_SMTP_PORT`  | Opcional; por defecto `587` |

**Gmail:** Activa verificación en 2 pasos y genera una **Contraseña de aplicación** en tu cuenta de Google; usa esa contraseña en `EMAIL_PASSWORD`.

### Ejecución

- **Automática:** Todos los días a las **7:00 PM (hora Colombia)**.
- **Manual:** **Actions → Daily QA Automation → Run workflow**.

### Artifacts

Tras cada ejecución podrás descargar desde la run:

- `allure-results-<número>`
- `allure-report-<número>`
- `playwright-report-<número>` (si existe)
