
# 🛠️ Mejoras Aplicadas al Proyecto `OrganizadorDeVacaciones`

## 📌 Objetivo General

Modernizar, hacer dinámico y mejorar la experiencia de usuario del sistema de solicitud y visualización de vacaciones. Se implementaron ajustes configurables, mejoras visuales y funcionales tanto en frontend como backend de Apps Script + HTML.

---

## ✅ 1. Configuración dinámica de fechas por empleado

**Archivo afectado:**
- `Código.js`
- `CalendarioVacaciones.html`
- Hoja `Configuración` en Google Sheets

**Cambios:**
- Se implementó la función `obtenerConfiguracionFechas()` para obtener los rangos de fechas desde una hoja llamada `Configuración`.
- Las fechas permitidas para selección en el calendario ahora se ajustan según el valor `MIJITA` y la configuración:
  - `RangoInicio_170`, `RangoFin_170`
  - `RangoInicio_150`, `RangoFin_150`
- Se agregó también el parámetro `PermitirFechasPasadas`.

---

## ✅ 2. Interfaz del calendario mejorada

**Archivo afectado:**
- `CalendarioVacaciones.html`

**Cambios:**
- Se corrigió el problema de selección fuera del rango configurado.
- Se agregó:
  - Validación estricta de `startDate` y `endDate`
  - Bloqueo visual de días no permitidos
- Mejora visual del botón Guardar con contador de días seleccionados.

---

## ✅ 3. Spinner al guardar fechas

**Archivo afectado:**
- `CalendarioVacaciones.html`

**Cambios:**
- Se agregó un spinner visual con mensaje **“Guardando vacaciones…”**
- Aparece solo al hacer clic en “Guardar” y se oculta automáticamente al terminar.
- Asegura retroalimentación al usuario durante el proceso.

---

## ✅ 4. Corrección del guardado de fechas en Apps Script

**Archivo afectado:**
- `Código.js → actualizarVacaciones()`

**Cambios:**
- Se corrigió el formateo de fechas para evitar errores de formato.
- Se eliminaron errores de referencias no definidas como `formatDate(date)` mal usada.
- Se asegura la escritura correcta en hoja `Resumen` para:
  - Días usados
  - Días restantes
  - Fechas seleccionadas

---

## ✅ 5. Generación de línea de tiempo respetando fechas de configuración

**Archivo afectado:**
- `Código.js → generarLineaDeTiempo()`

**Cambios:**
- El rango de fechas generado se obtiene dinámicamente de los parámetros configurados.
- Se agregó la función auxiliar `adjustForTimezone(date)` para alinear fechas a la zona horaria del script.
- Se corrigieron errores de fechas fuera de rango.
- Se mejoró la visualización por proyecto, pintando:
  - Fechas de vacaciones en verde con "✓"
  - Día actual en amarillo

---

## ✅ 6. Modal de carga real para generar la línea de tiempo

**Archivos afectados:**
- `LoadingLineaDeTiempo.html`
- `Código.js → mostrarLineaDeTiempo()`

**Cambios:**
- Se reemplazó el `HtmlOutput` original por un modal con spinner.
- El HTML inicia la ejecución de `generarLineaDeTiempo()` usando `google.script.run`.
- Al finalizar:
  - Se cambia el mensaje a “✅ Línea de tiempo generada”
  - Se cierra automáticamente el modal

---

## ✅ 7. Información del desarrollador y repositorio

**Ubicación:**
- Modal informativo del sistema (opcional)
- Footer o encabezado del calendario

**Datos incluidos:**
- Nombre del desarrollador
- Avatar de GitHub (opcional)
- Repositorio oficial: [github.com/jonatanLara/OrganizadorDeVacaciones](https://github.com/jonatanLara/OrganizadorDeVacaciones)
- Instrucciones para obtener más información

---

## 📁 Archivos agregados

- `LoadingLineaDeTiempo.html`: Modal visual para mostrar carga real
- `Configuración` (hoja en Spreadsheet): Parámetros editables por administrador

---

## 🧪 Funciones auxiliares creadas

- `adjustForTimezone(date)`: Compensar desfase horario en Apps Script
- `formatDate(date)`: Estandariza fechas al formato `'yyyy-MM-dd'`

---

## 🏁 Estado actual

✔️ Comportamiento dinámico de fechas  
✔️ Cierre del modal solo cuando termina el proceso  
✔️ Generación de línea de tiempo optimizada  
✔️ Guardado validado y visualmente retroalimentado  
✔️ Proyecto más mantenible y personalizable
