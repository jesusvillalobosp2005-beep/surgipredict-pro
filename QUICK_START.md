# SurgiPredict Pro - QUICK START GUIDE
## ⚡ Comienza en 5 minutos

---

## 1️⃣ INSTALACIÓN RÁPIDA

### Opción A: Usar en Claude.ai (Sin instalación)
✅ **Recomendado para: Testing, demos, desarrollo**

1. Copia el contenido de `surgipredict-pro.jsx`
2. Pega en un nuevo chat de Claude.ai
3. ¡Listo! Usa la aplicación directamente

**Ventajas:**
- No requiere instalación
- Acceso inmediato
- Ideal para pruebas rápidas

---

### Opción B: Vercel (Recomendado para Producción)
✅ **Recomendado para: Producción, clínicas, profesionales**

```bash
# 1. Crea cuenta en vercel.com (gratuita)

# 2. Conecta tu repositorio de GitHub
#    a. Sube los archivos a GitHub
#    b. Vercel detecta automáticamente el proyecto React

# 3. Configura variables de entorno en Vercel Dashboard:
#    - REACT_APP_ANTHROPIC_API_KEY=sk-ant-xxxxx

# 4. Deploy automático
#    Vercel despliega automáticamente en cada push a GitHub
```

**Tu sitio estará disponible en:** `https://tu-app.vercel.app`

---

### Opción C: Local Development
✅ **Recomendado para: Desarrollo, personalización**

```bash
# 1. Requiere Node.js 16+ (descarga en nodejs.org)

# 2. Clona/descarga los archivos
git clone https://github.com/turepositorio/surgipredict-pro.git
cd surgipredict-pro

# 3. Instala dependencias
npm install

# 4. Configura variables de entorno
#    Copia .env.example a .env.local
cp .env.example .env.local

# 5. Edita .env.local con tu API key
REACT_APP_ANTHROPIC_API_KEY=sk-ant-xxxxx

# 6. Inicia servidor de desarrollo
npm start

# Abre http://localhost:3000 en tu navegador
```

**Para build de producción:**
```bash
npm run build
# Los archivos listos para producción están en ./build
```

---

### Opción D: Docker
✅ **Recomendado para: Servidores, escalabilidad**

```bash
# 1. Asume que tienes Docker instalado

# 2. Construye la imagen
docker build -t surgipredict-pro .

# 3. Ejecuta el contenedor
docker run -p 3000:3000 \
  -e REACT_APP_ANTHROPIC_API_KEY=sk-ant-xxxxx \
  surgipredict-pro

# Accede a http://localhost:3000
```

---

## 2️⃣ OBTÉN TU API KEY

### Paso a Paso:

1. **Crea cuenta en Anthropic**
   - Visita: https://console.anthropic.com
   - Regístrate o inicia sesión

2. **Genera API Key**
   - Ve a "API Keys" en el menú lateral
   - Haz clic en "Create Key"
   - Dale un nombre descriptivo (ej: "SurgiPredict-Production")
   - **COPIA y guarda en lugar seguro**

3. **Configura en tu app**
   - En Vercel: Settings → Environment Variables
   - En desarrollo local: `.env.local`
   - En Docker: variable de entorno `-e REACT_APP_ANTHROPIC_API_KEY=...`

⚠️ **SEGURIDAD:** Nunca compartas tu API key. Es como tu contraseña de banco.

---

## 3️⃣ FUNCIONALIDADES PRINCIPALES

### 🏥 Patient Information Tab
```
✓ Datos demográficos del paciente
✓ Carga de imágenes (Antes/Después)
✓ Historial médico
✓ Tipo de piel (Fitzpatrick 1-6)
✓ Información de alergias y medicamentos
```

### 🎯 Prediction Tab
```
✓ Controles deslizantes para parámetros quirúrgicos
✓ Visualización 3D en tiempo real
✓ Ajuste dinámico de parámetros
✓ Selección de técnica quirúrgica
✓ Vista previa instantánea
```

### 🤖 AI Recommendations Tab
```
✓ Análisis clínico impulsado por IA
✓ Recomendaciones personalizadas
✓ Evaluación de riesgos
✓ Timeline de recuperación
✓ Alternativas de técnicas
```

### 📊 Report Tab
```
✓ Generación de reportes luxury
✓ Descarga en formato luxury
✓ Datos del paciente compilados
✓ Imágenes antes/después incluidas
```

---

## 4️⃣ PARÁMETROS QUIRÚRGICOS

Cada parámetro se ajusta de **-100 a +100**:

| Parámetro | -100 | 0 | +100 |
|-----------|------|---|------|
| **Nasal Bridge** | Reducir | Sin cambio | Aumentar |
| **Nasal Width** | Estrechar | Sin cambio | Ensanchar |
| **Lip Volume** | Reducir | Sin cambio | Aumentar |
| **Jawline** | Suavizar | Sin cambio | Definir |
| **Cheekbones** | Bajar | Sin cambio | Proyectar |
| **Skin Tightness** | Laxitud | Normal | Tensor |
| **Asymmetry Correction** | Sin corr. | - | Corr. completa |

---

## 5️⃣ INTEGRACIÓN CON IA (Claude)

La aplicación utiliza **Claude Sonnet 4** para:

1. **Análisis facial** - Proporciones, simetría, calidad de piel
2. **Recomendaciones quirúrgicas** - Técnicas óptimas para cada paciente
3. **Evaluación de riesgos** - Complicaciones potenciales
4. **Timeline de recuperación** - Expectativas realistas
5. **Alternativas de técnicas** - Comparación de enfoques

**Limitaciones de API:**
- 50,000 tokens/minuto (plan básico)
- ~1,000 tokens por análisis
- Máximo 50 análisis/minuto

**Para aumentar límites:**
- Accede a console.anthropic.com
- Ve a Settings → Limits
- Solicita aumento manual

---

## 6️⃣ SERVIDOR BACKEND (OPCIONAL)

Para análisis más avanzados, ejecuta el servidor Node.js:

```bash
# 1. Instala dependencias del servidor
npm install express cors multer sharp dotenv @anthropic-ai/sdk

# 2. Configura .env
ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=5000

# 3. Ejecuta el servidor
node server.js

# 4. El frontend se conectará automáticamente a http://localhost:5000
```

**Endpoints disponibles:**
```
POST /api/analyze-image         - Analiza fotos de pacientes
POST /api/recommendations       - Genera recomendaciones quirúrgicas
POST /api/compare-techniques    - Compara técnicas
POST /api/generate-report       - Crea reportes
GET  /api/health                - Verifica estado
GET  /api/rate-limit            - Información de límites
```

---

## 7️⃣ ARCHIVO .env TEMPLATE

Crea `.env.local` o `.env` con este contenido:

```bash
# REQUIRED - Obten en console.anthropic.com
REACT_APP_ANTHROPIC_API_KEY=sk-ant-xxxxx

# API Configuration
REACT_APP_API_URL=https://api.anthropic.com/v1
REACT_APP_MODEL=claude-sonnet-4-20250514

# Environment
REACT_APP_ENV=production
REACT_APP_LOG_LEVEL=info

# Image Processing
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_SUPPORTED_FORMATS=jpg,png,jpeg,webp

# Database (Optional)
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_KEY=

# Firebase (Optional)
REACT_APP_FIREBASE_PROJECT=
REACT_APP_FIREBASE_API_KEY=

# Sentry (Optional - Error tracking)
REACT_APP_SENTRY_DSN=
```

---

## 8️⃣ COMANDOS ÚTILES

```bash
# Desarrollo
npm start                 # Inicia servidor en puerto 3000
npm run lint             # Verifica código
npm run format           # Formatea código automáticamente

# Producción
npm run build            # Crea build optimizado
npm test                 # Ejecuta tests
npm run eject            # ⚠️ NO HAGAS ESTO - irreversible

# Docker
docker build -t surgipredict .
docker run -p 3000:3000 surgipredict
```

---

## 9️⃣ SOLUCIÓN DE PROBLEMAS

### ❌ "Invalid API Key"
```
✅ Solución:
1. Ve a console.anthropic.com
2. Genera nueva API key
3. Copia la clave completa (sin espacios)
4. Pégala en .env.local o Vercel Settings
```

### ❌ "Canvas not rendering"
```
✅ Solución:
1. Asegúrate de usar navegador moderno
2. Chrome/Firefox/Safari actualizados
3. Habilita JavaScript
4. Intenta en modo incógnito
```

### ❌ "Image upload failing"
```
✅ Solución:
1. Archivo máximo 10MB
2. Formatos: JPG, PNG, WebP
3. Conexión a internet estable
4. Revisa consola (F12) para errores
```

### ❌ "Slow AI analysis"
```
✅ Solución:
1. Reduce tamaño de imagen
2. Optimiza imágenes con compressor.io
3. Aumenta tokens en console.anthropic.com
4. Usa conexión de internet más rápida
```

---

## 🔟 MEJORES PRÁCTICAS

### Seguridad
```
✓ Nunca commits API keys a GitHub
✓ Usa .env.local para desarrollo
✓ Usa Vercel Environment Variables para producción
✓ Rota API keys regularmente
✓ Monitorea uso de tokens
```

### Performance
```
✓ Optimiza imágenes antes de subir
✓ Usa compresión JPEG (calidad 85%)
✓ Implementa lazy loading
✓ Cachea resultados de análisis
✓ Monitorea tiempos de respuesta
```

### UX/Experiencia
```
✓ Proporciona feedback visual
✓ Muestra spinners durante procesamiento
✓ Maneja errores elegantemente
✓ Proporciona instrucciones claras
✓ Prueba en múltiples dispositivos
```

---

## 📱 COMPATIBLE CON

- ✅ Chrome/Edge (versión 90+)
- ✅ Firefox (versión 88+)
- ✅ Safari (versión 14+)
- ✅ Mobile (iPhone/Android)
- ✅ Tablets
- ✅ Pantallas grandes (4K)

---

## 🎓 RECURSOS ADICIONALES

- **Documentación Anthropic:** https://docs.anthropic.com
- **Vercel Docs:** https://vercel.com/docs
- **React Documentation:** https://react.dev
- **Node.js Guide:** https://nodejs.org/docs

---

## 📞 SOPORTE

Si encuentras problemas:

1. **Revisa este guide** - Probablemente esté aquí
2. **Consulta IMPLEMENTATION_GUIDE.md** - Más detalles técnicos
3. **Contáctanos** - surgipredict@youremail.com
4. **GitHub Issues** - https://github.com/yourusername/surgipredict-pro/issues

---

## ✅ CHECKLIST DE INICIO

- [ ] Descargué `surgipredict-pro.jsx`
- [ ] Obtuve API key de console.anthropic.com
- [ ] Configuré .env.local (o variables en Vercel)
- [ ] Ejecuté `npm install` (si desarrollo local)
- [ ] Ejecuté `npm start` o desplegué en Vercel
- [ ] Pruebo funcionalidad básica
- [ ] Cargué una imagen de prueba
- [ ] Ajusté parámetros quirúrgicos
- [ ] Generé recomendaciones de IA
- [ ] Descargué un reporte de prueba

---

## 🎉 ¡LISTO!

Tu sistema SurgiPredict Pro está activo. 

**Próximos pasos:**
1. Personaliza UI con tu branding
2. Integra con tu base de datos de pacientes
3. Configura HIPAA compliance (si es clínica)
4. Entrena a cirujanos en la plataforma
5. Recopila feedback para mejoras

---

**Versión:** 1.0.0  
**Última actualización:** 2025  
**Licencia:** Comercial - Contacta para detalles
