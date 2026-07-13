# ROADMAP
## Mi Recuperación Lumbar

**Versión del documento:** 1.0  
**Estado:** Hoja de ruta inicial  
**Prioridad:** Artrodesis lumbar  

---

# 1. Objetivo general

Desarrollar una aplicación sencilla, segura y especializada en el acompañamiento del paciente durante la recuperación tras una artrodesis lumbar.

La prioridad no es añadir muchas funciones.

La prioridad es:

- simplificar la experiencia;
- organizar la recuperación;
- ayudar al paciente a comprender su situación;
- ofrecer seguimiento útil;
- incorporar inteligencia artificial de forma segura;
- evitar que la aplicación se convierta en una app de fitness general.

---

# 2. Principio de desarrollo

Cada nueva función debe responder afirmativamente a esta pregunta:

> ¿Hace que la recuperación sea más sencilla, más segura o más comprensible?

Si la respuesta es no, la función se pospone o se descarta.

---

# 3. Fase 0 — Consolidación del producto

## Objetivo

Detener la expansión desordenada y definir una base coherente.

## Tareas

- Crear `PROJECT_DNA.md`.
- Crear documentación estratégica.
- Revisar navegación actual.
- Detectar duplicidades.
- Identificar funciones que deben fusionarse.
- Mantener datos existentes.
- Evitar nuevas funciones hasta completar la simplificación.

## Resultado esperado

Un proyecto con dirección clara y reglas de desarrollo estables.

---

# 4. Fase 1 — Simplificación de navegación

## Objetivo

Reducir la complejidad de la aplicación.

## Navegación principal

La app debe quedar organizada en cuatro áreas:

1. Inicio.
2. Mi recuperación.
3. Mi evolución.
4. Mi asistente.

## Acciones

- Unificar Rutina y Biblioteca dentro de Mi recuperación.
- Unificar Progreso e Historial dentro de Mi evolución.
- Mover Ajustes, Perfil e Información a una sección secundaria.
- Eliminar accesos duplicados.
- Mantener navegación inferior en móvil.
- Mantener menú lateral en escritorio.
- No perder datos ni funcionalidades existentes.

## Resultado esperado

Una navegación comprensible en pocos segundos.

---

# 5. Fase 2 — Inicio simplificado

## Objetivo

Convertir el inicio en una pantalla útil y calmada.

## Contenido principal

- saludo dinámico;
- frase motivadora;
- días desde la operación;
- chequeo diario;
- próxima sesión;
- botón principal “Comenzar rehabilitación”;
- progreso diario;
- próxima revisión, si existe.

## Reglas

- una acción principal;
- menos tarjetas;
- menos texto;
- información avanzada fuera de la vista inicial;
- diseño limpio y accesible.

## Resultado esperado

El usuario sabe inmediatamente qué debe hacer.

---

# 6. Fase 3 — Onboarding del paciente

## Objetivo

Recoger los datos esenciales sin abrumar.

## Información

- nombre;
- fecha de intervención;
- tipo de intervención;
- nivel lumbar;
- fase actual;
- autorización profesional;
- equipamiento;
- dolor inicial;
- rigidez;
- fatiga;
- movilidad;
- objetivos;
- próxima revisión.

## Reglas

- formulario por pasos;
- campos opcionales claramente indicados;
- guardado local;
- posibilidad de edición posterior;
- no pedir datos innecesarios;
- aviso médico obligatorio.

## Resultado esperado

La aplicación queda personalizada desde el primer uso.

---

# 7. Fase 4 — Sesión guiada

## Objetivo

Transformar las rutinas en una experiencia sencilla y fluida.

## Flujo

1. Chequeo previo.
2. Resumen de la sesión.
3. Un ejercicio por pantalla.
4. Temporizador o repeticiones.
5. Descanso.
6. Siguiente ejercicio.
7. Registro posterior.
8. Resumen final.

## Cada ejercicio debe mostrar

- fotografía real;
- nombre;
- posición;
- instrucciones breves;
- respiración;
- series;
- repeticiones o tiempo;
- descanso;
- advertencias;
- botón completar;
- botón detener.

## Resultado esperado

El usuario puede completar una sesión sin perderse.

---

# 8. Fase 5 — Evolución

## Objetivo

Mostrar progreso de forma clara.

## Datos principales

- dolor;
- rigidez;
- fatiga;
- sueño;
- sesiones;
- tiempo total;
- días activos;
- incidencias;
- observaciones.

## Visualización

- resumen semanal;
- resumen mensual;
- comparativa simple;
- gráficos fáciles de interpretar;
- lenguaje no clínico;
- sin exceso de estadísticas.

## Resultado esperado

El usuario entiende si está mejorando.

---

# 9. Fase 6 — Historia clínica

## Objetivo

Organizar documentos médicos en una línea temporal.

## Documentos admitidos

- alta hospitalaria;
- informe quirúrgico;
- traumatología;
- rehabilitación;
- fisioterapia;
- resonancia;
- TAC;
- EMG;
- revisiones;
- otros informes.

## Cada documento debe incluir

- fecha;
- tipo;
- archivo original;
- resumen;
- puntos importantes;
- restricciones;
- profesional;
- centro;
- próxima revisión;
- preguntas relacionadas.

## Resultado esperado

Toda la información clínica está organizada y accesible.

---

# 10. Fase 7 — Lectura de informes con IA

## Objetivo

Permitir que el usuario suba una captura, fotografía o PDF y reciba una explicación sencilla.

## Flujo

1. Subir documento.
2. Extraer texto.
3. Detectar datos relevantes.
4. Mostrar resumen.
5. Mostrar términos explicados.
6. Mostrar restricciones encontradas.
7. Pedir confirmación.
8. Guardar solo lo confirmado.

## Reglas de seguridad

La IA no debe:

- diagnosticar;
- prescribir;
- modificar tratamientos;
- desbloquear ejercicios automáticamente;
- afirmar que una restricción ha desaparecido sin confirmación.

## Resultado esperado

El paciente entiende mejor sus informes.

---

# 11. Fase 8 — Asistente documental

## Objetivo

Permitir preguntas sobre los documentos del usuario.

## Ejemplos

- ¿Qué nivel me operaron?
- ¿Qué restricciones aparecen en el último informe?
- ¿Cuándo es mi próxima revisión?
- ¿Qué cambió entre dos informes?
- ¿Qué preguntas debería llevar a consulta?

## Reglas

- responder solo con información disponible;
- indicar el documento utilizado;
- avisar cuando falte información;
- diferenciar hechos, inferencias y dudas;
- no sustituir al profesional sanitario.

## Resultado esperado

La aplicación se convierte en un asistente contextual.

---

# 12. Fase 9 — Preparación de consultas

## Objetivo

Generar un resumen útil para traumatólogo, rehabilitador o fisioterapeuta.

## Contenido

- evolución de síntomas;
- sesiones realizadas;
- incidencias;
- ejercicios completados;
- cambios recientes;
- preguntas del paciente;
- documentos nuevos;
- restricciones vigentes.

## Formato

- pantalla;
- PDF;
- exportación;
- compartir manualmente.

## Resultado esperado

El paciente llega mejor preparado a la consulta.

---

# 13. Fase 10 — Privacidad y seguridad

## Objetivo

Proteger datos sensibles.

## Acciones

- explicar almacenamiento local;
- permitir exportar datos;
- permitir borrar datos;
- separar datos locales y sincronizados;
- evitar información médica en notificaciones;
- solicitar consentimiento;
- registrar confirmaciones;
- proteger documentos sensibles.

## Resultado esperado

El usuario sabe dónde están sus datos y controla su información.

---

# 14. Funciones pospuestas

No desarrollar todavía:

- fitness general;
- catálogo masivo de musculación;
- retos;
- rankings;
- red social;
- tienda;
- recomendaciones comerciales;
- dietas;
- portal médico complejo;
- integración con aseguradoras;
- recomendaciones automáticas de medicación;
- diagnósticos mediante IA.

---

# 15. Próximo sprint recomendado

## Sprint: Simplificación UX — Artrodesis lumbar

### Objetivos

1. Reducir navegación a cuatro áreas.
2. Mantener todas las funciones actuales sin perder datos.
3. Limpiar la pantalla de inicio.
4. Reorganizar Rutina y Biblioteca.
5. Reorganizar Progreso e Historial.
6. Preparar el espacio para Mi asistente.
7. Verificar móvil, tablet y escritorio.
8. Mantener tema claro y oscuro.
9. Ejecutar build.
10. No añadir nuevas funciones.

---

# 16. Criterios de aceptación

La fase de simplificación estará completada cuando:

- el usuario entienda la navegación en menos de 10 segundos;
- pueda iniciar una sesión en menos de un minuto;
- no existan accesos duplicados;
- no se pierdan datos;
- la versión móvil sea cómoda;
- el dashboard no esté sobrecargado;
- la aplicación mantenga su identidad visual;
- el build finalice sin errores.

---

# 17. Regla de control

No avanzar a la fase de IA hasta que:

- la navegación esté simplificada;
- el onboarding sea funcional;
- la sesión guiada sea estable;
- la evolución sea comprensible;
- el modelo de datos esté preparado.

---

# 18. Estado actual

## Completado

- PWA base.
- React + TypeScript + Vite.
- almacenamiento local;
- rutinas;
- ejercicios;
- sesiones;
- progreso;
- historial;
- temas visuales;
- despliegue.

## En revisión

- navegación;
- onboarding;
- densidad de información;
- coherencia de pantallas;
- tema oscuro;
- estructura de datos clínicos.

## Pendiente

- historia clínica;
- lectura de informes;
- asistente documental;
- preparación de consultas;
- simplificación completa.

---

# 19. Próxima acción

Después de guardar este documento:

1. Actualizar `AGENTS.md`.
2. Obligar a Codex GPT a leer `PROJECT_DNA.md` y `ROADMAP.md`.
3. Crear el prompt del Sprint de Simplificación UX.
4. Revisar la propuesta antes de ejecutar cambios.