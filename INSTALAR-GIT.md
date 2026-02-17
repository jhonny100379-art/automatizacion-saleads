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

## Primera vez: subir a GitHub (ya tienes cuenta)

1. **Crea un repositorio nuevo en GitHub**
   - Entra en https://github.com/new
   - Nombre del repo (ej.: `automatizacion-saleads` o `saleads-qa`)
   - Elige **público** o privado
   - No marques "Add a README" ni .gitignore (el proyecto ya los tiene)
   - Clic en **Create repository**

2. **Conectar tu proyecto local con ese repo** (sustituye `TU_USUARIO` y `NOMBRE_REPO` por los tuyos):

```powershell
cd "C:\Users\jhonn\OneDrive\Documentos\Automatización_saleads.ai"
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
git push -u origin main
```

Si GitHub te pide usuario/contraseña, usa tu **usuario de GitHub** y un **Personal Access Token** (no la contraseña de la cuenta). Crear token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token (permisos `repo`).
