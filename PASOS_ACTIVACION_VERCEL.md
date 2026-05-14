# SurgiPredict Pro - Activacion en Vercel

Esta carpeta ya es el proyecto final listo para desplegar. No subas solo el archivo `.jsx`; sube toda esta carpeta porque Vercel necesita `package.json`, `index.html`, `src/` y la configuracion de build.

## Activacion local rapida

1. Abre una terminal en esta carpeta:
   `C:\Users\Jesus\Documents\Codex\2026-05-14\files-mentioned-by-the-user-surgipredict`
2. Instala dependencias:
   `npm install`
   Si PowerShell bloquea `npm`, usa:
   `npm.cmd install`
3. Prueba la app:
   `npm run dev`
   En PowerShell bloqueado:
   `npm.cmd run dev`
4. Abre la URL que muestre Vite, normalmente:
   `http://localhost:5173`
5. Prueba el build de produccion:
   `npm run build`

## Activacion en Vercel con GitHub

1. Crea un repositorio nuevo en GitHub.
2. Sube todo el contenido de esta carpeta al repositorio, excepto `node_modules` y `dist`.
3. Entra a Vercel y elige `Add New...` > `Project`.
4. Importa el repositorio de GitHub.
5. En la pantalla de configuracion usa estos valores:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Pulsa `Deploy`.
7. Cuando termine, Vercel te dara una URL tipo:
   `https://surgipredict-pro.vercel.app`

## Si Vercel vuelve a fallar

Revisa el log de deploy y confirma estos puntos:

- El repositorio contiene `package.json` en la raiz.
- El archivo `src/App.jsx` existe.
- El archivo `index.html` existe en la raiz.
- La version de Node en Vercel es 18.18 o superior.
- El Output Directory es exactamente `dist`, no `build`.

## Nota clinica

SurgiPredict Pro debe usarse como herramienta de visualizacion, documentacion o apoyo. No sustituye evaluacion medica, consentimiento informado ni criterio clinico profesional.
