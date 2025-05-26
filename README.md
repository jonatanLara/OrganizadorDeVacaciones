<p align="center">
  <img src="https://github.com/jonatanLara/OrganizadorDeVacaciones/blob/main/ejemplos/57616e68-eb4c-4d62-91f5-e764fa8c820d.png?raw=true" alt="Organizador de Vacaciones Banner" width="100%" />
</p>

<p style="text-align: center;">
<table style="border: none;">
  <tr>
    <td width="140">
      <img src="https://avatars.githubusercontent.com/u/5728020?v=4" width="120" style="border-radius: 50%;" />
    </td>
    <td>
        <summary><b>🔗 Lista de redes sociales</b></summary>
        <img alt="GitHub followers" src="https://img.shields.io/github/followers/jonatanLara?style=social">
        <img alt="YouTube Channel Subscribers" src="https://img.shields.io/youtube/channel/subscribers/UCledsnzGqlKpvKOaHYUvHHQ?style=social&logo=youtube&logoColor=%23ff0000">
        <p>Puedes ver los recursos y el proyecto completo en el siguiente link:</p>
<a href="https://github.com/jonatanLara/OrganizadorDeVacaciones">
<b>github.com/jonatanLara/OrganizadorDeVacaciones</b>
</a>
</td>
  </tr>
</table>
</p>

## Organizador de vacaciones :chart_with_upwards_trend:
Es un organizador de vacaciones, te permite registrar por medio de una interfaz el control de los días asignados por usuario


> Creación del documento

Crea una hoja de googleSheet
1. Crear una hoja **Personal**
2. Crear una tabla
3. Añadir el código en AppScript

#### Paso 1. Crear una tabla
Accede a tu cuenta de google y selecciona la aplicación de googleSheet y crea un nuevo documento. ó accede al siguiente link :link: [googleSheet](https://docs.google.com/spreadsheets/u/0/ "Nuevo documento")
 Cambia el nombre de la hoja o crea una nueva hoja con el nombre de **_Personal_**

#### Paso 2. Crear una tabla			
| Nombre | Matrícula | Días Autorizados | MIJITA | Coordinación | Coordinador | Reloj |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |


```javascript
/**
 * @Nombre - El nombre completo de la persona 
 * @Matricula - En mi caso la Matrícula es el número del mi empleado o mi ID
 * @DiasAutorizados - Es el número de días que se le autorizo al personal 
 * @MIJITA - El mi caso tengo personal de dos projectos diferentes 150 y 170
 * @Coordinacion - Esta columna es de ayda para visualizar a que área pertenecen
 * @Coordinador - Esta columna es de ayuda para visualizar quien es su jefe directo
 * @Reloj - Esta columna es de ayuda ya que las personas registran sus asistencia en diferente oficina
*/
```
#### Paso 3. Añadir el código en AppScript
##### Vamos a crear 3 documentos adicionales:  
:heavy_check_mark: CalendarioVacaciones.html  
:heavy_check_mark: ResumenCompleto.html  
:heavy_check_mark: LineaDeTiempo.html  
:heavy_check_mark: Código.gs  

> Este ultimo _Código.gs_ me lo genera automatico appscript

Copiamos, pegamos y guardamos el código que esta en el respositorio.

> Es importante que al ejecutar el código siempre estemos en archivo _código.gs_. Al ejecutar el código por primera vez te perdira permisos, los aceptamos y miramos nuestro documento de google sheet.

Notaremos que al ejecutar en nuestro documento de googlesheet en el menu notaremos que despues de la opción de ayuda, nos aparece un menu llamado Gestión de Vacaciones. Al darle clic nos aparecera una lista:
* Iniciar Sistema
* Registrar Vacaciones
* Ver resumen
* Linea de Tiempo
* Test

#### Iniciar Sistema
:warning: Es importante que para que el sistema se prepare debemos empezar dando clic en esta opción esto permitira crear las hojas necesarias para que se almacene los registros que se hagan por usuario.

> notaremos que se nos crearon dos hojas adicionales, llamadas Resumen y Calendario. Estas no las editaremos. 

#### Registrar Vacaciones
:exclamation: Esta opción me abrar un ventana modal, donde elejiremos a la persona que deseamos asignarle sus dias de vacaciones. El Buscador te da sujerencias que encuentra de tu tabla Personal. Al seleccionar al usuario que deseemos, nos aparecera un calendario donde elegiremos los días qeu deseamos otorgarles. Solo te permitira los días totales a los que tiene derecho. Podemos hacer una selecion multiple de las fechas y alternadas. Para finalizar seleccionamos guardar. cerramos el modal (Ventana). 

#### Ver resumen
:exclamation: Esta opción me permite ver los dias asignados por persona.

#### Linea de Tiempo
:exclamation: Esta opción me permite ver los días seleccionados de todo el personal por medio de una linea del tiempo esto nos ayuda a observar visualmente cuando colisionan las fechas entre usuarios. Podemos notar que los dias que tiene sus vacaciones se representa por un cuadro de color verde. Tambien tenemos una opción adicional que permire exportar esa infomación en PDF.
#### Test
:exclamation: Esta opción me permite ver si tengo registros de personas con registros de vacaciones es una alerta y su objetivo es hacer un test.

Hoja Calendario

<p align="center">
  <img 
    src="https://github.com/jonatanLara/OrganizadorDeVacaciones/blob/main/Ejemplos/SheetCalendario.jpg?raw=true" 
    alt="Hoja Calendario"
    width="700"
  />
</p>