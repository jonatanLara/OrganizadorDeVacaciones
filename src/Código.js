function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Gestión de Vacaciones')
    .addItem('ℹ️ Acerca del sistema', 'mostrarAcercaDe')
    //.addItem('⚙️ Configurar Sistema', 'mostrarConfiguracionSistema')
    .addItem('🧹 Inicializar Sistema', 'inicializarSistema')
    .addItem('📅 Registrar Vacaciones', 'mostrarSelectorCalendario')
    .addItem('📊 Ver Resumen', 'mostrarResumenCompleto')
    .addItem('🗓️ Línea de Tiempo', 'mostrarLineaDeTiempo') // Nueva opción
    .addItem('🧪 test', 'testDatosLineaDeTiempo')
    .addToUi();
}
//configuracion de fechas
function obtenerConfiguracionFechas() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Configuración');
  if (!sheet) return {};

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const config = {};

  values.forEach(([clave, valor]) => {
    config[clave] = valor;
  });

  return config;
}

function obtenerDatosParaLineaDeTiempoExtendido() {
  const datos = obtenerDatosParaLineaDeTiempo();
  const config = obtenerConfiguracionFechas();
  return {
    empleados: datos.empleados,
    config: config
  };
}

// Configuración inicial
function inicializarSistema() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Configurar hoja de Calendario
  var calendarioSheet = ss.getSheetByName('Calendario') || ss.insertSheet('Calendario');
  calendarioSheet.clear();
  
  // Configurar hoja de Resumen
  var resumenSheet = ss.getSheetByName('Resumen') || ss.insertSheet('Resumen');
  resumenSheet.clear();
  
  // Obtener datos del personal
  var personalSheet = ss.getSheetByName('Personal');
  var personalData = personalSheet.getRange('A2:C' + personalSheet.getLastRow()).getValues();
  
  // Configurar hoja de Resumen
  var encabezadosResumen = [
    'Nombre', 
    'Matrícula', 
    'Días Autorizados', 
    'Días Usados', 
    'Días Restantes', 
    'Días Seleccionados', 
    'Fechas de Vacaciones'
  ];
  
  resumenSheet.getRange(1, 1, 1, encabezadosResumen.length).setValues([encabezadosResumen]);
  
  var resumenData = [];
  personalData.forEach(function(persona) {
    resumenData.push([
      persona[0], // Nombre
      persona[1], // Matrícula
      persona[2], // Días autorizados
      0,          // Días usados
      persona[2], // Días restantes
      '',         // Días seleccionados
      ''          // Fechas de vacaciones
    ]);
  });
  
  resumenSheet.getRange(2, 1, resumenData.length, encabezadosResumen.length).setValues(resumenData);
  
  // Proteger celdas que no deben editarse
  var protection = resumenSheet.protect();
  protection.setUnprotectedRanges([resumenSheet.getRange('G2:G' + (resumenData.length + 1))]);
  
  SpreadsheetApp.getUi().alert('Sistema inicializado correctamente');

  protegerHojasDeUsuario()
}

// Mostrar el selector de calendario
function mostrarSelectorCalendario() {
  var html = HtmlService.createHtmlOutputFromFile('CalendarioVacaciones')
    .setWidth(800)
    .setHeight(600);
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Seleccionar Días de Vacaciones');
}

// Obtener lista de empleados
function obtenerListaEmpleados() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var personalSheet = ss.getSheetByName('Personal');
  var data = personalSheet.getRange('A2:C' + personalSheet.getLastRow()).getValues();
  
  return data.map(function(row) {
    return {
      nombre: row[0],
      matricula: row[1],
      diasAutorizados: row[2]
    };
  });
}

// Obtener información del empleado
function obtenerInfoEmpleado(matricula) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var resumenSheet = ss.getSheetByName('Resumen');
  var personalSheet = ss.getSheetByName('Personal');

  var matriculaColumn = resumenSheet.getRange('B2:B' + resumenSheet.getLastRow()).getValues();
  var rowIndex = -1;
  for (var i = 0; i < matriculaColumn.length; i++) {
    if (matriculaColumn[i][0] == matricula) {
      rowIndex = i + 2;
      break;
    }
  }

  if (rowIndex == -1) return null;

  var empleadoData = resumenSheet.getRange(rowIndex, 1, 1, 7).getValues()[0];
  var fechasVacaciones = empleadoData[6] ? empleadoData[6].split(', ') : [];

  // Buscar en hoja Personal también
  var personalData = personalSheet.getRange('A2:D' + personalSheet.getLastRow()).getValues();
  var mijitaValue = null;
  for (var i = 0; i < personalData.length; i++) {
    if (personalData[i][1] === matricula) {
      mijitaValue = parseInt(personalData[i][3], 10);
      break;
    }
  }

  return {
    nombre: empleadoData[0],
    matricula: empleadoData[1],
    diasAutorizados: empleadoData[2],
    diasUsados: empleadoData[3],
    diasRestantes: empleadoData[4],
    fechasSeleccionadas: fechasVacaciones,
    mijita: mijitaValue
  };
}


// Actualizar días de vacaciones
function actualizarVacaciones(matricula, fechasSeleccionadas) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resumenSheet = ss.getSheetByName('Resumen');
  
  const matriculaColumn = resumenSheet.getRange('B2:B' + resumenSheet.getLastRow()).getValues();
  let rowIndex = -1;
  
  for (let i = 0; i < matriculaColumn.length; i++) {
    if (matriculaColumn[i][0] == matricula) {
      rowIndex = i + 2; // compensar encabezado
      break;
    }
  }

  if (rowIndex === -1) {
    return { success: false, message: 'Empleado no encontrado en hoja Resumen' };
  }

  const diasAutorizados = resumenSheet.getRange(rowIndex, 3).getValue();
  const diasSeleccionados = fechasSeleccionadas.length;

  if (diasSeleccionados > diasAutorizados) {
    return {
      success: false,
      message: `No puede seleccionar más días de los autorizados (${diasAutorizados})`
    };
  }

  // Formatear fechas
  const fechasFormateadas = fechasSeleccionadas.map(f => {
    try {
      const parts = f.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    } catch (e) {
      Logger.log('Error al procesar fecha: ' + f);
      return null;
    }
  }).filter(Boolean);

  fechasFormateadas.sort(); // Ordenar

  // Guardar en hoja
  resumenSheet.getRange(rowIndex, 4).setValue(diasSeleccionados);                    // Días usados
  resumenSheet.getRange(rowIndex, 5).setValue(diasAutorizados - diasSeleccionados); // Días restantes
  resumenSheet.getRange(rowIndex, 6).setValue(diasSeleccionados);                   // Repetido (ajusta si es redundante)
  resumenSheet.getRange(rowIndex, 7).setValue(fechasFormateadas.join(', '));        // Fechas seleccionadas

  // Actualizar línea de tiempo
  try {
    generarLineaDeTiempo();
  } catch (e) {
    Logger.log("Error al generar línea de tiempo: " + e);
  }

  return { success: true, message: 'Vacaciones actualizadas correctamente' };
}


// Función para obtener totales (nueva función)
function obtenerTotales() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var resumenSheet = ss.getSheetByName('Resumen');
  var data = resumenSheet.getRange('A2:G' + resumenSheet.getLastRow()).getValues();
  
  return {
    totalEmpleados: data.length,
    totalAutorizados: data.reduce((sum, row) => sum + (row[2] || 0), 0),
    totalUsados: data.reduce((sum, row) => sum + (row[3] || 0), 0),
    totalRestantes: data.reduce((sum, row) => sum + (row[4] || 0), 0)
  };
}

// Mostrar resumen completo
function mostrarResumenCompleto() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('ResumenCompleto')
    .setWidth(1200)
    .setHeight(800);
  
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Resumen Completo de Vacaciones');
}

// Función para obtener datos del resumen (nueva función)
function obtenerDatosResumen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var resumenSheet = ss.getSheetByName('Resumen');
  return {
    headers: resumenSheet.getRange('A1:G1').getValues()[0],
    data: resumenSheet.getRange('A2:G' + resumenSheet.getLastRow()).getValues()
  };
}

function buscarEmpleados(termino) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var resumenSheet = ss.getSheetByName('Resumen');
  var data = resumenSheet.getRange('A2:G' + resumenSheet.getLastRow()).getValues();
  
  termino = termino.toLowerCase();
  
  return data.filter(function(row) {
    return row[0].toLowerCase().includes(termino) || 
           row[1].toLowerCase().includes(termino);
  }).map(function(row) {
    return {
      nombre: row[0],
      matricula: row[1],
      diasAutorizados: row[2],
      diasUsados: row[3],
      diasRestantes: row[4],
      diasSeleccionados: row[5],
      fechas: row[6]
    };
  });
}

function obtenerDatosProyectos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const personalSheet = ss.getSheetByName('Personal');
  const resumenSheet = ss.getSheetByName('Resumen');
  
  // Obtener proyectos únicos de la columna D (incluyendo mayúsculas/minúsculas)
  const proyectosRaw = personalSheet.getRange('D2:D' + personalSheet.getLastRow()).getValues().flat();
  const proyectos = [...new Set(proyectosRaw
    .map(p => p.toString().trim())
    .filter(p => p !== ""))]; 

  // Combinar datos de Personal y Resumen
  const personalData = personalSheet.getRange('A2:D' + personalSheet.getLastRow()).getValues();
  const vacacionesData = resumenSheet.getRange('A2:G' + resumenSheet.getLastRow()).getValues();

  return proyectos.map(proyecto => ({
    nombre: proyecto,
    empleados: personalData
      .map((row, index) => {
        if (row[3].toString().trim() === proyecto) {
          return {
            nombre: row[0],
            matricula: row[1],
            diasAutorizados: vacacionesData[index][2] || 0,
            fechas: (vacacionesData[index][6] || "").split(', ').filter(f => f)
          };
        }
        return null;
      })
      .filter(Boolean)
  }));
}

// Nueva función para mostrar la vista de línea de tiempo
function mostrarLineaDeTiempo() {
  const html = HtmlService.createHtmlOutputFromFile('LoadingLineaDeTiempo')
    .setWidth(400)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Generando Línea de Tiempo...');
  protegerHojasDeUsuario()
}

// Nueva función para obtener datos específicos para la línea de tiempo
function obtenerDatosParaLineaDeTiempo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Obtener datos de Personal
  const personalSheet = ss.getSheetByName('Personal');
  const personalData = personalSheet.getRange('A2:D' + personalSheet.getLastRow()).getValues();
  
  // Obtener datos de Resumen
  const resumenSheet = ss.getSheetByName('Resumen');
  const resumenData = resumenSheet.getRange('A2:G' + resumenSheet.getLastRow()).getValues();
  
  // Crear un mapa de matrículas a datos de resumen para búsqueda más eficiente
  const resumenMap = {};
  resumenData.forEach(row => {
    resumenMap[row[1]] = { // Usamos la matrícula como clave
      diasAutorizados: row[2],
      diasUsados: row[3],
      fechasVacaciones: row[6] || ''
    };
  });
  
  // Combinar datos correctamente
  const empleados = personalData.map(personalRow => {
    const matricula = personalRow[1];
    const datosResumen = resumenMap[matricula] || {};
    
    return {
      nombre: personalRow[0],
      matricula: matricula,
      proyecto: personalRow[3] || 'Sin Proyecto',
      diasAutorizados: datosResumen.diasAutorizados || 0,
      diasUsados: datosResumen.diasUsados || 0,
      fechasVacaciones: datosResumen.fechasVacaciones || ''
    };
  });
  
  return {
    empleados: empleados
  };
}

function testDatosLineaDeTiempo() {
  const datos = obtenerDatosParaLineaDeTiempo();
  console.log("Total empleados:", datos.empleados.length);
  console.log("Ejemplo de datos:", datos.empleados[0]);
  
  // Mostrar empleados con vacaciones asignadas
  const conVacaciones = datos.empleados.filter(e => e.fechasVacaciones);
  console.log("Empleados con vacaciones asignadas:", conVacaciones.length);
  conVacaciones.forEach(e => {
    console.log(`${e.nombre} (${e.matricula}): ${e.fechasVacaciones}`);
  });
  
  SpreadsheetApp.getUi().alert(`Datos verificados. ${conVacaciones.length} empleados tienen vacaciones asignadas.`);
}

function generarLineaDeTiempo() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var calendarioSheet = ss.getSheetByName('Calendario');
  var resumenSheet = ss.getSheetByName('Resumen');
  var personalSheet = ss.getSheetByName('Personal');

  if (!calendarioSheet || !resumenSheet || !personalSheet) {
    SpreadsheetApp.getUi().alert('Faltan hojas necesarias: Calendario, Resumen o Personal.');
    return;
  }

  calendarioSheet.clear();

  const data = resumenSheet.getRange('A2:G' + resumenSheet.getLastRow()).getValues();

  // Obtener rangos desde la hoja Configuración
  const config = obtenerConfiguracionFechas();

  // Elegir el rango más amplio entre todos los posibles valores de configuración
  const allFechas = [
    new Date(config['RangoInicio_170']),
    new Date(config['RangoFin_170']),
    new Date(config['RangoInicio_150']),
    new Date(config['RangoFin_150']),
  ];

  const minDate = adjustForTimezone(new Date(Math.min(...allFechas.map(d => d.getTime()))));
  const maxDate = adjustForTimezone(new Date(Math.max(...allFechas.map(d => d.getTime()))));

  const startDate = minDate;
  const endDate = maxDate;

  var dateRange = [];
  var currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Crear encabezados
  var headers = ['Empleado'];
  var monthHeaders = [''];
  var dayHeaders = [''];

  var currentMonth = null;
  dateRange.forEach(function (date) {
    var month = date.getMonth();
    if (month !== currentMonth) {
      monthHeaders.push(getMonthName(month));
      currentMonth = month;
    } else {
      monthHeaders.push('');
    }
    dayHeaders.push(date.getDate());
  });

  calendarioSheet.getRange(1, 1, 1, dayHeaders.length).setValues([dayHeaders.map((_, i) => i === 0 ? "Empleado" : "")]);
  calendarioSheet.getRange(2, 1, 1, monthHeaders.length).setValues([monthHeaders]);
  calendarioSheet.getRange(3, 1, 1, dayHeaders.length).setValues([dayHeaders]);

  calendarioSheet.getRange(1, 1, 3, dayHeaders.length)
    .setBackground('#f5f7fa')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  var personalData = personalSheet.getRange('A2:D' + personalSheet.getLastRow()).getValues();
  var proyectoMap = {};
  personalData.forEach(function (row) {
    proyectoMap[row[1]] = row[3] || 'Sin Proyecto';
  });

  var proyectos = {};
  data.forEach(function (row) {
    var matricula = row[1];
    var proyecto = proyectoMap[matricula] || 'Sin Proyecto';
    if (!proyectos[proyecto]) proyectos[proyecto] = [];

    proyectos[proyecto].push({
      nombre: row[0],
      matricula: row[1],
      fechasVacaciones: row[6] || ''
    });
  });

  var row = 4;
  Object.keys(proyectos).forEach(function (proyecto) {
    calendarioSheet.getRange(row, 1)
      .setValue(proyecto)
      .setBackground('#e8f0fe')
      .setFontWeight('bold')
      .setHorizontalAlignment('left');
    row++;

    calendarioSheet.getRange(row, 2, 1, dayHeaders.length - 1)
      .setBackground('#e8f0fe');

    proyectos[proyecto].forEach(function (empleado) {
      if (!empleado.nombre || !empleado.matricula) return;

      calendarioSheet.getRange(row, 1)
        .setValue(empleado.nombre + '\n' + empleado.matricula)
        .setVerticalAlignment('middle')
        .setWrap(true);

      var vacationDates = (empleado.fechasVacaciones || '')
        .split(',')
        .map(d => {
          const trimmed = d.trim();
          if (!trimmed) return '';
          const parts = trimmed.split('-');
          const date = new Date(parts[0], parts[1] - 1, parts[2]);
          return formatDate(date);
        })
        .filter(d => d.length > 0);

      for (var col = 2; col <= dateRange.length + 1; col++) {
        var date = dateRange[col - 2];
        var dateStr = formatDate(date);
        var cell = calendarioSheet.getRange(row, col);

        cell.clearFormat();

        if (dateStr === formatDate(new Date())) {
          cell.setBackground('#fbbc05').setFontWeight('bold');
        } else if (vacationDates.includes(dateStr)) {
          cell.setBackground('#34a853')
            .setValue('✓')
            .setFontColor('#ffffff')
            .setFontWeight('bold')
            .setHorizontalAlignment('center');
        } else if (date.getDay() === 0 || date.getDay() === 6) {
          cell.setBackground('#f9f9f9');
        }
      }

      row++;
    });
  });

  calendarioSheet.setColumnWidth(1, 200);
  for (var col = 2; col <= dayHeaders.length; col++) {
    calendarioSheet.setColumnWidth(col, 30);
  }

  var lastRow = calendarioSheet.getLastRow();
  for (var r = 4; r <= lastRow; r++) {
    calendarioSheet.setRowHeight(r, 40);
  }

  calendarioSheet.setFrozenRows(3);
  calendarioSheet.setFrozenColumns(1);

  var dataRange = calendarioSheet.getRange(1, 1, lastRow, dayHeaders.length);
  dataRange.setBorder(true, true, true, true, true, true);

  SpreadsheetApp.getActiveSpreadsheet().toast("Línea de tiempo generada correctamente.");
}


// Función auxiliar para formatear fecha como YYYY-MM-DD
function formatDate(date) {
  // Asegurarnos de que trabajamos con fecha local (sin problemas de UTC)
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
  
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Ajusta una fecha para compensar el desfase por zona horaria.
 * Devuelve un objeto `Date` corregido en zona horaria del script.
 */
function adjustForTimezone(date) {
  const timezone = Session.getScriptTimeZone();
  const formatted = Utilities.formatDate(date, timezone, 'yyyy-MM-dd');
  const parts = formatted.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// Función auxiliar para obtener nombre del mes en español
function getMonthName(monthIndex) {
  var months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return months[monthIndex];
}

/* Protegemos las hojas para que no se editen */
function protegerHojasDeUsuario() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojas = ['Resumen', 'Calendario'];
  const usuario = Session.getEffectiveUser(); // Opcional: para dejarte como editor

  hojas.forEach(nombreHoja => {
    const hoja = ss.getSheetByName(nombreHoja);
    if (!hoja) return;

    // Eliminar protecciones anteriores
    const protecciones = hoja.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    protecciones.forEach(p => p.remove());

    // Crear nueva protección
    const proteccion = hoja.protect().setDescription(`Protección de hoja ${nombreHoja}`);
    proteccion.setWarningOnly(false); // Bloquea completamente

    // Quitar todos los editores (opcionalmente mantener al dueño/script)
    proteccion.removeEditors(proteccion.getEditors());
    
    // También evitar que los colaboradores del archivo tengan acceso implícito
    if (proteccion.canDomainEdit()) {
      proteccion.setDomainEdit(false);
    }

    // Opcional: permitir que TÚ puedas seguir editando manualmente (útil para mantenimiento)
    // proteccion.addEditor(usuario); 
  });
}

function mostrarAcercaDe() {
  const html = HtmlService.createHtmlOutput(`
    <div style="font-family: 'Roboto', sans-serif; text-align: center; color: #333;">
      <div style="margin-bottom: 8px;">
        <img src="https://github.com/jonatanLara/jonatanLara/blob/main/src/avatar.png?raw=true"
             alt="Avatar de Jonatan Lara" 
             style="width: 178px; height: 178px; border-radius: 50%;" />
      </div>
      <h2 style="color: #3C7E32; margin-bottom: 10px;">Organizador de Vacaciones</h2>
      <p style="margin-bottom: 15px;">Desarrollado con ❤️ por <strong>Jonatan Lara</strong></p>
      <p style="margin-bottom: 10px;">Repositorio del proyecto:</p>
      <a href="https://github.com/jonatanLara/OrganizadorDeVacaciones" target="_blank" 
         style="color: #4285f4; font-weight: bold; text-decoration: none;">
         github.com/jonatanLara/OrganizadorDeVacaciones
      </a>
      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        Consulta la guía de instalación paso a paso en el archivo <code>InstalaciónPasoAPaso.md</code> del repositorio.
      </p>
    </div>
  `).setWidth(520).setHeight(420);

  SpreadsheetApp.getUi().showModalDialog(html, 'Acerca del sistema');
}


