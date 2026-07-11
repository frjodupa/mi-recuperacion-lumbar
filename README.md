# Mi Recuperación Lumbar

PWA profesional para acompañar la rehabilitación lumbar tras artrodesis. La aplicación organiza rutinas autorizadas, biblioteca de ejercicios, temporizador inteligente, asistente diario, historial médico, estadísticas, exportación de datos y funcionamiento offline.

La app está pensada para uso personal y registro local. No sustituye el seguimiento de un traumatólogo, médico rehabilitador o fisioterapeuta.

## Tecnologías Utilizadas

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- LocalStorage para persistencia local
- Web App Manifest
- Service Worker para PWA y modo offline

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Vite mostrará una URL local, normalmente `http://127.0.0.1:5173/` o el siguiente puerto disponible.

## Compilación

```bash
npm run build
```

El resultado de producción se genera en `dist/`.

## Vista Previa de Producción

```bash
npm run preview
```

## Estructura del Proyecto

```text
.
├── public/
│   ├── exercise-photos/     # Fotografías reales de ejercicios
│   ├── icons/               # Iconos PWA
│   ├── manifest.json        # Configuración instalable PWA
│   ├── offline.html         # Pantalla offline
│   └── sw.js                # Service Worker
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── data/                # Datos iniciales de ejercicios, rutinas y fases
│   ├── hooks/               # Hooks de persistencia
│   ├── modules/             # Registro de módulos escalables de rehabilitación
│   ├── pages/               # Pantallas principales
│   ├── services/            # Servicios de temporizador, sonido y voz
│   ├── types/               # Tipos TypeScript compartidos
│   ├── utils/               # Utilidades de almacenamiento y migración
│   ├── App.tsx              # Enrutado interno de pantallas
│   ├── main.tsx             # Entrada React
│   └── styles.css           # Estilos globales y tema
├── CHANGELOG.md
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Funcionalidades Principales

- Asistente diario con registro de dolor, rigidez, fatiga, sueño y estado de ánimo.
- Biblioteca de ejercicios con filtros, fotos reales y material disponible.
- Rutinas programadas con temporizador inteligente de trabajo y descanso.
- Pantalla completa de ejercicio con objetivo, respiración, errores, beneficios y criterios de parada.
- Historial médico detallado.
- Dashboard de progreso con estadísticas, calendario, rachas y ejercicios más usados.
- Modo claro, oscuro y automático.
- Exportación e importación de datos en JSON.
- Exportación profesional a PDF mediante impresión.
- PWA instalable y preparada para funcionar offline.
- Arquitectura preparada para futuros módulos: rodilla, cervical, hombro, cadera y tobillo.

## Persistencia y Privacidad

Los datos se guardan en LocalStorage del navegador. La aplicación no envía información a servidores y está preparada para una futura sincronización opcional sin romper el modelo local.

Cuando cambie el modelo de datos, se debe mantener compatibilidad mediante migraciones en `src/utils/storage.ts`.

## Política de Actualización

Cada cambio publicable debe cumplir:

- No alterar la URL pública.
- No borrar LocalStorage existente.
- Migrar datos antiguos si cambia el modelo.
- Incrementar la versión en `package.json` y `package-lock.json`.
- Actualizar `CHANGELOG.md`.
- Ejecutar `npm run build`.
- Corregir errores antes de publicar.
- Actualizar el nombre de caché del Service Worker cuando cambien assets publicados.
- Evitar cambios que rompan la PWA instalada.

## Despliegue

1. Ejecuta `npm run build`.
2. Sube el contenido de `dist/` al hosting elegido.
3. Mantén `manifest.json`, `sw.js`, `offline.html`, `assets/`, `icons/` y `exercise-photos/` accesibles desde la raíz pública.
4. Usa HTTPS para instalación PWA y Service Worker fuera de `localhost`.
