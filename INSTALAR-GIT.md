# Solución: "git no se reconoce"

El mensaje indica que **Git no está instalado** o no está en el PATH de Windows.

## Opción 1 – Instalar con winget (recomendado)

Abre **PowerShell como administrador** (clic derecho en PowerShell → "Ejecutar como administrador") y ejecuta:

```powershell
winget install --id Git.Git -e
```

Cierra **todas** las ventanas de PowerShell o Cursor y vuelve a abrirlas. Luego ejecuta en la carpeta del proyecto:

```powershell
cd "C:\Users\jhonn\OneDrive\Documentos\Automatización_saleads.ai"
git add .
git commit -m "Add CI/CD daily QA automation with email reporting at 7PM Colombia"
git push
```

## Opción 2 – Instalar desde la web

1. Entra en **https://git-scm.com/download/win** y descarga el instalador.
2. Durante la instalación, deja marcada la opción **"Add Git to the PATH"** (o similar).
3. Finaliza la instalación y **cierra y vuelve a abrir** PowerShell o la terminal de Cursor.
4. Ejecuta los comandos `git add .`, `git commit` y `git push` desde la carpeta del proyecto.

## Comprobar que Git funciona

En una terminal nueva:

```powershell
git --version
```

Si ves algo como `git version 2.x.x`, ya puedes usar `git add`, `git commit` y `git push`.

---

## Primera vez: subir a GitHub

Si acabas de hacer `git init` y tu proyecto aún no está en GitHub:

1. Crea un repositorio nuevo en GitHub (sin README, sin .gitignore).
2. En la carpeta del proyecto ejecuta (sustituye `TU_USUARIO` y `TU_REPO`):

```powershell
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

Si el repo ya existe y solo faltaba inicializar Git, con `git remote add origin ...` y `git push -u origin main` basta.
