import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  Media,
  Header,
  Footer,
} from "docx";
import { SimpleField } from "docx";
import { saveAs } from "file-saver";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import MapaUbicacion from './MapaUbicacion'
import RegistroFotografico from './RegistroFotografico';
import { PageBreak } from "docx";
import { toPng } from 'html-to-image';
import Logo from '../img/Logo.png';
import { TableOfContents } from "docx";
import ciudadesData from '../data/colombia.json';
import Select from 'react-select';
import 'leaflet/dist/leaflet.css'
import MapaDeCalor from "./MapaDeCalor";
import FormularioAreas from "./SubcomponenteFRiesgo/FormularioAreas";


export default function FormularioInspeccion() {
  const location = useLocation();
  const datosPrevios = location.state || {};
  // Información general
  const municipios = ciudadesData.flatMap(dep =>
    dep.ciudades.map(ciudad => ({
      label: `${ciudad} - ${dep.departamento}`,
      value: ciudad
    }))
  );
  const [formData, setFormData] = useState({
    ciudad_siniestro: datosPrevios.ciudad || "",
      departamento_siniestro: datosPrevios.departamento || "",
      aseguradora: datosPrevios.aseguradora || "",
      direccion: datosPrevios.direccion || "",
      asegurado: datosPrevios.asegurado || "",
      fechaInspeccion: datosPrevios.fechaInspeccion || "",
  });



  const [barrio, setBarrio] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [horarioLaboral, setHorarioLaboral] = useState("");


  const [cargo, setCargo] = useState("");
  const [colaboladores, setColaboladores] = useState("");

  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [direccion, setDireccion] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [personaEntrevistada, setPersonaEntrevistada] = useState("");


  // Datos de inspección
const [nombreCliente, setNombreCliente] = useState(datosPrevios.nombreCliente || "");
  //const [ciudad, setCiudad] = useState("");
  const [aseguradora, setAseguradora] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imagenesRegistro, setImagenesRegistro] = useState([]);

  // Empresa y riesgo
  const [descripcionEmpresa, setDescripcionEmpresa] = useState("");
  const [infraestructura, setInfraestructura] = useState("");


  // Análisis de riesgos
  const [analisisRiesgos, setAnalisisRiesgos] = useState({
    "Incendio/Explosión": "",
    "Amit": "",
    "Anegación": "",
    "Daños por agua": "",
    "Terremoto": "",
    "Sustracción": "",
    "Rotura de maquinaria": "",
    "Responsabilidad civil": ""
  });

  // Infraestructura
  const [antiguedad, setAntiguedad] = useState("");
  const [areaLote, setAreaLote] = useState("");
  const [areaConstruida, setAreaConstruida] = useState("");
  const [numeroEdificios, setNumeroEdificios] = useState("");
  const [numeroPisos, setNumeroPisos] = useState("");
  const [sotanos, setSotanos] = useState("");
  const [tenencia, setTenencia] = useState(""); // Propio o arrendado
  const [descripcionInfraestructura, setDescripcionInfraestructura] = useState("");

  // Procesos
  const [procesos, setProcesos] = useState("");
  const [areas, setAreas] = useState([]);
  const [datosEquipos, setDatosEquipos] = useState([]);



  // Linderos
  const [linderoNorte, setLinderoNorte] = useState("");
  const [linderoSur, setLinderoSur] = useState("");
  const [linderoOriente, setLinderoOriente] = useState("");
  const [linderoOccidente, setLinderoOccidente] = useState("");
  // Mapa
  const mapaRef = useRef(null);

  //Servicios Industriales
  const [energiaProveedor, setEnergiaProveedor] = useState("");
  const [energiaTension, setEnergiaTension] = useState("");
  const [energiaPararrayos, setEnergiaPararrayos] = useState("");
  const [transformadores, setTransformadores] = useState({
    subestacion: "",
    marca: "",
    tipo: "",
    capacidad: "",
    edad: "",
    voltaje: ""
  });

  // Seguridad Electrónica
  const [alarmaMonitoreada, setAlarmaMonitoreada] = useState("");
  const [cctv, setCctv] = useState("");
  const [mantenimientoSeguridad, setMantenimientoSeguridad] = useState("");
  const [comentariosSeguridadElectronica, setComentariosSeguridadElectronica] = useState("");

  // Seguridad Física
  const [tipoVigilancia, setTipoVigilancia] = useState("");
  const [horariosVigilancia, setHorariosVigilancia] = useState("");
  const [accesos, setAccesos] = useState("");
  const [personalCierre, setPersonalCierre] = useState("");
  const [cerramientoPredio, setCerramientoPredio] = useState("");
  const [otrosCerramiento, setOtrosCerramiento] = useState("");
  const [comentariosSeguridadFisica, setComentariosSeguridadFisica] = useState("");

  const [plantasElectricas, setPlantasElectricas] = useState({
    numero: "",
    marca: "",
    tipo: "",
    capacidad: "",
    edad: "",
    transferencia: "",
    voltajeCobertura: ""
  });
  const [energiaComentarios, setEnergiaComentarios ] =useState("");

  const [transformadorSubestacion, setTransformadorSubestacion] = useState("");
  const [transformadorMarca, setTransformadorMarca] = useState("");
  const [transformadorTipo, setTransformadorTipo] = useState("");
  const [transformadorCapacidad, setTransformadorCapacidad] = useState("");
  const [transformadorEdad, setTransformadorEdad] = useState("");
  const [transformadorRelacionVoltaje, setTransformadorRelacionVoltaje] = useState("");

  const [plantaNumero1, setPlantaNumero1] = useState("");
  const [plantaMarca1, setPlantaMarca1] = useState("");
  const [plantaTipo1, setPlantaTipo1] = useState("");
  const [plantaCapacidad1, setPlantaCapacidad1] = useState("");
  const [plantaEdad1, setPlantaEdad1] = useState("");
  const [plantaTransferencia1, setPlantaTransferencia1] = useState("");
  const [plantaVoltaje1, setPlantaVoltaje1] = useState("");
  const [plantaCobertura1, setPlantaCobertura1] = useState("");

  const [plantaNumero2, setPlantaNumero2] = useState("");
  const [plantaMarca2, setPlantaMarca2] = useState("");
  const [plantaTipo2, setPlantaTipo2] = useState("");
  const [plantaCapacidad2, setPlantaCapacidad2] = useState("");
  const [plantaEdad2, setPlantaEdad2] = useState("");
  const [plantaTransferencia2, setPlantaTransferencia2] = useState("");
  const [plantaVoltaje2, setPlantaVoltaje2] = useState("");
  const [plantaCobertura2, setPlantaCobertura2] = useState("");





  //Agua
  const [aguaFuente, setAguaFuente] = useState("");
  const [aguaUso, setAguaUso] = useState("");
  const [aguaAlmacenamiento, setAguaAlmacenamiento] = useState("");
  const [aguaBombeo, setAguaBombeo] = useState("");
  const [aguaComentarios, setAguaComentarios] = useState("");

  // Proteccion contra Incendios
  const [extintor, setExtintor] = useState("");
  const [rci, setRci] = useState("");
  const [rociadores, setRociadores] = useState("");
  const [deteccion, setDeteccion] = useState("");
  const [alarmas, setAlarmas] = useState("");
  const [brigadas, setBrigadas] = useState("");
  const [bomberos, setBomberos] = useState("");


  //Seguridad
  const [seguridadDescripcion, setSeguridadDescripcion] = useState("");

  // Siniestralidad

  const [siniestralidad, setSiniestralidad] = useState("");

  // recomendaciones 

  const [recomendaciones, setRecomendaciones] = useState("");

  const [maquinariaDescripcion, setMaquinariaDescripcion] = useState("");





  // Tabla de riesgo
  const [tablaRiesgos, setTablaRiesgos] = useState([
    { riesgo: "Incendio/Explosión", probabilidad: "", severidad: "", clasificacion: "" },
    { riesgo: "AMIT", probabilidad: "", severidad: "", clasificacion: "" },
    { riesgo: "Anegación", probabilidad: "", severidad: "", clasificacion: "" },
    { riesgo: "Terremoto", probabilidad: "", severidad: "", clasificacion: "" },
    { riesgo: "Sustracción", probabilidad: "", severidad: "", clasificacion: "" },
    { riesgo: "Rotura de maquinaria", probabilidad: "", severidad: "", clasificacion: "" },
    { riesgo: "Responsabilidad Civil", probabilidad: "", severidad: "", clasificacion: "" },
  ]);


  // Mensajes predeterminados
  const mensajesRecomendados = [
    "Se recomienda actualizar el plan de emergencias.",
    "Instalar un sistema de alarma contra incendios.",
    "Realizar mantenimiento preventivo a los equipos.",
    "Capacitar al personal en evacuación y manejo de extintores.",
    "Actualizar señalización de rutas de evacuación.",
    "Implementar un programa de inspección mensual.",
  ];

  // Lista de recomendaciones (puedes ponerlas resumidas aquí o importarlas desde un JSON o txt si prefieres)
  const bancoRecomendaciones = {
    "INCENDIO": [
      "DURANTE EL PERÍODO DE VIGENCIA DE LA PÓLIZA DEBE VERIFICARSE EL CORRECTO ACONDICIONAMIENTO DE LAS INSTALACIONES ELÉCTRICAS Y SU RESPECTIVO MANTENIMIENTO COMO MÍNIMO CADA 6 MESES, QUE INCLUYA ENTUBAR TODOS LOS CIRCUITOS DE DISTRIBUCIÓN DE ENERGÍA, ELIMINAR EL USO DE EXTENSIONES COMO MEDIO PERMANENTE DE CONEXIÓN Y CIERRE DE TODAS LAS CAJAS DE PASO, TABLEROS DE DISTRIBUCIÓN DE ENERGÍA, PUNTOS DE CABLEADO EXPUESTO, LUMINARIAS, INTERRUPTORES Y TOMAS ELÉCTRICAS.",
      "REALIZAR DURANTE LA VIGENCIA DE LA PÓLIZA LA SUSPENSIÓN DEL SUMINISTRO DE ENERGÍA ELÉCTRICA, DURANTE LAS HORAS Y DÍAS NO LABORABLES A LOS CIRCUITOS DE DISTRIBUCIÓN ELÉCTRICA, DE LOS EQUIPOS O ÁREAS NO INDISPENSABLES PARA EL DESARROLLO PROPIO DE LAS ACTIVIDADES DEL ASEGURADO;ENTENDIENDO COMO INDISPENSABLES LOS CIRCUITOS QUE SUMINISTRAN ENERGÍA A EQUIPOS O ÁREAS QUE POR EL FUNCIONAMIENTO DE LA EMPRESA, NO SE PUEDEN QUEDAR SIN ENERGÍA. ESTA SUSPENSIÓN DEBE EVIDENCIARSE POR MEDIO DE UN PROCEDIMIENTO CON RESPONSABLES DEFINIDOS Y REGISTROS SUFICIENTES.",
      "DURANTE LA VIGENCIA DE LA PÓLIZA, MANTENER INSTALADOS LOS EXTINTORES NECESARIOS Y ADECUADOS PARA PROTEGER TODAS LAS INSTALACIONES.  ESTOS DEBERÁN PERMANECER EN BUEN ESTADO, CON CARGA VIGENTE (MÁXIMO 1 AÑO), SEÑALIZADOS Y UBICADOS EN UN LUGAR VISIBLE Y DE FÁCIL ACCESO. A LOS EFECTOS DE LO ANTERIORMENTE EXPUESTO, SE ENTIENDE POR EXTINTORES SUFICIENTES, QUE POR CADA 200M2 DE ÁREA CONSTRUIDA DE LA EMPRESA, SE DEBE CONTAR POR LO MENOS CON UN EXTINTOR. DE IGUAL MANERA SE ENTIENDE POR EXTINTORES ADECUADOS, QUE LAS ÁREAS EN DONDE SE CONCENTRA MATERIAL SÓLIDO COMBUSTIBLE TALES COMO PAPEL, MADERA, TEXTILES, ETC., DEBEN ESTAR PROTEGIDAS CON EXTINTORES TIPO A DE MÍNIMO 2 1/2 GAL DE CAPACIDAD. LAS ÁREAS EN DONDE SE CONCENTRAN PRODUCTOS INFLAMABLES TALES COMO GASOLINA, DISOLVENTES, ETC.; LO MISMO QUE LAS ÁREAS EN DONDE SE CONCENTRA MAQUINARIA SIN COMPONENTES ELECTRÓNICOS, DEBEN ESTAR PROTEGIDAS CON EXTINTORES TIPO BC DE MÍNIMO 20 LB. DE CAPACIDAD. LAS ÁREAS EN DONDE SE ENCUENTRA TANTO MATERIAL SÓLIDO COMBUSTIBLE, COMO PRODUCTOS INFLAMABLES Y/O MAQUINARIA, DEBEN ESTAR PROTEGIDAS CON EXTINTORES TIPO ABC DE MÍNIMO 20 LB. DE CAPACIDAD. LAS ÁREAS EN DONDE SE ENCUENTRAN EQUIPOS ELECTRÓNICOS Y/O MAQUINARIA CON COMPONENTES ELECTRÓNICOS, DEBEN ESTAR PROTEGIDAS CON EXTINTORES TIPO SOLKAFLAM 123 DE MÍNIMO 10 LB. DE CAPACIDAD.",
      "MANTENER INSTALADO, DURANTE LA VIGENCIA DE LA PÓLIZA, UN SISTEMA DE DETECTORES AUTOMÁTICOS DE INCENDIO (TÉRMICOS, DE HUMO O DE LLAMA),  UBICADOS EN EL TECHO POR LO MENOS A 10 CM DE DISTANCIA DE LA PARED MÁS CERCANA O EN PAREDES LATERALES A 10 O 30 CM DEL TECHO, LA DISTANCIA VERTICAL DEL TECHO AL SENSOR DEBE SER MÍNIMO DE 50 CM, CON UNA DISPOSICIÓN UNIFORME DE MÁXIMO 9 M DE DISTANCIA ENTRE DETECTORES; ESTOS DISPOSITIVOS DEBEN ESTAR CONECTADOS A UN SISTEMA DE ALARMA SONORO O DE COMUNICACIÓN AUTOMÁTICA A LOS CUERPOS DE EMERGENCIA. EN CASO DE CONTAR CON OTRO TIPO DE DETECTORES APARTE DE LOS MENCIONADOS, SEGUIR LAS RECOMENDACIONES DEL FABRICANTE EN CUANTO A SU INSTALACIÓN..",
      "LOS SISTEMAS DE ROCIADORES AUTOMÁTICOS (SPRINKLERS) SON LOS MÁS CONFIABLES Y ECONÓMICOS; ES IMPORTANTE RESALTAR QUE ES MÁS FÁCIL REHABILITAR UN DOCUMENTO HÚMEDO QUE UNO INCINERADO. POR SU PARTE, LOS SISTEMAS DE EXTINCIÓN CON ELEMENTOS GASEOSOS TIENEN A SU FAVOR QUE OCASIONAN MENOR DAÑO A LOS ARTÍCULOS ALMACENADOS, SU OPERACIÓN REQUIERE AISLAR AUTOMÁTICAMENTE LAS ÁREAS PROTEGIDAS Y EXISTEN LIMITACIONES PARA LA EXTINCIÓN, POR CUANTO AL ACTUAR POR SOFOCAMIENTO NO ENFRÍAN LOS ELEMENTOS QUE ESTÁN EN COMBUSTIÓN, HACIENDO QUE ÉSTOS PUEDAN SEGUIR AFECTÁNDOSE POR COMBUSTIÓN LENTA O CON EL RIESGO DE REIGNICIÓN; POR LO ANTERIOR, SE REQUIERE DE UNA INTERVENCIÓN CON AGUA PARA EXTINCIÓN FINAL, CON LOS PROBLEMAS DE DAÑOS ASOCIADOS A LA APLICACIÓN DE AGUA CON MANGUERAS.EN LA NFPA 13 , NFPA 15 Y NFPA 16 SE ENCUENTRAN LOS ASPECTOS A TENER EN CUENTA PARA LOS SISTEMAS DE ROCIADORES AUTOMÁTICOS.",
      "ES CONVENIENTE QUE LOS DETECTORES DE HUMO SE UBIQUEN, COMO MÁXIMO, A 60 CM DEL TECHO, ESTO CON EL ÁNIMO DE REDUCIR UNA POSIBLE PROPAGACIÓN DE FUEGO, CON DETECCIÓN TARDÍA; ESPECIFICACIONES CONTENIDAS EN LA NFPA 72 E4.",
      "SE SUGIERE REALIZAR PRUEBAS DE PRESIÓN Y CAUDAL A LA RED CONTRA INCENDIOS, VERIFICANDO EL ADECUADO FUNCIONAMIENTO DE LA MISMA; ESTE SUMINISTRO DEBE SER CAPAZ DE PROVEER EL CAUDAL Y LA PRESIÓN RESIDUAL, REQUERIDOS EN UN TIEMPO MÍNIMO, DE ACUERDO A NFPA 14 , NFPA 20 Y NFPA 25.",
      "LOS EXTINTORES TIENEN UN ALCANCE VERTICAL ÓPTIMO DE 2,5 M, APLICADO POR UNA PERSONA CON EXPERIENCIA, LO QUE INDICA QUE PARA ESTANTERÍA DE 8,5 M LA COBERTURA DE EXTINTORES NO ES SUFICIENTE PARA LAS ALTURAS DE ALMACENAMIENTO MANEJADAS. SE SUGIERE ESTUDIAR LA POSIBILIDAD DE INSTALAR UN SISTEMA DE REACCIÓN MANUAL O AUTOMÁTICO CONTRA INCENDIOS (ÁREAS ADMINISTRATIVAS, DE ALMACENAMIENTO, PRODUCCIÓN, LABORATORIOS Y SERVICIO AL PÚBLICO); ÉSTE SISTEMA DEBERÁ ESTAR CONECTADO A UNA CENTRAL DE MONITOREO.",
      "LOS MEDIDORES DE NIVEL DE LOS TANQUES DE COMBUSTIBLE, TENDRÁN QUE SER PREFERIBLEMENTE EN UN MATERIAL RESISTENTE AL FUEGO, EVITANDO EL USO DE MANGUERAS DE PLÁSTICO, LAS CUALES SON CONSUMIDAS DE INMEDIATO EN UN INCENDIO, OCASIONANDO EL CORRESPONDIENTE DERRAME DE COMBUSTIBLE",
      "SE RECOMIENDA QUE EN LAS BODEGAS DONDE EXISTE ALMACENAMIENTO DE AEROSOLES EXISTA UNA JAULA METÁLICA ESPECIAL PARA EL ALMACENAMIENTO DE LOS MISMOS; DE IGUAL MANERA, ES CONVENIENTE QUE EL ESPACIO ENTRE LOS ESLABONES TENGA UNA SEPARACIÓN MÁXIMA DE 51 MM QUE IMPIDA, EN CASO DE INCENDIO, LA SALIDA DE UN AEROSOL DISPARADO POR EL FUEGO. ",
      "ES CONVENIENTE QUE LOS DUCTOS DE ESCAPE DE HUMOS (CHIMENEAS O CAMPANAS) DE LOS RESTAURANTES CUENTEN CON UN PROGRAMA DE MANTENIMIENTO SEMESTRAL, CON EL ÁNIMO DE EVITAR LA ACUMULACIÓN DE GRASA Y ELEMENTOS EN SU INTERIOR QUE PUEDAN LLEGAR A GENERAR EL INICIO DE UN INCENDIO EN SU INTERIOR."
   
    ],
    "ROTURA DE MAQUINARIA": [
      "DE ACUERDO A LAS CLÁUSULAS DE MANTENIMIENTO DE MAQUINARIA Y EQUIPO, SEGÚN LAS RECOMENDACIONES DE LOS FABRICANTES, ES NECESARIO ESTABLECER UN PLAN DE MANTENIMIENTO PREVENTIVO; ÉSTE MANTENIMIENTO DEBE SER REALIZADO POR PERSONAL ESPECIALIZADO PARA TODOS LOS EQUIPOS ELECTRÓNICOS, DONDE DEBE INCLUIRSE UNA REVISIÓN GENERAL COMO MÍNIMO CADA SEIS MESES. DE IGUAL MANERA, SE SUGIERE LLEVAR Y MANTENER LOS REGISTROS DE LAS ACTIVIDADES EJECUTADAS.",
      "EN UN AMBIENTE CON BASTANTE POLVO, EL MANTENIMIENTO QUE SE REALIZA A LOS EQUIPOS REQUIERE DE UNA FRECUENCIA MAYOR, YA QUE SE ENCUENTRAN EXPUESTOS A DAÑOS OCASIONADOS POR ÉSTA CAUSA."
    ],
    "ALMACENAMIENTO": [
      "MANTENER ALMACENADOS LOS PRODUCTOS INFLAMABLES (POR EJEMPLO: ACPM) EN LUGARES VENTILADOS Y SEPARADOS DE FUENTES DE IGNICIÓN (POR EJEMPLO: INSTALACIONES ELÉCTRICAS, LLAMA ABIERTA, ENTRE OTRAS).",
      "EN TODAS LAS ÁREAS DONDE SE ALMACENEN ELEMENTOS INFLAMABLES, LAS INSTALACIONES Y LOS EQUIPOS DEBEN SER A PRUEBA DE EXPLOSIÓN (EXPLOSION PROOF).",
      "LOS TANQUES DE ALMACENAMIENTO DE LÍQUIDOS INFLAMABLES Y CORROSIVOS DEBEN ESTAR Y MANTENERSE DEBIDAMENTE MARCADOS; DE IGUAL MANERA, LA CAPACIDAD DE CADA TANQUE DEBERÁ ESTAR INCLUIDA DENTRO DE LA ETIQUETA. PARA ELLO, ES CONVENIENTE ACOGERSE A LA NFPA 30. ",
      "LA ZONA DE ALMACENAMIENTO DE ELEMENTOS CORROSIVOS, LÍQUIDOS INFLAMABLES Y CUALQUIER MERCANCÍA PELIGROSA DEBE ESTAR DEBIDAMENTE UBICADA, CONSIDERANDO LA COMPATIBILIDAD QUÍMICA DE TODAS LAS MERCANCÍAS.",
      "LOS PRODUCTOS CORROSIVOS Y LÍQUIDOS INFLAMABLES, ALMACENADOS CON OTROS INSUMOS, AGRAVAN EL FACTOR DE RIESGOS Y POR LO TANTO NO DEBE OCURRIR BAJO NINGUNA CIRCUNSTANCIA; LAS MERCANCÍAS PELIGROSAS DEBERÁN ESTAR ALMACENADAS EN ÁREAS ESPECIALES, AISLADAS DE LOS DEMÁS ELEMENTOS Y, PREFERIBLEMENTE, SEPARADAS MEDIANTE JAULAS METÁLICAS, CON LOS DEBIDOS RÓTULOS DE MARCACIÓN.",
      "DEBEN ANCLARSE LOS CILINDROS DE GAS QUE NO ESTÁN SIENDO UTILIZADOS, ESTO CON EL ÁNIMO DE PREVENIR LA CAÍDA DE UNO DE ELLOS, CON SUS CORRESPONDIENTES CONSECUENCIAS. ",    
      "SE DEBEN CONSERVAR Y MANTENER ADECUADAS FORMAS DE ALMACENAMIENTO, DE ACUERDO A LA NFPA 23018: O EN LAS BODEGAS DE ALMACENAMIENTO, LA MERCANCÍA NO DEBE LLEGAR HASTA LA CUBIERTA, DEBIDO A LA DIFICULTAD QUE PRESENTA EL CONTROL DE UN INCENDIO; DEBERÁ EXISTIR, COMO MÍNIMO, UNA DISTANCIA DE 60 CM ENTRE EL MATERIAL ALMACENADO Y EL TECHO. O SE RECOMIENDA MANTENER TODA LA MERCANCÍA LIBRE DE CONTACTO DIRECTO CON EL PISO, MEDIANTE ESTANTERÍA O ESTIBAS, PLÁSTICAS O DE MADERA; EN AMBOS CASOS, A UNA ALTURA SUPERIOR DE 10 CM. O LA MERCANCÍA DEBE PERMANECER SEPARADA, POR LO MENOS, 50 CM DE PAREDES Y FUENTES TÉRMICAS (POR EJEMPLO: LÁMPARAS, INTERRUPTORES, TABLEROS ELÉCTRICOS, ENTRE OTROS). O EN LAS BODEGAS DE MATERIA PRIMA Y PRODUCTO TERMINADO, ES NECESARIO MANEJAR Y MANTENER FORMAS ADECUADAS DE ALMACENAMIENTO, YA QUE LA ALTURA INADECUADA ES UNO DE LOS FACTORES MÁS INFLUYENTES EN EL PROGRESO DE UN INCENDIO, DIFICULTANDO EL CONTROL DEL MISMO. LA INESTABILIDAD DE LOS APILAMIENTOS NO ES DESEABLE, YA QUE FACILITA QUE LOS MATERIALES CAIGAN A LOS PASILLOS; ASÍ MISMO, PROPORCIONAN UN PUENTE PARA QUE EL FUEGO LOS CRUCE Y DIFICULTA LAS OPERACIONES DE LUCHA CONTRA INCENDIOS. SE PUDO APRECIAR QUE EXISTEN PILAS DE PRODUCTOS ALMACENADOS MUY ALTAS HACIENDO QUE EXISTA INESTABILIDAD EN LAS MISMAS Y SE GENERE UNA SITUACIÓN PELIGROSA; POR LO ANTERIOR, SE SUGIERE DISMINUIR LA ALTURA DE ALMACENAMIENTO O INSTALAR ESTANTERÍA METÁLICA QUE PUEDA SERVIR DE SOPORTE PARA ESTOS ELEMENTOS. O EL ÚLTIMO NIVEL DE LOS RACKS, EN ALGUNAS ZONAS, PRESENTA MAYOR DENSIDAD DE ALMACENAMIENTO; EXISTIENDO UNA ALTURA MÁXIMA APROXIMADA DE 8,5 M, EL MEDIO DE TRANSPORTE Y MANEJO DE MERCANCÍA SON MONTACARGAS. SE DEBE CAMBIAR LA ESTRATEGIA DE ALMACENAMIENTO, UBICANDO LA MERCANCÍA DE MAYOR DENSIDAD DE ALMACENAMIENTO EN LOS NIVELES MÁS BAJOS DE LOS RACKS; CON ESTO SE BUSCA AMINORAR EL RIESGO DE RUPTURA DE LA MERCANCÍA EN UNA MANIOBRA, YA QUE EL MONTACARGAS DESPUÉS DE 2,5 M DE ALTURA DE MANIPULACIÓN PRESENTARÁ PUNTOS CIEGOS PARA EL OPERARIO.",
    ],
    "SUSTRACCIÓN Y MANEJO": [
    "SE SUGIERE INSTALAR UN SISTEMA DE DETECCIÓN AUTOMÁTICA CONTRA INTRUSOS EN LAS ZONAS MENCIONADAS Ó IMPLANTAR UN SISTEMA CON PLACAS AUTOADHESIVAS EN LOS EQUIPOS QUE ALERTEN AL PERSONAL DE SEGURIDAD AL CRUZAR POR ARCOS DE DETECCIÓN, DE MANERA SIMILAR AL SISTEMA EMPLEADO EN ALMACENES DE VENTA DE DISCOS, LIBROS O PRENDAS DE VESTIR.",
    "ES CONVENIENTE MANTENER INSTALADO UN SISTEMA DE ALARMA QUE CUENTE CON SENSORES DE MOVIMIENTO QUE PROTEJAN TODAS LAS INSTALACIONES, SENSORES MAGNÉTICOS DE APERTURA Y DEMÁS SENSORES NECESARIOS PARA PROTEGER LOS DIFERENTES ACCESOS AL PREDIO. EL SISTEMA DEBE ESTAR CONECTADO A UNA SIRENA; EN CASO DE FALLAS EN EL SUMINISTRO DE ENERGÍA, LA ALARMA DEBE CONTAR CON UNA BATERÍA DE RESERVA QUE SOPORTE EL SISTEMA, COMO MÍNIMO 4 HORAS; DE IGUAL MANERA, EL SISTEMA DEBE ESTAR MONITOREADO (CON SERVICIO DE REACCIÓN) VÍA TELEFÓNICA CON UNA FIRMA ESPECIALIZADA INSCRITA EN LA SUPERINTENDENCIA DE VIGILANCIA.",
    "EL SISTEMA DE ALARMA Y VIGILANCIA DEBE GARANTIZAR LA PROTECCIÓN DE EQUIPOS MÉDICOS ESPECIALIZADOS (LOS CUALES NORMALMENTE TIENEN COSTOS ELEVADOS) DE FÁCIL EXTRACCIÓN.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE INSTALAR O UBICAR UNA CAJA FUERTE EN UN LUGAR NO VISIBLE, EMPOTRADA AL PISO O LA PARED, PARA GUARDAR Y CUSTODIAR LOS DINEROS Y/O TÍTULOS VALORES DERIVADOS DE SU ACTIVIDAD COMERCIAL.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER INSTALADO UN CIRCUITO CERRADO DE TELEVISIÓN (CCTV), ACTIVO, LAS 24 HORAS LOS 365 DÍAS DEL AÑO. EL SISTEMA DEBE CONTAR CON CÁMARAS INTERNAS Y EXTERNAS QUE PROTEJAN LAS INSTALACIONES DEL PREDIO (PERÍMETROS Y ACCESOS). EN CASO DE FALLAS EN EL SUMINISTRO DE ENERGÍA EL CCTV DEBE ESTAR RESPALDADO POR: UNA UPS, BANCO DE BATERÍAS O PLANTA DE EMERGENCIA.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER UN SERVICIO DE VIGILANCIA POR PARTE DE PERSONAL DEDICADO A ESTA LABOR DURANTE LAS 24 HORAS DEL DÍA, TODOS LOS DÍAS DE LA SEMANA; EL PERSONAL DEDICADO A ESTA LABOR NO DEBE CONTAR CON LLAVES DE LAS PUERTAS DE ACCESO AL PREDIO, NI CLAVES DE APERTURA Y CIERRE DEL SISTEMA DE ALARMA.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER UN SERVICIO DE VIGILANCIA POR PARTE DE PERSONAL DE FIRMA ESPECIALIZADA, INSCRITA EN LA SUPERINTENDENCIA DE VIGILANCIA DURANTE LAS 24 HORAS DEL DÍA, TODOS LOS DÍAS DE LA SEMANA; EL PERSONAL DEDICADO A ESTA LABOR NO DEBE CONTAR CON LLAVES DE LAS PUERTAS DE ACCESO AL PREDIO, NI CLAVES DE APERTURA Y CIERRE DEL SISTEMA DE ALARMA.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER INSTALADO Y ACTIVO, UN SISTEMA DE ALARMA QUE PROTEJA LAS INSTALACIONES Y POSIBLES ACCESOS CON SENSORES DE MOVIMIENTO, SENSORES MAGNÉTICOS DE APERTURA, SENSORES DE PÁNICO INALÁMBRICOS Y/O FIJOS. EL SISTEMA DEBE ESTAR MONITOREADO VÍA RADIO, GPRS Y/O CELULAR CON EMPRESA ESPECIALIZADA INSCRITA EN LA SUPERINTENDENCIA DE VIGILANCIA; LA CUAL CUENTE CON SERVICIO DE REACCIÓN. LA ALARMA DEBE CONTAR CON UNA BATERÍA DE RESERVA QUE SOPORTE EL SISTEMA COMO MÍNIMO CUATRO (4) HORAS.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER INSTALADO POR ENCIMA DE LOS MUROS Y/O EN LAS REJAS PERIMETRALES COLINDANTES A LOS PREDIOS ALEDAÑOS, UN SISTEMA DE ALAMBRADO ELÉCTRICO. EL SISTEMA DEBE CONTAR CON UNA BATERÍA DE RESERVA QUE SOPORTE EL SISTEMA COMO MÍNIMO CUATRO (4) HORAS.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER INSTALADO POR ENCIMA DE LOS MUROS Y/O EN LAS REJAS PERIMETRALES COLINDANTES A LOS PREDIOS ALEDAÑOS, UN SISTEMA DE CONCERTINAS. ENTIÉNDASE POR CONCERTINA: ALAMBRE ENROLLADO CON FILAMENTOS CORTO PUNZANTES."
  ],
  "RESPONSABILIDAD CIVIL CONTRACTUAL Y EXTRACONTRACTUAL / MEDIO AMBIENTE": [
    "MUCHOS TIPOS DE EDIFICIOS TIENEN, EN SU INTERIOR, RECINTOS PARA LA RECOLECCIÓN DE BASURAS. ALGUNOS DE ESTOS CUENTAN CON UN SISTEMA DE CONDUCCIÓN DE BASURAS O “CHUTES” POR LOS CUALES, SE LANZAN LOS DESECHOS, PARA POSTERIORMENTE SER ALMACENADOS EN RECIPIENTES DE MAYOR TAMAÑO.",
    "DADO QUE ESTOS ESPACIOS RECIBEN TODO TIPO DE MATERIALES, PUEDEN ENCONTRARSE OBJETOS CON ALTA CARGA COMBUSTIBLE QUE, EN EL MOMENTO DE GENERARSE FUENTES DE IGNICIÓN, PODRÍA PRODUCIRSE UN EVENTO DE INCENDIO. POR ESTO SE RECOMIENDA QUE LOS DEPÓSITOS DE BASURA CUENTEN CON LAS SIGUIENTES CARACTERÍSTICAS ESTIPULADAS EN LA NORMA NFPA 82 – ESTÁNDAR EN INCINERADORES Y DESECHOS Y SISTEMAS DE MANEJO DE LINOS Y EQUIPAMIENTO:",
    "· EL RECINTO DEBE ESTAR PROVISTO DE UNA PUERTA CON CIERRE AUTOMÁTICO CON RESISTENCIA AL FUEGO NO MENOR A 1 ½ HORA.",
    "· SE DEBEN REALIZAR LABORES DE MANTENIMIENTO Y LIMPIEZA ADECUADOS ANUALMENTE O SEGÚN COMO LO RECOMIENDE EL CONSTRUCTOR.",
    "· SI EL RECINTO DE ALMACENAMIENTO ALBERGA MÁS DE 0,75 M3 DE BASURA SIN COMPACTAR EN SU INTERIOR, ÉSTE DEBE ESTAR AISLADO DE OTROS RECINTOS DEL EDIFICIO POR PAREDES Y CUBIERTAS CON RESISTENCIA AL FUEGO NO INFERIOR A 2 HORAS.",
    "· EL RECINTO DE BASURAS DEBE CONTAR CON UN SISTEMA DE REGADERAS AUTOMÁTICAS PARA LA EXTINCIÓN DE FUEGO, SIGUIENDO LOS LINEAMIENTOS DE LA NFPA 13 – STANDARD PARA INSTALACIÓN DE SISTEMAS DE REGADERAS.",
    "· POR SER UN ÁREA, EN SU MAYORÍA DEL TIEMPO, DESPOBLADA, SE RECOMIENDA INSTALAR UN SISTEMA DE DETECCIÓN DE INCENDIOS, QUE SE ENCUENTRA MONITOREADO CONSTANTEMENTE POR PERSONAL DE VIGILANCIA."
  ],
  "INSTALACIONES ELÉCTRICAS": [
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER TODOS LOS EQUIPOS ELECTRÓNICOS CON CONEXIÓN DE PUESTA A TIERRA Y SISTEMAS DE REGULACIÓN TALES COMO REGULADORES DE VOLTAJE (ESTABILIZADORES) O UPS \"ON LINE\" DE SUFICIENTE CAPACIDAD. ASÍ MISMO SE DEBE GARANTIZAR EL CORRECTO CUMPLIMIENTO DE LAS RECOMENDACIONES DEL FABRICANTE DEL SISTEMA. REALIZAR MANTENIMIENTO PREVENTIVO SEMESTRAL A LOS EQUIPOS DE PROTECCIÓN. EVIDENCIAR LAS ACTIVIDADES DE MANTENIMIENTO POR MEDIO DE UN REGISTRO DOCUMENTADO.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER TODOS LOS EQUIPOS ELECTRÓNICOS QUE TENGAN ENTRADA DE COMUNICACIÓN TELEFÓNICA (CENTRALES TELEFÓNICAS, FAXES, COMPUTADORES, EQUIPO DE CÓMPUTO, ENTRE OTROS), CON SUPRESORES DE PICOS INSTALADOS A LA SALIDA DE LAS TOMACORRIENTES O MULTITOMAS. REALIZAR VERIFICACIÓN COMO MÍNIMO CADA SEIS (6) MESES, SU CORRECTO FUNCIONAMIENTO. EVIDENCIAR LAS ACTIVIDADES DE MANTENIMIENTO POR MEDIO DE UN REGISTRO DOCUMENTADO O BITÁCORA.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER UN CONTRATO DE MANTENIMIENTO PREVENTIVO CON UN TERCERO ESPECIALIZADO PARA TODOS LOS EQUIPOS ELECTRÓNICOS, EL CUAL INCLUYA UNA REVISIÓN GENERAL COMO MÍNIMO CADA SEIS (6) MESES. EVIDENCIAR LAS ACTIVIDADES DE MANTENIMIENTO POR MEDIO DE UN REGISTRO DOCUMENTADO O BITÁCORA POR EQUIPO.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER UN CONTRATO DE MANTENIMIENTO PREVENTIVO CON UN TERCERO ESPECIALIZADO PARA TODOS LOS EQUIPOS ELECTRÓNICOS, EL CUAL INCLUYA UN PROCESO DE MANTENIMIENTO CADA TRES (3) MESES. EVIDENCIAR LAS ACTIVIDADES DE MANTENIMIENTO POR MEDIO DE UN REGISTRO DOCUMENTADO O BITÁCORA POR EQUIPO.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE GARANTIZAR QUE TODOS LOS TABLEROS ELÉCTRICOS DE DISTRIBUCIÓN DE LA SUBESTACIÓN O AQUELLAS LÍNEAS DE ALIMENTACIÓN A EQUIPOS ELECTRÓNICOS ESPECIALIZADOS, DISPONGAN DE DISPOSITIVOS DE PROTECCIÓN CONTRA SOBRETENSIONES TRANSITORIAS, CON UN SISTEMA APROPIADO DE PUESTA A TIERRA. PARA LA INSTALACIÓN DE UN SISTEMA APROPIADO DE PUESTA A TIERRA, TOMAR EN CONSIDERACIÓN EL REGLAMENTO TÉCNICO DE INSTALACIONES ELÉCTRICAS (RETIE).",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE MANTENER UN SISTEMA DE PUESTA A TIERRA DE CAPACIDAD SUFICIENTE PARA PROTEGER LOS EQUIPOS ELECTRÓNICOS EXISTENTES EN LAS INSTALACIONES Y REALIZAR MANTENIMIENTO PREVENTIVO ANUAL AL SISTEMA. EVIDENCIAR LAS ACTIVIDADES DE MANTENIMIENTO POR MEDIO DE UN REGISTRO DOCUMENTADO. PARA LA INSTALACIÓN DE UN SISTEMA APROPIADO DE PUESTA A TIERRA, TOMAR EN CONSIDERACIÓN EL REGLAMENTO TÉCNICO DE INSTALACIONES ELÉCTRICAS (RETIE)."
  ],
  "INSTALACIONES FÍSICAS, CONSTRUCCIÓN, ORDEN, ASEO": [
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE REALIZAR MANTENIMIENTO GENERAL A LAS CANALES Y BAJANTES CÓMO MÍNIMO CADA SEIS (6) MESES, QUE INCLUYA LIMPIEZA Y CAMBIO DE ELEMENTOS DEFECTUOSOS (TEJAS, GANCHOS, ENTRE OTROS). EVIDENCIAR LAS ACTIVIDADES DE MANTENIMIENTO POR MEDIO DE UN REGISTRO DOCUMENTADO O BITÁCORA.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE REALIZAR MANTENIMIENTO, POR LO MENOS CADA SEIS (6) MESES, A LA IMPERMEABILIZACIÓN, CANALES Y BAJANTES, EL CUAL INCLUYE SU LIMPIEZA Y LA REVISIÓN DEL MANTO QUE PROTEGE LA CUBIERTA. EVIDENCIAR LAS ACTIVIDADES DE MANTENIMIENTO POR MEDIO DE UN REGISTRO DOCUMENTADO O BITÁCORA.",
    "DURANTE LA VIGENCIA DE LA PÓLIZA, EL ASEGURADO DEBE REALIZAR MANTENIMIENTO POR LO MENOS CADA TRES (3) MESES, A LOS CANALES Y BAJANTES DE AGUAS LLUVIAS Y CAJAS DE INSPECCIÓN, ENTRE OTROS, EL CUAL INCLUYE SU LIMPIEZA Y LA REVISIÓN DE LOS DESAGÜES DE AGUAS LLUVIAS QUE PROTEGEN EL PREDIO DE INUNDACIONES. RESPALDAR EL DESAGÜE CON UN SISTEMA DE BOMBEO CON MOTOBOMBAS SUMERGIBLES, PARA EVACUAR CUALQUIER FLUIDO EN CASO DE INUNDACIÓN."
  ],

  };

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");


  const handleAgregarRecomendacion = (recomendacion) => {
    if (recomendacion && !recomendaciones.includes(recomendacion)) {
      setRecomendaciones((prev) =>
        prev ? prev + "\n• " + recomendacion : "• " + recomendacion
      );
    }
  };


  useEffect(() => {
    const datosPrevios = location.state || {}; // ✅ Aquí se declara dentro del efecto
    setFormData((prev) => ({
      ...prev,
      ...datosPrevios,
    }));
  }, [location.state]);

    useEffect(() => {
    if (datosPrevios.nombreCliente) {
      setNombreCliente(datosPrevios.nombreCliente);
    }
  }, [datosPrevios.nombreCliente]);


  const getCellColor = (r) => {
    if (r >= 13) {
      return "FF0000"; // rojo
    } else if (r >= 9) {
      return "00B0F0"; // azul
    } else if (r >= 5) {
      return "FFFF00"; // amarillo
    } else {
     return "92D050"; // verde  
     }
  };



  const calcularClasificacion = (r) => {
    if (r < 4) return "Bajo";
    if (r < 8) return "Medio";
    if (r < 12) return "Alto";
    return "Extremo";
  };
  
  const actualizarRiesgo = (index, campo, valor) => {
    const nuevaTabla = [...tablaRiesgos];
    nuevaTabla[index][campo] = parseInt(valor) || 0;
  
    const { probabilidad, severidad } = nuevaTabla[index];
    if (probabilidad && severidad) {
      const r = probabilidad * severidad;
      const indice = ((r / 25) * 100).toFixed(0); // Vulnerabilidad %
      nuevaTabla[index].r = r;
      nuevaTabla[index].indice = indice;
      nuevaTabla[index].clasificacion = calcularClasificacion(r);
    }
  
    setTablaRiesgos(nuevaTabla);
  };

  const celdaMatrizRiesgo = (R, porcentaje, textoRiesgo) =>
    new TableCell({
      shading: {
        fill: getCellColor(R),
      },
      borders: {
        top: { color: "000000", size: 2 },
        bottom: { color: "000000", size: 2 },
        left: { color: "000000", size: 2 },
        right: { color: "000000", size: 2 },
      },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `${R}`,
              bold: true,
              color: "FFFFFF", // texto blanco para contraste
            }),
            new TextRun({
              text: ` (${porcentaje}%)`,
              color: "FFFFFF",
              break: 1,
            }),
            new TextRun({
              text: textoRiesgo || "",
              color: "FFFFFF",
              break: 1,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
      verticalAlign: "center",
    });




    
  
// 🔁 Declaración previa de helpers
const celdaTexto = (text, bold = false, colspan = 1) =>
  new TableCell({
    columnSpan: colspan,
    children: [
      new Paragraph({
        children: [new TextRun({ text: text || "", bold })],
        alignment: AlignmentType.CENTER,
      }),
    ],
    width: { size: 100 / colspan, type: WidthType.PERCENTAGE },
  });

// Fila con etiqueta y dato extendido
const filaDoble = (label, value) => new TableRow({
  children: [
    celdaTexto(label, true),
    new TableCell({
      columnSpan: 7,
      children: [
        new Paragraph({
          children: [new TextRun({ text: value || "" })],
          alignment: AlignmentType.LEFT,
        }),
      ],
    }),
  ],
});



  const encabezadoTabla = (texto) =>
  new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: texto, bold: true })],
        alignment: AlignmentType.CENTER,
      }),
    ],
    shading: { fill: "D9D9D9" },
    verticalAlign: "center",
  });



<MapaDeCalor tablaRiesgos={tablaRiesgos} />,
<RegistroFotografico onChange={setImagenesRegistro} />


  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };


  const handleCiudadChange = (selectedOption) => {
    if (!selectedOption) {
      setFormData({
        ...formData,
        ciudad_siniestro: "",
        departamento_siniestro: "",
      });
      return;
    }
    setFormData({
      ...formData,
      ciudad_siniestro: selectedOption,
      departamento_siniestro: selectedOption.label.split(" - ")[1] || "",
    });


};



  const generarWord = async () => {

    const fechaFormateada = new Date(fecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      
    });


  
const seccion = (titulo) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 200 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text: titulo,
        bold: true,
        font: "Arial",
        size: 24,
      }),
    ],
  });

  
      const linea = (texto, bold = false) =>
        new Paragraph({
          children: [
            new TextRun({
              text: texto || "",
              bold,
              font: "Arial",
              size: 24, // 12 pt (en docx son la mitad)
            }),
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 100 },
        });
        

      
    const docContent = [];
    const encabezadoTabla = (texto) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: texto, bold: true })],
          }),
        ],
      });
    
    const celdaTexto = (texto) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: texto || "" })],
          }),
        ],
      });


      const celdaTextoCentrada = (texto, bold = false) =>
  new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: texto || "", bold })],
        alignment: AlignmentType.CENTER,
      }),
    ],
    verticalAlign: "center",
  });

// Página de presentación
docContent.push(
  new Paragraph({ children: [], pageBreakBefore: true }),

  // Título "Reporte de Inspección de suscripción"
  new Paragraph({
    children: [
      new TextRun({
        text: "Reporte de Inspección de suscripción",
        bold: true,
        italics: true,
        size: 26, // 13 pt aprox.
        font: "Arial",
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  }),

  // Nombre de la empresa
  new Paragraph({
    children: [
      new TextRun({
        text: nombreCliente || "Nombre de la Empresa",
        bold: true,
        italics: true,
        size: 26,
        font: "Arial",
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }),

  // Ubicación (ciudad + departamento)
  new Paragraph({
    children: [
      new TextRun({
        text: `${formData.ciudad_siniestro} – ${formData.departamento_siniestro  || ""}`,
        italics: true,
        size: 24,
        font: "Arial",
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  })
);

// Ahora sí el bloque de la imagen del riesgo (si existe)
if (imagen) {
  const buffer = await imagen.arrayBuffer();
  const imageRun = new ImageRun({
    data: buffer,
    transformation: {
      width: 400,
      height: 250,
    },
  });

  docContent.push(
    new Paragraph({
      children: [],
      pageBreakBefore: false, // Sin salto, sigue en la misma página
    }),

    new Paragraph({ children: [imageRun], alignment: AlignmentType.CENTER }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Fachada del riesgo",
          size: 20,
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  );
}

      
    

    docContent.push(
      new Paragraph({ children: [], pageBreakBefore: true }),
      linea("Señores"),
      linea(aseguradora, true),
      linea(`Ciudad: ${formData.ciudad_siniestro}`),
      linea(""),
      linea("REF: INFORME DE INSPECCIÓN", true),
      linea(`ASEGURADO: ${nombreCliente}`),
      linea(`PREDIO INSPECCIONADO: ${direccion}`),
      linea(`FECHA DE INSPECCIÓN: ${fechaFormateada}`),
      linea(""),
      linea("Apreciados Señores:"),
      linea("Tomando como base la asignación de inspección que nos fuera oficializada, estamos adjuntando el informe único y confidencial de las labores realizadas en el Riesgo en referencia."),
      linea("Luego de analizar los diferentes aspectos relacionados con el estado actual del predio, así como las protecciones existentes contra posibles eventos como incendio, hurto, entre otros; se afirma que el riesgo SE PUEDE SUSCRIBIR. No obstante, se deben cumplir las recomendaciones para el mejoramiento del riesgo y prevención de emergencias."),
      linea("Estamos a su disposición para aclarar cualquier inquietud que tengan al respecto y agradecemos la confianza depositada en nuestros servicios profesionales para este caso."),
      linea(""),
      linea("Cordialmente,"),
      linea(""),
      linea("ARNALDO TAPIA GUTIERREZ"),
      linea("Gerente")

    );
docContent.push(
  new Paragraph({ children: [], pageBreakBefore: true }),
  new Paragraph({
    text: "Tabla de Contenido",
    hyperlink: true,
    headingStyleRange: "1-3",
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 300 },
    alignment: AlignmentType.LEFT,
  }),
  new Paragraph({ text: "", spacing: { after: 300 } }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("REF")], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph(": INFORME DE INSPECCIÓN")], width: { size: 75, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph({ text: "2", alignment: AlignmentType.RIGHT })], width: { size: 15, type: WidthType.PERCENTAGE } }),
        ],
      }),
          ...[
            ["1.", "INFORMACIÓN GENERAL", "8"],
            ["2.", "DESCRIPCIÓN GENERAL DE LA EMPRESA", "8"],
            ["3.", "INFRAESTRUCTURA", "11"],
            ["4.", "PROCESOS", "12"],
            ["5.", "LINDEROS", "13"],
            ["6.", "MAQUINARIA, EQUIPOS Y MANTENIMIENTO", "13"],
            ["7.", "SERVICIOS INDUSTRIALES", "15"],
            ["8.", "PROTECCIONES CONTRA INCENDIOS", "16"], // 👉 Aquí está la corrección
            ["9.", "SEGURIDAD", "17"],
            ["10.", "SINIESTRALIDAD", "18"],
            ["11.", "RECOMENDACIONES", "19"],
            ["12.", "REGISTRO FOTOGRÁFICO", "21"]
          ].map(([ref, titulo, pagina]) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(ref)] }),
                new TableCell({ children: [new Paragraph(titulo)] }),
                new TableCell({ children: [new Paragraph({ text: pagina, alignment: AlignmentType.RIGHT })] }),
              ],
            })
          ),
        ],
      })
    );
    

    const riesgos = [
      "Incendio/Explosión",
      "Amit",
      "Anegación",
      "Daños por agua",
      "Terremoto",
      "Sustracción",
      "Rotura de maquinaria",
      "Responsabilidad civil"
    ];
    
    docContent.push(
      new Paragraph({ children: [], pageBreakBefore: true }),
      seccion("ANÁLISIS DE RIESGOS"),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [encabezadoTabla("RIESGO"), encabezadoTabla("ANÁLISIS")],
          }),
          ...Object.entries(analisisRiesgos).map(([riesgo, valor]) =>
            new TableRow({
              children: [celdaTexto(riesgo), celdaTexto(valor || "")],
            })
          ),
        ],
      })
    );
    
    

// Tabla de Calificación del Riesgo e Índice de Vulnerabilidad
docContent.push(
  new Paragraph({ children: [], pageBreakBefore: true }),
  new Paragraph({
    text: "CLASIFICACIÓN DE RIESGOS",
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 300 },
  }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          encabezadoTabla("Riesgo"),
          encabezadoTabla("Probabilidad"),
          encabezadoTabla("Severidad"),
          encabezadoTabla("Clasificación"),
        ],
      }),
      ...tablaRiesgos.map((riesgo, i) =>
        new TableRow({
          children: [
            celdaTexto([
              "Incendio/Explosión",
              "AMIT",
              "Anegación",
              "Terremoto",
              "Sustracción",
              "Rotura de maquinaria",
              "Responsabilidad Civil",
            ][i]),
            celdaTexto(String(riesgo.probabilidad)),
            celdaTexto(String(riesgo.severidad)),
            celdaTexto(riesgo.clasificacion),
          ],
        })
      ),
    ],
  })
);

// Segunda tabla: tabla calculada R y % Vulnerabilidad
docContent.push(
 // new Paragraph({ children: [], pageBreakBefore: true }),
  new Paragraph({
    text: "CALIFICACIÓN DEL RIESGO (R) E ÍNDICE DE VULNERABILIDAD (%)",
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 300 },
  }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          encabezadoTabla("Riesgo"),
          encabezadoTabla("Probabilidad"),
          encabezadoTabla("Severidad"),
          encabezadoTabla("R = P × S"),
          encabezadoTabla("Índice de Vulnerabilidad %"),
          encabezadoTabla("Clasificación"),
        ],
      }),
      ...tablaRiesgos.map((riesgo, i) => {
        const p = parseInt(riesgo.probabilidad) || 0;
        const s = parseInt(riesgo.severidad) || 0;
        const r = p * s;
        const vulnerabilidad = Math.round((r / 25) * 100);
        const clasificacion =
          r <= 4 ? "Bajo" :
          r <= 8 ? "Medio" :
          r <= 12 ? "Alto" : "Extremo";

        return new TableRow({
          children: [
            celdaTexto([
              "Incendio/Explosión",
              "AMIT",
              "Anegación",
              "Terremoto",
              "Sustracción",
              "Rotura de maquinaria",
              "Responsabilidad Civil",
            ][i]),
            celdaTexto(String(p)),
            celdaTexto(String(s)),
            celdaTexto(String(r)),
            celdaTexto(`${vulnerabilidad}%`),
            celdaTexto(clasificacion),
          ],
        });
      }),
    ],
  })
);

docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }),
  new Paragraph({
    text: "MATRIZ DE CALOR DE RIESGOS",
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 300 },
  }),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Encabezado de Severidad
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("")] }), // Celda vacía para esquina
          ...["INSIGNIFICANTE (1)", "MENOR (2)", "MODERADO (3)", "MAYOR (4)", "CATASTRÓFICO (5)"].map((label) =>
            new TableCell({
              children: [new Paragraph({ text: label, bold: true })],
              shading: { fill: "D9D9D9" },
            })
          ),
        ],
      }),

      // Filas de Probabilidad (Frecuente a Improbable)
      ...[5, 4, 3, 2, 1].map((pValue, rowIndex) => {
        const probLabels = ["FRECUENTE (5)", "POSIBLE (4)", "PROBABLE (3)", "BAJA (2)", "IMPROBABLE (1)"];

        return new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: probLabels[rowIndex], bold: true })],
                shading: { fill: "D9D9D9" },
              }),
              ...[1, 2, 3, 4, 5].map((sValue) => {
                const riesgoEncontrado = tablaRiesgos.find(
                  (r) => parseInt(r.probabilidad) === pValue && parseInt(r.severidad) === sValue
                );

                const R = pValue * sValue;
                const porcentaje = Math.round((R / 25) * 100);
                const textoRiesgo = riesgoEncontrado ? riesgoEncontrado.riesgo || "" : "";

                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: `${R}`, bold: true }),
                        new TextRun({ text: ` (${porcentaje}%)` }),
                        textoRiesgo ? new TextRun({ text: `\n${textoRiesgo}` }) : undefined,
                      ].filter(Boolean), // Solo mete runs válidos
                      spacing: { after: 0 }, // IMPORTANTE: no deja espacio extra
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                  shading: { fill: getCellColor(R) },
                });
              }),
            ],
          });

      }),
    ],
  })
);


docContent.push(
  new Paragraph({ children: [], spacing: { after: 100 } }), // pequeño espacio, no salto
  seccion("1. INFORMACIÓN GENERAL"),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          encabezadoTabla("Nombre de la Empresa"),
          celdaTexto(nombreEmpresa),
          encabezadoTabla("Barrio"),
          celdaTexto(barrio),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("Dirección"),
          celdaTexto(direccion),
          encabezadoTabla("Departamento"),
          celdaTexto(departamento),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("Municipio"),
          celdaTexto(municipio),
          encabezadoTabla("Persona Entrevistada"),
          celdaTexto(personaEntrevistada),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("Cargo"),
          celdaTexto(cargo),
          new TableCell({ children: [new Paragraph("")] }),
          new TableCell({ children: [new Paragraph("")] }),
        ],
      }),
            new TableRow({
        children: [
          encabezadoTabla("Horario Laboral"),
          celdaTexto(horarioLaboral),
          encabezadoTabla("Persona Entrevistada"),
          celdaTexto(personaEntrevistada),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("Numero de Colaboradores"),
          celdaTexto(colaboladores),
          new TableCell({ children: [new Paragraph("")] }),
          new TableCell({ children: [new Paragraph("")] }),
        ],
      }),
    ],
  })
);


    


   
docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }), 
  seccion("2. DESCRIPCIÓN GENERAL DE LA EMPRESA"),
  linea(descripcionEmpresa || "No se ingresó información.")
);


docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }), 
  seccion("3. INFRAESTRUCTURA"),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          encabezadoTabla("Antigüedad"),
          celdaTexto(antiguedad),
          encabezadoTabla("Área Lote"),
          celdaTexto(areaLote),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("Área Construida"),
          celdaTexto(areaConstruida),
          encabezadoTabla("Nº de Edificios"),
          celdaTexto(numeroEdificios),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("Nº de Pisos"),
          celdaTexto(numeroPisos),
          encabezadoTabla("Sótanos"),
          celdaTexto(sotanos),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("Propio o Arrendado"),
          celdaTexto(tenencia),
          new TableCell({ children: [] }),
          new TableCell({ children: [] }),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { after: 200 } }),
  linea("Descripción:"),
  linea(descripcionInfraestructura || "No se ingresó información.")
 );


 docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }), 
  seccion("4. PROCESOS"),
  linea(procesos || "No se ingresó información.")
);


docContent.push(
  seccion("5. LINDEROS"),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          encabezadoTabla("NORTE"),
          celdaTexto(linderoNorte || ""),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("SUR"),
          celdaTexto(linderoSur || ""),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("ORIENTE"),
          celdaTexto(linderoOriente || ""),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("OCCIDENTE"),
          celdaTexto(linderoOccidente || ""),
        ],
      }),
    ],
  })
);

    // ✅ Bloque para insertar MAPA
  try {
    const mapaDataUrl = await toPng(mapaRef.current);
    const mapaBuffer = await fetch(mapaDataUrl).then((res) => res.arrayBuffer());

    const mapaImage = new ImageRun({
      data: mapaBuffer,
      transformation: {
        width: 500,
        height: 300,
      },
    });

    docContent.push(
      new Paragraph({ text: "", spacing: { after: 300 } }), 
      seccion("MAPA DE UBICACIÓN"),
      new Paragraph({ children: [mapaImage], alignment: AlignmentType.CENTER }),
      linea("Coordenadas basadas en la ubicación actual del dispositivo")
    );
  } catch (error) {
    console.error("No se pudo capturar el mapa:", error);
  }

  const rows = [
    filaDoble("PROVEEDOR", energiaProveedor),
    filaDoble("TENSIÓN", energiaTension),
    encabezadoTabla("TRANSFORMADORES"),
    new TableRow({
      children: [
        celdaTexto("N° Subestación"),
        celdaTexto("Marca"),
        celdaTexto("Tipo"),
        celdaTexto("Capacidad"),
        celdaTexto("Edad"),
        celdaTexto("Relación de voltaje"),
      ],
    }),
    new TableRow({
      children: [
        celdaTexto(transformadorSubestacion),
        celdaTexto(transformadorMarca),
        celdaTexto(transformadorTipo),
        celdaTexto(transformadorCapacidad),
        celdaTexto(transformadorEdad),
        celdaTexto(transformadorRelacionVoltaje),
      ],
    }),
    encabezadoTabla("PLANTAS ELÉCTRICAS"),
    new TableRow({
      children: [
        celdaTexto("Número"),
        celdaTexto("Marca"),
        celdaTexto("Tipo"),
        celdaTexto("Capacidad"),
        celdaTexto("Edad"),
        celdaTexto("Transferencia"),
        celdaTexto("Voltaje"),
        celdaTexto("Cobertura"),
      ],
    }),
    new TableRow({
      children: [
        celdaTexto(plantaNumero1),
        celdaTexto(plantaMarca1),
        celdaTexto(plantaTipo1),
        celdaTexto(plantaCapacidad1),
        celdaTexto(plantaEdad1),
        celdaTexto(plantaTransferencia1),
        celdaTexto(plantaVoltaje1),
        celdaTexto(plantaCobertura1),
      ],
    }),
    new TableRow({
      children: [
        celdaTexto(plantaNumero2),
        celdaTexto(plantaMarca2),
        celdaTexto(plantaTipo2),
        celdaTexto(plantaCapacidad2),
        celdaTexto(plantaEdad2),
        celdaTexto(plantaTransferencia2),
        celdaTexto(plantaVoltaje2),
        celdaTexto(plantaCobertura2),
      ],
    }),
    filaDoble("PARARRAYOS", energiaPararrayos),
    filaDoble("COMENTARIOS", energiaComentarios),
  ];

  docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }), 
  seccion("6. MAQUINARIA, EQUIPOS Y MANTENIMIENTO"),
  linea(maquinariaDescripcion || "No se ingresó información.")
);

docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }), // Espacio antes
  new Paragraph({
    text: "INVENTARIO DE EQUIPOS ELÉCTRICOS Y ELECTRÓNICOS",
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 300 },
  })
);

  datosEquipos.forEach((area) => {
  docContent.push(
    new Paragraph({
      
      text: `${area.nombre} (Subtotal: $${area.equipos.reduce((sum, eq) => sum + (parseFloat(eq.precio) || 0), 0).toLocaleString('es-CO')})`,
      heading: HeadingLevel.HEADING_3,
      spacing: { after: 200 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            encabezadoTabla("CANT"),
            encabezadoTabla("EQUIPO"),
            encabezadoTabla("MARCA"),
            encabezadoTabla("PRECIO"),
            encabezadoTabla("CAPACIDAD"),
            encabezadoTabla("APARIENCIA"),
          ],
        }),
        ...area.equipos.map(eq =>
          new TableRow({
            children: [
              celdaTexto(String(eq.cantidad)),
              celdaTexto(eq.equipo),
              celdaTexto(eq.marca),
              celdaTexto(`$${Number(eq.precio).toLocaleString('es-CO')}`),
              celdaTexto(eq.capacidad),
              celdaTexto(eq.apariencia),
            ],
          })
        )
      ],
    })
  );
});
docContent.push(
  new Paragraph({
    text: `TOTAL VALOR ESTIMADO: $${datosEquipos.reduce(
      (sum, area) => sum + area.equipos.reduce((s, eq) => s + (parseFloat(eq.precio) || 0), 0),
      0
    ).toLocaleString('es-CO')}`,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 300 },
  })
);

  


// SERVICIOS INDUSTRIALES
docContent.push(
  seccion("7. SERVICIOS INDUSTRIALES"),

  // Tabla con proveedor y tensión (título 25%, valor 75%)
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ text: "PROVEEDOR", bold: true })],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ text: energiaProveedor || "" })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ text: "TENSIÓN", bold: true })],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ text: energiaTension || "" })],
          }),
        ],
      }),
    ],
  }),

  // TRANSFORMADORES
  new Paragraph({
    text: "TRANSFORMADORES",
    bold: true,
    spacing: { before: 200, after: 100 },
  }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          celdaTexto("N° Subestación", true),
          celdaTexto("Marca", true),
          celdaTexto("Tipo", true),
          celdaTexto("Capacidad", true),
          celdaTexto("Edad", true),
          celdaTexto("Relación de voltaje", true),
        ],
      }),
      new TableRow({
        children: [
          celdaTexto(transformadorSubestacion),
          celdaTexto(transformadorMarca),
          celdaTexto(transformadorTipo),
          celdaTexto(transformadorCapacidad),
          celdaTexto(transformadorEdad),
          celdaTexto(transformadorRelacionVoltaje),
        ],
      }),
    ],
  }),

  // PLANTAS ELÉCTRICAS
  new Paragraph({
    text: "PLANTAS ELÉCTRICAS",
    bold: true,
    spacing: { before: 200, after: 100 },
  }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          celdaTexto("Número", true),
          celdaTexto("Marca", true),
          celdaTexto("Tipo", true),
          celdaTexto("Capacidad", true),
          celdaTexto("Edad", true),
          celdaTexto("Transferencia", true),
          celdaTexto("Voltaje", true),
          celdaTexto("Cobertura", true),
        ],
      }),
      new TableRow({
        children: [
          celdaTexto(plantaNumero1),
          celdaTexto(plantaMarca1),
          celdaTexto(plantaTipo1),
          celdaTexto(plantaCapacidad1),
          celdaTexto(plantaEdad1),
          celdaTexto(plantaTransferencia1),
          celdaTexto(plantaVoltaje1),
          celdaTexto(plantaCobertura1),
        ],
      }),
      new TableRow({
        children: [
          celdaTexto(plantaNumero2),
          celdaTexto(plantaMarca2),
          celdaTexto(plantaTipo2),
          celdaTexto(plantaCapacidad2),
          celdaTexto(plantaEdad2),
          celdaTexto(plantaTransferencia2),
          celdaTexto(plantaVoltaje2),
          celdaTexto(plantaCobertura2),
        ],
      }),
    ],
  }),

  // PARARRAYOS Y COMENTARIOS
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          celdaTexto("Pararrayos", true),
          new TableCell({
            columnSpan: 7,
            children: [new Paragraph(energiaPararrayos || "")],
          }),
        ],
      }),
      new TableRow({
        children: [
          celdaTexto("Comentarios", true),
          new TableCell({
            columnSpan: 7,
            children: [new Paragraph(energiaComentarios || "")],
          }),
        ],
      }),
    ],
  })
);


  

  

docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }),
  seccion("SISTEMA DE AGUA"),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          encabezadoTabla("Fuente"),
          encabezadoTabla("Uso"),
          encabezadoTabla("Almacenamiento"),
          encabezadoTabla("Equipo de Bombeo"),
        ],
      }),
      new TableRow({
        children: [
          celdaTexto(aguaFuente),
          celdaTexto(aguaUso),
          celdaTexto(aguaAlmacenamiento),
          celdaTexto(aguaBombeo),
        ],
      }),
      new TableRow({
        children: [
          encabezadoTabla("Comentarios"),
          new TableCell({
            columnSpan: 3,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: aguaComentarios || "",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
);

docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }),
  seccion("8. PROTECCIONES CONTRA INCENDIOS"),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      filaDoble("EXTINTOR", extintor),
      filaDoble("RED CONTRAINCENDIO", rci),
      filaDoble("EXTINTOR", extintor),
      filaDoble("RED CONTRAINCENDIO", rci),
      filaDoble("SISTEMA DE ROCIADORES", rociadores),
      filaDoble("DETECCIÓN DE INCENDIOS", deteccion),
      filaDoble("ALARMAS DE INCENDIO", alarmas),
      filaDoble("BRIGADAS DE EMERGENCIA", brigadas),
      filaDoble("BOMBEROS", bomberos),
    ],
  })
);


//Seguridad

docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }),
  seccion("9. SEGURIDAD"),

  // SEGURIDAD ELECTRÓNICA
  new Paragraph({
    text: "Seguridad Electrónica",
    bold: true,
    spacing: { after: 100 },
  }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [encabezadoTabla("Alarma Monitoreada"), celdaTexto(alarmaMonitoreada)],
      }),
      new TableRow({
        children: [encabezadoTabla("CCTV (cámaras, monitoreo)"), celdaTexto(cctv)],
      }),
      new TableRow({
        children: [encabezadoTabla("Mantenimiento"), celdaTexto(mantenimientoSeguridad)],
      }),
      new TableRow({
        children: [encabezadoTabla("Comentarios"), celdaTexto(comentariosSeguridadElectronica)],
      }),
    ],
  }),

  // SEGURIDAD FÍSICA
  new Paragraph({
    text: "Seguridad Física",
    bold: true,
    spacing: { before: 300, after: 100 },
  }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [encabezadoTabla("Tipo de Vigilancia"), celdaTexto(tipoVigilancia)],
      }),
      new TableRow({
        children: [encabezadoTabla("Horarios, turnos, dotación"), celdaTexto(horariosVigilancia)],
      }),
      new TableRow({
        children: [encabezadoTabla("Accesos"), celdaTexto(accesos)],
      }),
      new TableRow({
        children: [encabezadoTabla("Personal de cierre y apertura"), celdaTexto(personalCierre)],
      }),
      new TableRow({
        children: [encabezadoTabla("Cerramiento del predio"), celdaTexto(cerramientoPredio)],
      }),
      new TableRow({
        children: [encabezadoTabla("Otros (rejas, concertina, etc)"), celdaTexto(otrosCerramiento)],
      }),
      new TableRow({
        children: [encabezadoTabla("Comentarios"), celdaTexto(comentariosSeguridadFisica)],
      }),
    ],
  })
);


docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }),
  seccion("10. SINIESTRALIDAD"),
  linea(siniestralidad || "No se reportaron siniestros.")
);

//Recomendaciones 

docContent.push(
  new Paragraph({ text: "", spacing: { after: 300 } }),
  seccion("11. RECOMENDACIONES"),
  linea(recomendaciones || "No se reportaron recomendaciones.")
);

  
  
if (imagenesRegistro.length > 0) {
  // Título de la sección
  docContent.push(seccion("12. REGISTRO FOTOGRÁFICO"));

  // Aquí se guardarán las filas de la tabla
  const filas = [];

  // Recorre las imágenes de a 2 por fila
  for (let i = 0; i < imagenesRegistro.length; i += 2) {
    const celdasImagen = [];
    const celdasDescripcion = [];

    for (let j = i; j < i + 2 && j < imagenesRegistro.length; j++) {
      const img = imagenesRegistro[j];
      if (img && img.file && typeof img.file.arrayBuffer === "function") {
        const buffer = await img.file.arrayBuffer();
        celdasImagen.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: buffer,
                    transformation: { width: 250, height: 150 },
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          })
        );
        celdasDescripcion.push(
          new TableCell({
            children: [
              new Paragraph({
                text: img.descripcion || "",
                alignment: AlignmentType.CENTER,
              }),
            ],
          })
        );
      } else {
        celdasImagen.push(new TableCell({ children: [new Paragraph("")] }));
        celdasDescripcion.push(new TableCell({ children: [new Paragraph("")] }));
      }
    }

    // Agrega la fila de imágenes y la de descripciones
    filas.push(new TableRow({ children: celdasImagen }));
    filas.push(new TableRow({ children: celdasDescripcion }));
  }

  // Agrega la tabla al documento, con un salto de página antes de la sección
  docContent.push(
    new Paragraph({ text: "", spacing: { after: 300 }, pageBreakBefore: true }),
    new Table({ rows: filas }),
    new Paragraph({ text: "", spacing: { after: 300 } })
  );
}


  
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Arial",
          size: 24,
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
    },
  },
  sections: [
    {
headers: {
  default: new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          // Fila 1: Logo + Título
          new TableRow({
            height: { value: 1000, rule: "atLeast" }, // altura generosa
            children: [
              new TableCell({
                rowSpan: 2,
                width: { size: 30, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: await fetch(Logo).then((r) => r.arrayBuffer()),
                        transformation: {
                          width: 120, // Puedes ajustar estos valores
                          height: 80,
                        },
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                columnSpan: 2,
                width: { size: 70, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `INSPECCIÓN ${nombreCliente.toUpperCase()}`,
                        bold: true,
                        font: "Arial",
                        size: 24,
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
            ],
          }),
          // Fila 2: RIESGOS + INSP. RIESGOS / DATE
          new TableRow({
            height: { value: 600, rule: "exact" }, // altura ajustada para la fila inferior
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "RIESGOS",
                        bold: true,
                        font: "Arial",
                        size: 20,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                width: { size: 20, type: WidthType.PERCENTAGE },
                children: [
                  // Primer párrafo: INSP. RIESGOS
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "INSP. RIESGOS",
                        bold: true,
                        font: "Arial",
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                  // Segundo párrafo: DATE
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `DATE: ${new Date(fecha).toLocaleDateString("es-CO", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}`,
                        font: "Arial",
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
},

      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Página ",
                  font: "Arial",
                  size: 20,
                }),
                new SimpleField("PAGE"),
                new TextRun({
                  text: " de ",
                  font: "Arial",
                  size: 20,
                }),
                new SimpleField("NUMPAGES"),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },

      children: docContent,
    },
  ],
});

const blob = await Packer.toBlob(doc);
saveAs(blob, `Inspeccion_${nombreCliente || "cliente"}.docx`);
  };
  


L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

return (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
      <img src={Logo} alt="Logo PROSER" className="h-16 object-contain" />
      <div className="text-right">
          <p className="text-sm font-semibold">FECHA:</p>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Información Cliente */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Nombre del Cliente / Empresa
        </label>
        <input
          type="text"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Ej: LADRILLERA CASABLANCA S.A.S."
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Dirección
        </label>
        <input
          type="text"
          value={formData.direccion}
          onChange={e => setFormData({ ...formData, direccion: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Dirección"
        />
      </div>

      
      
      

      <div className="md:col-span-2">
      <Select
        options={municipios}
        value={formData.ciudad_siniestro || null}
        onChange={handleCiudadChange}
        placeholder="Selecciona una ciudad..."
        isSearchable
        className="w-full"
      />
      </div>



      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Aseguradora</label>
        <select
          name="aseguradora"
          value={formData.aseguradora}
          onChange={e =>
            setFormData({ ...formData, aseguradora: e.target.value })
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Selecciona una aseguradora</option>    <option value="PORTO & COMPAÑIA LTDA">PORTO & COMPAÑIA LTDA</option>
    <option value="UNISEG RIESGOS Y SEGUROS">UNISEG RIESGOS Y SEGUROS</option>
    <option value="ALIANZ SEGURO S.A.">ALIANZ SEGURO S.A.</option>
    <option value="ASEGURADORA SOLIDARIA DE COLOMBIA">ASEGURADORA SOLIDARIA DE COLOMBIA</option>
    <option value="AXA COLPATRIA SEGUROS S.A.">AXA COLPATRIA SEGUROS S.A.</option>
    <option value="BBVA SEGUROS COLOMBIA S.A.">BBVA SEGUROS COLOMBIA S.A.</option>
    <option value="CD ASESORES DE SEGUROS">CD ASESORES DE SEGUROS</option>
    <option value="CORPORACION DE VOLQUETEROS CORPORAVOL">CORPORACION DE VOLQUETEROS CORPORAVOL</option>
    <option value="CRAWFORD COLOMBIA S.A.S.">CRAWFORD COLOMBIA S.A.S.</option>
    <option value="ECOEQUIPOS COLOMBIA S.A.S">ECOEQUIPOS COLOMBIA S.A.S</option>
    <option value="EGON SEGUROS LTDA">EGON SEGUROS LTDA</option>
    <option value="EUROSEGUROS SU AGENCIA LTDA">EUROSEGUROS SU AGENCIA LTDA</option>
    <option value="ITAÚ CORREDOR DE SEGUROS">ITAÚ CORREDOR DE SEGUROS</option>
    <option value="JANNA SEGUROS LTDA.">JANNA SEGUROS LTDA.</option>
    <option value="LA EQUIDAD SEGUROS">LA EQUIDAD SEGUROS</option>
    <option value="LA PREVISORA S.A.">LA PREVISORA S.A.</option>
    <option value="LIBERTY SEGUROS S.A.">LIBERTY SEGUROS S.A.</option>
    <option value="MAPFRE SEGUROS GENERALES DE COLOMBIA S.A.">MAPFRE SEGUROS GENERALES DE COLOMBIA S.A.</option>
    <option value="MCA SEGUROS INTEGRLES LTDA">MCA SEGUROS INTEGRLES LTDA</option>
    <option value="PROSER AJUSTES SAS">PROSER AJUSTES SAS</option>
    <option value="SBS SEGUROS COLOMBIA S.A.">SBS SEGUROS COLOMBIA S.A.</option>
    <option value="SEGUROS ALFA S.A.">SEGUROS ALFA S.A.</option>
    <option value="SEGUTOS BOLÍVAR">SEGUTOS BOLÍVAR</option>
    <option value="SEGUROS CONFIANZA S.A.">SEGUROS CONFIANZA S.A.</option>
    <option value="SEGUROS DEL ESTADO">SEGUROS DEL ESTADO</option>
    <option value="SEGUROS GENERALES SURAMERICANA S.A.">SEGUROS GENERALES SURAMERICANA S.A.</option>
    <option value="ZÚRICH COLOMBIA SEGUROS S.A.">ZÚRICH COLOMBIA SEGUROS S.A.</option>
  </select>
</div>


      {/* Fotografía del Riesgo */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Subir Fotografía del Riesgo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
          className="mb-2"
        />
        {preview && (
          <div className="mt-2">
          <img
            src={preview}
            alt="Vista previa"
            className="max-w-[400px] max-h-[250px] mx-auto border rounded object-contain"
          />
            <p className="text-sm text-center mt-1 text-gray-600">
              Fachada del riesgo
            </p>
          </div>
        )}
      </div>

      {/* Carta de presentación */}
'      <div className="bg-gray-50 p-4 rounded border mb-6 text-sm text-gray-700 leading-relaxed">
        <p>
          Ciudad: {
            typeof formData.ciudad_siniestro === "object" && formData.ciudad_siniestro !== null
              ? formData.ciudad_siniestro.label
              : (typeof formData.ciudad_siniestro === "string"
                  ? formData.ciudad_siniestro
                  : "_________")
          }'
        </p>
                <br />
        <p>Señores</p>
        <p><strong>{aseguradora}</strong></p>
        <p>
          Ciudad: {
            typeof formData.ciudad_siniestro === "object" && formData.ciudad_siniestro !== null
              ? formData.ciudad_siniestro.label
              : (typeof formData.ciudad_siniestro === "string"
                  ? formData.ciudad_siniestro
                  : "_________")
          }
        </p>        <br />
        <p><strong>REF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: INFORME DE INSPECCIÓN</strong></p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ASEGURADO: {nombreCliente}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PREDIO INSPECCIONADO: {direccion}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FECHA DE INSPECCIÓN:{" "}
          {new Date(fecha).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </p>
        
        <br />
        <p>Apreciados Señores:</p>
        <p>
          Tomando como base la asignación de inspección que nos fuera oficializada, estamos adjuntando el informe único y confidencial de las labores realizadas en el Riesgo en referencia.
        </p>
        <p>
          Luego de analizar los diferentes aspectos relacionados con el estado actual del predio, así como las protecciones existentes contra posibles eventos como incendio, hurto, entre otros; se afirma que el riesgo <strong>SE PUEDE SUSCRIBIR</strong>. No obstante, se deben cumplir las recomendaciones para el mejoramiento del riesgo y prevención de emergencias.
        </p>
        <p>
          Estamos a su disposición para aclarar cualquier inquietud que tengan al respecto y agradecemos la confianza depositada en nuestros servicios profesionales para este caso.
        </p>
        <br />
        <p>Cordialmente,</p>
        <br />
        <p><strong>ARNALDO TAPIA GUTIERREZ</strong><br />Gerente</p>
      </div>




      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Tabla de Contenido</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border px-3 py-1 font-bold">REF</th>
                <th className="border px-3 py-1 font-bold">: INFORME DE INSPECCIÓN</th>
                <th className="border px-3 py-1 text-right">2</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1.", "INFORMACIÓN GENERAL", "8"],
                ["2.", "DESCRIPCIÓN GENERAL DE LA EMPRESA", "8"],
                ["3.", "INFRAESTRUCTURA", "11"],
                ["4.", "PROCESOS", "12"],
                ["5.", "LINDEROS", "13"],
                ["6.", "MAQUINARIA, EQUIPOS Y MANTENIMIENTO", "13"],
                ["7.", "SERVICIOS INDUSTRIALES", "15"],
                ["9", "SEGURIDAD", "17"],
                ["10", "SINIESTRALIDAD", "18"],
                ["11", "RECOMENDACIONES", "19"],
                ["12", "REGISTRO FOTOGRÁFICO", "21"]
              ].map(([num, title, page], idx) => (
                <tr key={idx}>
                  <td className="border px-3 py-1">{num}</td>
                  <td className="border px-3 py-1">{title}</td>
                  <td className="border px-3 py-1 text-right">{page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>




    {/* Tabla de Análisis de Riesgos */}
<div className="overflow-x-auto mb-6">
<h2 className="text-lg font-semibold mb-2 italic">ANÁLISIS DE RIESGOS</h2>
<table className="w-full border border-black text-sm">
<thead className="bg-gray-300 text-black">
  <tr>
    <th className="border border-black px-2 py-1 w-1/4 text-left">RIESGO</th>
    <th className="border border-black px-2 py-1 text-left">ANÁLISIS</th>
  </tr>
</thead>
<tbody>
  {[
    "Incendio/Explosión",
    "Amit",
    "Anegación",
    "Daños por agua",
    "Terremoto",
    "Sustracción",
    "Rotura de maquinaria",
    "Responsabilidad civil"
  ].map((riesgo, index) => (
    <tr key={index}>
      <td className="border border-black px-2 py-1 font-semibold">{riesgo}</td>
      <td className="border border-black px-2 py-1">
      <textarea
  rows={4}
  className="w-full border border-gray-300 p-1 rounded resize-y"
  placeholder={`Escribe el análisis para ${riesgo.toLowerCase()}...`}
  value={analisisRiesgos[riesgo]}
  onChange={(e) =>
    setAnalisisRiesgos({ ...analisisRiesgos, [riesgo]: e.target.value })
  }
/>

      </td>
    </tr>
  ))}
</tbody>
</table>

</div>


<div className="mt-10 text-sm text-justify leading-relaxed text-gray-800">
<p className="mb-4">
  Para la calificación de los riesgos amparados en la póliza, se han ubicado para el informe las diferentes amenazas en una matriz formada por la Probabilidad que se presente en determinado evento, la Severidad o gravedad de los efectos que se producen por la realización de dicho evento, donde el Riesgo es igual a la Probabilidad X Severidad.
</p>

<h2 className="font-bold text-lg mb-2">Probabilidad:</h2>
<ul className="list-disc pl-6 mb-4">
  <li><strong>Muy Baja (Improbable):</strong> Virtualmente imposible, solo podrá producirse en condiciones excepcionales. = (1)</li>
  <li><strong>Baja:</strong> Imaginable pero poco posible, ya ha ocurrido en otra parte. Este evento podría producirse en algún momento. = (2)</li>
  <li><strong>Moderada (Probable):</strong> Poco habitual. Ha ocurrido o puede ocurrir aquí. Este evento debería ocurrir en algún momento. = (3) </li>
  <li><strong>Alta (Posible):</strong> Muy posible, con gran probabilidad de ocurrencia, este evento se producirá probablemente en la mayoría de las circunstancias. = (4)</li>
  <li><strong>Muy Alta (Frecuente):</strong> Muy probable, de alta probabilidad de ocurrencia, se espera que ocurra en la mayoría de las circunstancias. = (5)</li>
</ul>

<h2 className="font-bold text-lg mb-2">Severidad:</h2>
<ul className="list-disc pl-6 mb-4">
  <li><strong>Insignificante:</strong> Consecuencias pequeñas, no afecta el desarrollo normal de la empresa.= (1)</li>
  <li><strong>Menor:</strong> Consecuencias medianas, pueden exigir control leve. = (2)</li>
  <li><strong>Moderada:</strong> Consecuencias altas, deben tomarse medidas. = (3)</li>
  <li><strong>Mayor:</strong> Consecuencias importantes, se deben establecer medidas de emergencia. = (4)</li>
  <li><strong>Catastrófica:</strong> Pérdidas enormes, podría implicar el cierre de la empresa. = (5)</li>
</ul>

<h2 className="font-bold text-lg mb-3">Clasificación de Riesgos</h2>
<table className="w-full border border-black text-sm text-left">
<thead className="bg-gray-300 text-black">
  <tr>
    <th className="border border-black px-2 py-1">Riesgo</th>
    <th className="border border-black px-2 py-1">Probabilidad</th>
    <th className="border border-black px-2 py-1">Severidad</th>
    <th className="border border-black px-2 py-1">Clasificación</th>
  </tr>
</thead>
<tbody>
  {[
    "Incendio/Explosión",
    "AMIT",
    "Anegación",
    "Terremoto",
    "Sustracción",
    "Rotura de maquinaria",
    "Responsabilidad Civil"
  ].map((riesgo, idx) => (
    <tr key={idx}>
      <td className="border border-black px-2 py-1 font-semibold">{riesgo}</td>
      <td className="border border-black px-2 py-1">
        <input
          type="text"
          value={tablaRiesgos[idx]?.probabilidad || ""}
          onChange={(e) => actualizarRiesgo(idx, "probabilidad", e.target.value)}
          className="w-full border border-gray-300 px-1 py-0.5 text-sm"
        />
      </td>
      <td className="border border-black px-2 py-1">
        <input
          type="text"
          value={tablaRiesgos[idx]?.severidad || ""}
          onChange={(e) => actualizarRiesgo(idx, "severidad", e.target.value)}
          className="w-full border border-gray-300 px-1 py-0.5 text-sm"
        />
      </td>
      <td className="border border-black px-2 py-1">
        <input
          type="text"
          value={tablaRiesgos[idx]?.clasificacion || ""}
          onChange={(e) => actualizarRiesgo(idx, "clasificacion", e.target.value)}
          className="w-full border border-gray-300 px-1 py-0.5 text-sm"
        />
      </td>
    </tr>
  ))}
</tbody>
</table>

</div>


{/*AQUI VA LA MATRIZ*/}
<div className="overflow-x-auto mb-6">
  <table className="w-full border text-sm">
    <thead className="bg-gray-200">
      <tr>
        <th>Riesgo</th>
        <th>Probabilidad</th>
        <th>Severidad</th>
        <th>R</th>
        <th>% Vulnerabilidad</th>
        <th>Clasificación</th>
      </tr>
    </thead>
    <tbody>
      {tablaRiesgos.map((item, i) => (
        <tr key={i}>
          <td>{item.riesgo}</td>
          <td>
            <input type="number" value={item.probabilidad} onChange={e => actualizarRiesgo(i, "probabilidad", e.target.value)} />
          </td>
          <td>
            <input type="number" value={item.severidad} onChange={e => actualizarRiesgo(i, "severidad", e.target.value)} />
          </td>
          <td>{item.r}</td>
          <td>{item.indice}%</td>
          <td>{item.clasificacion}</td>
        </tr>
      ))}
    </tbody>
  </table>
  <h2 className="text-xl font-bold mb-4 mt-8">Matriz de Calor (Visual)</h2>
  <MapaDeCalor tablaRiesgos={tablaRiesgos} />

</div>


{/* INFORME DE INSPECCIÓN - INFORMACIÓN GENERAL */}
 <div className="mt-10 bg-white p-6 border rounded shadow-sm">
 <h2 className="text-xl font-bold mb-4">1. INFORMACIÓN GENERAL</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-semibold mb-1">Nombre de la Empresa</label>
      <input
        type="text"
        placeholder="Ej: Ladrillera Casablanca S.A.S."
        value={nombreEmpresa}
        onChange={(e) => setNombreEmpresa(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-1">Dirección</label>
      <input
        type="text"
        placeholder="Ej: Km 8 vía El Zulia"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <div className="md:col-span-2">
        <label className="block text-sm font-medium">Ciudad del Siniestro</label>
       <Select
            options={municipios}
            value={municipios.find(
              (opt) =>
                opt.value === formData.ciudad_siniestro &&
                opt.label.includes(formData.departamento_siniestro || "")
            )}
            onChange={handleCiudadChange}
            placeholder="Selecciona una ciudad..."
            isSearchable
            className="w-full"
          />
      </div>
    <div>
      <label className="block text-sm font-semibold mb-1">Persona Entrevistada</label>
      <input
        type="text"
        placeholder="Ej: Nelson Gómez"
        value={personaEntrevistada}
        onChange={(e) => setPersonaEntrevistada(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-1">Barrio</label>
      <input
        type="text"
        placeholder="Ej: Vía El Zulia"
        value={barrio}
        onChange={(e) => setBarrio(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-1">Departamento</label>
      <input
        type="text"
        placeholder="Ej: Norte de Santander"
        value={formData.departamento_siniestro}
        onChange={e => setFormData({ ...formData, departamento_siniestro: e.target.value })}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-1">Cargo</label>
      <input
        type="text"
        placeholder="Ej: Jefe de mantenimiento"
        value={cargo}
        onChange={(e) => setCargo(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
        <div>
      <label className="block text-sm font-semibold mb-1">HORARIO LABORAL</label>
      <input
        type="text"
        placeholder="6AM - 5PM"
        value={horarioLaboral} // <--- aquí debe ir horarioLaboral
        onChange={(e) => setHorarioLaboral(e.target.value)} // <--- aquí debe ir setHorarioLaboral
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-1">NÚMERO DE COLABOLADORES</label>
      <input
        type="text"
        placeholder="16"
        value={colaboladores} // <--- aquí debe ir colaboladores
        onChange={(e) => setColaboladores(e.target.value)} // <--- aquí debe ir setColaboladores
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  </div>
</div>





{/* Secciones extensas como texto libre */}
<div className="mt-8 bg-white p-6 border rounded shadow-sm">
<h2 className="text-xl font-bold mb-4">2. DESCRIPCIÓN GENERAL DE LA EMPRESA</h2>
<textarea
  rows={6}
  placeholder="Agrega aquí la descripción general de la empresa..."
  value={descripcionEmpresa}
  onChange={(e) => setDescripcionEmpresa(e.target.value)}
  className="w-full border border-gray-300 rounded px-3 py-2"
></textarea>
</div>


{/* SECCIÓN INFRAESTRUCTURA */}
<div className="mt-8 bg-white p-6 border rounded shadow-sm">
<h2 className="text-xl font-bold mb-4">3. INFRAESTRUCTURA</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-semibold mb-1">Antigüedad</label>
    <input
      type="text"
      placeholder="Ej: 76 años aprox"
      value={antiguedad}
      onChange={(e) => setAntiguedad(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Área Lote</label>
    <input
      type="text"
      placeholder="Ej: 450.000 m²"
      value={areaLote}
      onChange={(e) => setAreaLote(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Área Construida</label>
    <input
      type="text"
      placeholder="Ej: 35.000 m²"
      value={areaConstruida}
      onChange={(e) => setAreaConstruida(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Nº de Edificios</label>
    <input
      type="text"
      placeholder="Ej: 2"
      value={numeroEdificios}
      onChange={(e) => setNumeroEdificios(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Nº de Pisos</label>
    <input
      type="text"
      placeholder="Ej: 3"
      value={numeroPisos}
      onChange={(e) => setNumeroPisos(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Sótanos</label>
    <input
      type="text"
      placeholder="Ej: No"
      value={sotanos}
      onChange={(e) => setSotanos(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Propio o Arrendado</label>
    <input
      type="text"
      placeholder="Ej: Propio"
      value={tenencia}
      onChange={(e) => setTenencia(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>

  <div className="md:col-span-2">
    <label className="block text-sm font-semibold mb-1">Descripción</label>
    <textarea
      placeholder="Ej: Techo y cubierta..."
      rows={5}
      value={descripcionInfraestructura}
      onChange={(e) => setDescripcionInfraestructura(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>
</div>
</div>



{/* SECCIÓN PROCESOS */}
<div className="mt-10 bg-white p-6 border rounded shadow-sm">
  <h2 className="text-lg font-bold mb-4">4. PROCESOS</h2>
  <label className="block text-sm font-semibold mb-2">Descripción de Procesos</label>
  <textarea
    placeholder="Ej: El proceso de fabricación de un ladrillo (bloque)..."
    value={procesos}
    onChange={(e) => setProcesos(e.target.value)}
    rows={5}
    className="w-full border border-gray-300 rounded px-3 py-2"
  />
</div>


{/* SECCIÓN LINDEROS */}
<div className="mt-8 bg-white p-6 border rounded shadow-sm">
<h2 className="text-xl font-bold mb-4">5. LINDEROS</h2>

<div className="grid grid-cols-2 gap-4 text-sm mb-6">
    <label className="font-semibold" htmlFor="norte">NORTE:</label>
    <input
      type="text"
      id="norte"
      value={linderoNorte}
      onChange={(e) => setLinderoNorte(e.target.value)}
      placeholder="Ej. Vía pública"
      className="border px-2 py-1 rounded w-full"
    />

    <label className="font-semibold" htmlFor="sur">SUR:</label>
    <input
      type="text"
      id="sur"
      value={linderoSur}
      onChange={(e) => setLinderoSur(e.target.value)}
      placeholder="Ej. Vía pública"
      className="border px-2 py-1 rounded w-full"
    />

    <label className="font-semibold" htmlFor="oriente">ORIENTE:</label>
    <input
      type="text"
      id="oriente"
      value={linderoOriente}
      onChange={(e) => setLinderoOriente(e.target.value)}
      placeholder="Ej. Lote Baldío"
      className="border px-2 py-1 rounded w-full"
    />

    <label className="font-semibold" htmlFor="occidente">OCCIDENTE:</label>
    <input
      type="text"
      id="occidente"
      value={linderoOccidente}
      onChange={(e) => setLinderoOccidente(e.target.value)}
      placeholder="Ej. Edificación"
      className="border px-2 py-1 rounded w-full"
    />
  </div>

{/* Mapa Leaflet para referencia */}
<div ref={mapaRef} className="mt-4">
  <MapaUbicacion />
</div>

<p className="text-xs mt-2 italic text-center">Coordenadas basadas en la ubicación actual del dispositivo</p>
</div>


{/* SECCIÓN MAQUINARIA */}
<div className="mt-8 bg-white p-6 border rounded shadow-sm">
<h2 className="text-xl font-bold mb-4">6. MAQUINARIA, EQUIPOS Y MANTENIMIENTO</h2>

<label className="block text-sm font-semibold mb-1">Descripción del Equipamiento</label>
<textarea
  rows={8}
  placeholder="Ej: El predio inspeccionado cuenta con los siguientes equipos y maquinaria: 22 hornos tipo colmena, 4 extrusoras, 2 plantas eléctricas..."
  value={maquinariaDescripcion}
  onChange={(e) => setMaquinariaDescripcion(e.target.value)}
  className="w-full border border-gray-300 rounded px-3 py-2"
/>
</div>

<FormularioAreas onChange={(areas) => setDatosEquipos(areas)} />




<div className="mt-8 bg-white p-6 border rounded shadow-sm">
  <h2 className="text-xl font-bold mb-4">7. SERVICIOS INDUSTRIALES</h2>

  {/* Energía */}
  <div className="bg-white p-4 rounded shadow mb-8">
    <h2 className="text-lg font-bold italic mb-4">Energía</h2>

    <div className="mb-4">
      <label className="font-semibold block mb-1">PROVEEDOR</label>
      <input
        type="text"
        value={energiaProveedor}
        onChange={(e) => setEnergiaProveedor(e.target.value)}
        placeholder="Ej: Centrales Eléctricas de Norte de Santander (CENS)."
        className="w-full border rounded px-2 py-1"
      />
    </div>

    <div className="mb-4">
      <label className="font-semibold block mb-1">TENSIÓN</label>
      <input
        type="text"
        value={energiaTension}
        onChange={(e) => setEnergiaTension(e.target.value)}
        placeholder="Ej: Alta tensión de la red pública (34,5Kv) y la entrega a 440v"
        className="w-full border rounded px-2 py-1"
      />
    </div>

    {/* Transformadores */}
    <h3 className="font-bold text-sm mt-6 mb-2">TRANSFORMADORES</h3>
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-sm">
      <input
        className="border rounded px-2 py-1"
        placeholder="Subestación"
        value={transformadorSubestacion}
        onChange={(e) => setTransformadorSubestacion(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Marca"
        value={transformadorMarca}
        onChange={(e) => setTransformadorMarca(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Tipo"
        value={transformadorTipo}
        onChange={(e) => setTransformadorTipo(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Capacidad"
        value={transformadorCapacidad}
        onChange={(e) => setTransformadorCapacidad(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Edad"
        value={transformadorEdad}
        onChange={(e) => setTransformadorEdad(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Relación voltaje"
        value={transformadorRelacionVoltaje}
        onChange={(e) => setTransformadorRelacionVoltaje(e.target.value)}
      />
    </div>

    {/* Plantas Eléctricas */}
    <h3 className="font-bold text-sm mt-6 mb-2">PLANTAS ELÉCTRICAS</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 text-sm">
      <input
        className="border rounded px-2 py-1"
        placeholder="Número"
        value={plantaNumero1}
        onChange={(e) => setPlantaNumero1(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Marca"
        value={plantaMarca1}
        onChange={(e) => setPlantaMarca1(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Tipo"
        value={plantaTipo1}
        onChange={(e) => setPlantaTipo1(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Capacidad"
        value={plantaCapacidad1}
        onChange={(e) => setPlantaCapacidad1(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Edad"
        value={plantaEdad1}
        onChange={(e) => setPlantaEdad1(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Transferencia"
        value={plantaTransferencia1}
        onChange={(e) => setPlantaTransferencia1(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Voltaje/Cobertura"
        value={plantaCobertura1}
        onChange={(e) => setPlantaCobertura1(e.target.value)}
      />
    </div>

    {/* Pararrayos */}
    <div className="mt-6">
      <label className="font-semibold block mb-1">PARARRAYOS</label>
      <input
        type="text"
        value={energiaPararrayos}
        onChange={(e) => setEnergiaPararrayos(e.target.value)}
        placeholder="Sí / No"
        className="w-full border rounded px-2 py-1"
      />
    </div>

    {/* Comentarios energía */}
    <label className="block text-sm font-medium mb-1">Comentarios</label>
    <textarea
      rows={6}
      value={energiaComentarios}
      onChange={(e) => setEnergiaComentarios(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2"
      placeholder="Escribe observaciones del sistema eléctrico..."
    ></textarea>
  </div>






  {/* Agua */}
  <div className="overflow-x-auto mb-6">
  <table className="min-w-full text-sm text-left border border-gray-300">
    <thead className="bg-gray-100 text-gray-800 font-bold">
      <tr>
        <th className="px-4 py-2 border">FUENTE</th>
        <th className="px-4 py-2 border">USO</th>
        <th className="px-4 py-2 border">ALMACENAMIENTO</th>
        <th className="px-4 py-2 border">EQUIPO DE BOMBEO</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="px-4 py-2 border">
          <input
            type="text"
            value={aguaFuente}
            onChange={(e) => setAguaFuente(e.target.value)}
            placeholder="Ej: Compra de carro tanque"
            className="w-full border rounded px-2 py-1"
          />
        </td>
        <td className="px-4 py-2 border">
          <input
            type="text"
            value={aguaUso}
            onChange={(e) => setAguaUso(e.target.value)}
            placeholder="Ej: En toda la edificación"
            className="w-full border rounded px-2 py-1"
          />
        </td>
        <td className="px-4 py-2 border">
          <input
            type="text"
            value={aguaAlmacenamiento}
            onChange={(e) => setAguaAlmacenamiento(e.target.value)}
            placeholder="Ej: Tanques"
            className="w-full border rounded px-2 py-1"
          />
        </td>
        <td className="px-4 py-2 border">
          <input
            type="text"
            value={aguaBombeo}
            onChange={(e) => setAguaBombeo(e.target.value)}
            placeholder="Ej: A presión"
            className="w-full border rounded px-2 py-1"
          />
        </td>
      </tr>
    </tbody>
  </table>
</div>
</div>

<div className="mt-8 bg-white p-6 border rounded shadow-sm">
  <h2 className="text-xl font-bold mb-4">8. PROTECCIONES CONTRA INCENDIOS</h2>

  <div className="grid grid-cols-1 gap-4 text-sm mb-6">
    <div className="grid grid-cols-12 items-center gap-2">
      <label className="font-semibold col-span-3">EXTINTOR</label>
      <input
        type="text"
        value={extintor}
        onChange={(e) => setExtintor(e.target.value)}
        placeholder="Ej: 27 extintores multipropósito, 10lbs y 2 tipo satélite de CO2"
        className="col-span-9 border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <div className="grid grid-cols-12 items-center gap-2">
      <label className="font-semibold col-span-3">RED CONTRAINCENDIO</label>
      <input
        type="text"
        value={rci}
        onChange={(e) => setRci(e.target.value)}
        placeholder="Ej: No cuentan con RCI"
        className="col-span-9 border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <div className="grid grid-cols-12 items-center gap-2">
      <label className="font-semibold col-span-3">SISTEMA DE ROCIADORES</label>
      <input
        type="text"
        value={rociadores}
        onChange={(e) => setRociadores(e.target.value)}
        placeholder="Ej: No cuentan con sistema de rociadores"
        className="col-span-9 border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <div className="grid grid-cols-12 items-center gap-2">
      <label className="font-semibold col-span-3">DETECCIÓN DE INCENDIOS</label>
      <input
        type="text"
        value={deteccion}
        onChange={(e) => setDeteccion(e.target.value)}
        placeholder="Ej: No cuentan con detección de humo"
        className="col-span-9 border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <div className="grid grid-cols-12 items-center gap-2">
      <label className="font-semibold col-span-3">ALARMAS DE INCENDIO</label>
      <input
        type="text"
        value={alarmas}
        onChange={(e) => setAlarmas(e.target.value)}
        placeholder="Ej: Cuentan con pulsadores de alarma"
        className="col-span-9 border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <div className="grid grid-cols-12 items-center gap-2">
      <label className="font-semibold col-span-3">BRIGADAS DE EMERGENCIA</label>
      <input
        type="text"
        value={brigadas}
        onChange={(e) => setBrigadas(e.target.value)}
        placeholder="Ej: 20 brigadistas, simulacros anuales, camillas y botiquines"
        className="col-span-9 border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <div className="grid grid-cols-12 items-center gap-2">
      <label className="font-semibold col-span-3">BOMBEROS</label>
      <input
        type="text"
        value={bomberos}
        onChange={(e) => setBomberos(e.target.value)}
        placeholder="Ej: Estación de Atalaya, tiempo de reacción aprox. 20 min"
        className="col-span-9 border border-gray-300 rounded px-3 py-2"
      />
    </div>
  </div>
</div>


<h2 className="text-xl font-bold mb-4">9. SEGURIDAD</h2>

{/* Seguridad Electrónica */}
<h3 className="text-lg font-semibold mb-2">Seguridad Electrónica</h3>

<label>Alarma Monitoreada</label>
<input type="text" value={alarmaMonitoreada} onChange={(e) => setAlarmaMonitoreada(e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />

<label>CCTV (cámaras, monitoreo)</label>
<input type="text" value={cctv} onChange={(e) => setCctv(e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />

<label>Mantenimiento</label>
<input type="text" value={mantenimientoSeguridad} onChange={(e) => setMantenimientoSeguridad(e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />

<label>Comentarios</label>
<textarea value={comentariosSeguridadElectronica} onChange={(e) => setComentariosSeguridadElectronica(e.target.value)} className="w-full border rounded px-2 py-1 mb-4" rows={3} />

{/* Seguridad Física */}
<h3 className="text-lg font-semibold mb-2">Seguridad Física</h3>

<label>Tipo de Vigilancia</label>
<input type="text" value={tipoVigilancia} onChange={(e) => setTipoVigilancia(e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />

<label>Horarios, turnos, dotación</label>
<input type="text" value={horariosVigilancia} onChange={(e) => setHorariosVigilancia(e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />

<label>Accesos</label>
<input type="text" value={accesos} onChange={(e) => setAccesos(e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />

<label>Personal de cierre y apertura</label>
<input type="text" value={personalCierre} onChange={(e) => setPersonalCierre(e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />

<label>Cerramiento del predio</label>
<input type="text" value={cerramientoPredio} onChange={(e) => setCerramientoPredio(e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />

<label>Otros (rejas, concertina, etc)</label>
<input type="text" value={otrosCerramiento} onChange={(e) => setOtrosCerramiento(e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />

<label>Comentarios</label>
<textarea value={comentariosSeguridadFisica} onChange={(e) => setComentariosSeguridadFisica(e.target.value)} className="w-full border rounded px-2 py-1 mb-4" rows={3} />



<div className="mt-8 bg-white p-6 border rounded shadow-sm">
  <h2 className="text-xl font-bold mb-4">10. SINIESTRALIDAD</h2>

  <label className="block text-sm font-semibold mb-1">
    Descripción de siniestros ocurridos
  </label>
  <textarea
    rows={10}
    value={siniestralidad}
    onChange={(e) => setSiniestralidad(e.target.value)}
    className="w-full border border-gray-300 rounded px-3 py-2"
    placeholder="Incluye el detalle de los siniestros reportados, fechas, causas y acciones correctivas."
  />
</div>


<div className="mt-8 bg-white p-6 border rounded shadow-sm">
  <h2 className="text-xl font-bold mb-4">11. RECOMENDACIONES</h2>

  {/* Combo 1 - seleccionar categoría */}
  <label className="block text-sm font-semibold mb-2">Categoría</label>
  <select
    value={categoriaSeleccionada}
    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
  >
    <option value="">Seleccione una categoría...</option>
    {Object.keys(bancoRecomendaciones).map((categoria, index) => (
      <option key={index} value={categoria}>
        {categoria}
      </option>
    ))}
  </select>

  {/* Combo 2 - seleccionar recomendación */}
  {categoriaSeleccionada && (
    <>
      <label className="block text-sm font-semibold mb-2">Recomendación</label>
      <select
        onChange={(e) => handleAgregarRecomendacion(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        defaultValue=""
      >
        <option value="" disabled>
          Seleccione una recomendación...
        </option>
        {bancoRecomendaciones[categoriaSeleccionada].map((rec, index) => (
          <option key={index} value={rec}>
            {rec.slice(0, 100)}...
          </option>
        ))}
      </select>
    </>
  )}

  {/* Textarea editable */}
  <label className="block text-sm font-semibold mb-2">
    Recomendaciones generales (editable)
  </label>
  <textarea
    rows={10}
    value={recomendaciones}
    onChange={(e) => setRecomendaciones(e.target.value)}
    placeholder="Escribe aquí las recomendaciones o selecciona desde el combo."
    className="w-full border border-gray-300 rounded px-3 py-2"
  />
</div>




<RegistroFotografico onChange={setImagenesRegistro} />




      {/* Botón de acción */}
      <div className="text-right">
      <button
type="button"
onClick={() => generarWord (datosEquipos)}
className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-4"
>
📝 Exportar Word
</button>
      </div>
    </div>
  </div>
);
}


