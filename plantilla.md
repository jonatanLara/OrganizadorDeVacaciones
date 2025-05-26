# 🗓️ Organizador de Vacaciones con Google Sheets y Apps Script

**Organizador de Vacaciones** es una solución construida sobre Google Sheets + Apps Script que permite a organizaciones gestionar fácilmente los días de vacaciones de su personal mediante una interfaz interactiva y visual.

---

## ✅ Características

- Registro de días de vacaciones por usuario
- Interfaz HTML amigable para selección de fechas
- Validación por número de días autorizados
- Línea de tiempo por proyecto y exportación a PDF
- Hojas protegidas contra edición manual
- Visualización de resumen por persona

---

## 📸 Captura de Pantalla

<p align="center">
  <img 
    src="https://github.com/jonatanLara/OrganizadorDeVacaciones/blob/main/Ejemplos/SheetCalendario.jpg?raw=true" 
    alt="Hoja Calendario"
    width="700"
  />
</p>

---

## 🧰 Tecnologías utilizadas

- Google Sheets
- Google Apps Script (backend)
- HTML, CSS, JS (Frontend embebido)
- Google Apps Script UI para modales y menús
- html2pdf.js (para exportar línea de tiempo)

---

## 🚀 Instalación

1. Clona este repositorio o descarga los archivos.
2. Abre [Google Sheets](https://docs.google.com/spreadsheets/u/0/) y crea un nuevo documento.
3. Abre el editor de Apps Script: `Extensiones > Apps Script`.
4. Copia el contenido del archivo `Código.gs` en el archivo principal del script.
5. Crea 3 archivos adicionales en el editor:
   - `CalendarioVacaciones.html`
   - `ResumenCompleto.html`
   - `LineaDeTiempo.html`
6. Pega el contenido correspondiente en cada archivo.
7. Guarda y recarga tu hoja.

---

## 🛠️ Cómo usar

- Al ejecutar `Inicializar Sistema`, se crean automáticamente las hojas necesarias.
- Usa el menú `Gestión de Vacaciones` que aparece en Google Sheets para:
  - Registrar vacaciones (modal HTML)
  - Ver resumen
  - Ver línea de tiempo
- Las hojas `Resumen` y `Calendario` están protegidas para evitar edición directa.

---

## 🧪 Pruebas rápidas

- Usa la opción `Test` en el menú para validar si hay registros activos de vacaciones.
- Exporta la línea de tiempo como PDF con un clic.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas!  
Si tienes mejoras, errores que reportar o ideas para funciones nuevas, no dudes en abrir un issue o pull request.

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

## 👤 Autor

**Jonatan Lara**  
[GitHub](https://github.com/jonatanLara) | [YouTube](https://www.youtube.com/@jonatanlara) | [Instagram](https://www.instagram.com/jonatanlaraortiz/)

---