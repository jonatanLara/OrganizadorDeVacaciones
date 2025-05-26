# 🛠️ Instalación Paso a Paso del Organizador de Vacaciones

Esta guía te ayudará a instalar correctamente el sistema en Google Sheets usando Google Apps Script.

---

## ✅ Requisitos Previos

- Tener una cuenta de Google.
- Acceder a Google Sheets: https://sheets.google.com
- Acceder al editor de Apps Script: `Extensiones > Apps Script`.

---

## 📥 Paso 1: Crear el Documento

1. Abre [Google Sheets](https://sheets.google.com).
2. Crea un nuevo documento y nómbralo: `Organizador de Vacaciones`.

---

## 🧩 Paso 2: Crear Hoja `Personal`

1. Crea una hoja y nómbrala `Personal`.
2. Inserta las siguientes columnas:

| Nombre | Matrícula | Días Autorizados | MIJITA | Coordinación | Coordinador | Reloj |
|--------|-----------|------------------|--------|--------------|-------------|-------|

3. Llena algunos datos de ejemplo (mínimo 2 usuarios).

---

## 📜 Paso 3: Abrir Apps Script

1. Desde Google Sheets, ve a `Extensiones > Apps Script`.
2. En el archivo que se crea automáticamente (`Código.gs`), elimina el contenido.
3. Copia y pega el contenido de `/src/Código.gs`.

---

## 📄 Paso 4: Añadir Archivos HTML

1. En Apps Script, crea 3 nuevos archivos:

- `CalendarioVacaciones.html`
- `ResumenCompleto.html`
- `LineaDeTiempo.html`

2. Copia el contenido desde `/src/` para cada uno.

---

## ▶️ Paso 5: Autorizar Script

1. Ejecuta la función `onOpen()` o `inicializarSistema()` desde el editor.
2. Se te pedirá autorizar permisos: acepta todo para que el sistema funcione.

---

## 🧪 Verifica que Funcione

- Debe aparecer un nuevo menú en Google Sheets llamado **Gestión de Vacaciones**.
- Desde ahí puedes:
  - Inicializar el sistema
  - Registrar vacaciones (modal)
  - Ver el resumen
  - Ver la línea de tiempo

---

## 🛑 Recomendación de seguridad

- Ejecuta la función `protegerHojasDeUsuario()` para bloquear edición manual de las hojas `Resumen` y `Calendario`.

---

## 📸 Capturas Sugeridas

Guarda estas capturas en la carpeta `/ejemplos/`:

- 📊 `SheetCalendario.jpg` — Vista de la hoja `Calendario`
- 🗓️ `ModalVacaciones.jpg` — Selector de días
- 📈 `LineaDeTiempo.jpg` — Línea de tiempo por proyecto

---

