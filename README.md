# SurgiPredict Pro

Proyecto React/Vite listo para desplegar en Vercel.

## Comandos

```bash
npm install
npm run dev
npm run build
```

En Windows PowerShell, si `npm` aparece bloqueado por politicas de ejecucion, usa:

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

## Vercel

Configuracion recomendada:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

No subas `node_modules` ni `dist` al repositorio. Ya estan ignorados en `.gitignore`.

Lee [PASOS_ACTIVACION_VERCEL.md](./PASOS_ACTIVACION_VERCEL.md) para la guia paso a paso.
