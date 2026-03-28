# Especificación de Requisitos de Software (SRS) - Interfaz Gráfica

## 1. Introducción

Este documento de Especificación de Requisitos de Software (SRS) detalla los requisitos técnicos para la implementación de la interfaz gráfica de usuario (GUI) del sistema de análisis de configuración TLS, desarrollado en el contexto del reto "Operación Defensa Web: Análisis de Configuración TLS" de Risaralda. El enfoque principal de este SRS es proporcionar una base técnica sólida para el diseño y desarrollo de la UI, asegurando que cumpla con los requisitos funcionales y no funcionales definidos en el PRD.

### 1.1. Propósito

El propósito de este documento es especificar de manera clara y unívoca los requisitos de la interfaz gráfica, sirviendo como referencia para los equipos de diseño, desarrollo y pruebas. Se busca garantizar que la UI sea robusta, escalable y cumpla con los estándares de usabilidad y rendimiento esperados.

### 1.2. Alcance

El alcance de este SRS se limita a la definición de la interfaz gráfica de usuario, incluyendo sus componentes, interacciones, flujos de navegación y aspectos técnicos relacionados con su implementación. No abarca los requisitos del backend, la lógica de negocio del motor TLS o la infraestructura subyacente, salvo en lo que respecta a su interacción con la UI.

### 1.3. Definiciones, Acrónimos y Abreviaturas

| Término | Definición |
| :------ | :--------- |
| **UI** | Interfaz de Usuario (User Interface) |
| **UX** | Experiencia de Usuario (User Experience) |
| **PRD** | Documento de Requisitos de Producto (Product Requirements Document) |
| **SRS** | Especificación de Requisitos de Software (Software Requirements Specification) |
| **TLS** | Seguridad de la Capa de Transporte (Transport Layer Security) |
| **MVP** | Producto Mínimo Viable (Minimum Viable Product) |
| **API** | Interfaz de Programación de Aplicaciones (Application Programming Interface) |
| **DOM** | Modelo de Objeto de Documento (Document Object Model) |

## 2. Requisitos Funcionales de la Interfaz Gráfica

Los siguientes requisitos funcionales describen las capacidades que la interfaz gráfica debe proporcionar al usuario.

### 2.1. Gestión de Entradas de Análisis (RF-UI-001)

*   **RF-UI-001.1 - Campo de Entrada de Texto:** La UI debe incluir un campo de texto (`<textarea>` o similar) que permita al usuario ingresar uno o múltiples dominios o direcciones IP. Cada entrada debe estar separada por un salto de línea o coma.
*   **RF-UI-001.2 - Validación de Formato:** Al enviar las entradas, la UI debe realizar una validación del formato de cada dominio/IP. En caso de error, debe mostrar un mensaje de error claro y específico para cada entrada inválida.
*   **RF-UI-001.3 - Botón de Inicio de Análisis:** Debe existir un botón claramente etiquetado (ej. "Iniciar Análisis") que, al ser presionado, envíe las entradas validadas al backend para su procesamiento.

### 2.2. Visualización del Progreso del Análisis (RF-UI-002)

*   **RF-UI-002.1 - Indicador de Carga Global:** Durante el análisis, la UI debe mostrar un indicador visual de carga (ej. spinner global o barra de progreso indeterminada) para señalar que el sistema está ocupado.
*   **RF-UI-002.2 - Estado de Fases:** La UI debe actualizar dinámicamente el estado de las fases del pipeline (Ingesta, Motor TLS, Motor de Reglas, Reporte) a medida que se completan, utilizando iconos o texto descriptivo.
*   **RF-UI-002.3 - Mensajes de Retroalimentación:** Se deben mostrar mensajes informativos en tiempo real sobre el progreso, errores o finalización del análisis.

### 2.3. Presentación de Resultados Resumidos (RF-UI-003)

*   **RF-UI-003.1 - Tarjeta de Resumen General:** La UI debe presentar una tarjeta o panel resumen que muestre el estado general de seguridad TLS del servidor analizado (ej. "Riesgo Alto", "Configuración Óptima"). Este estado debe ser determinado por el Motor de Reglas del backend.
*   **RF-UI-003.2 - Visualización de Versiones TLS:** Se debe mostrar una lista o tabla de las versiones TLS (1.0, 1.1, 1.2, 1.3) detectadas para cada dominio/IP, indicando claramente si están habilitadas o deshabilitadas.

### 2.4. Detalle de Hallazgos y Riesgos (RF-UI-004)

*   **RF-UI-004.1 - Tabla de Hallazgos:** Los hallazgos específicos de configuraciones inseguras o protocolos obsoletos deben presentarse en una tabla interactiva con las siguientes columnas:
    *   `Dominio/IP`: El objetivo analizado.
    *   `Versión TLS`: La versión de TLS relevante para el hallazgo.
    *   `Estado`: Si la configuración está habilitada o deshabilitada.
    *   `Criticidad`: Nivel de riesgo (Alta, Media, Baja), con codificación de color si es posible.
    *   `Descripción del Riesgo`: Texto explicativo del riesgo.
*   **RF-UI-004.2 - Filtrado y Ordenamiento:** La tabla debe permitir filtrar por criticidad y ordenar por dominio/IP o criticidad.

### 2.5. Recomendaciones de Endurecimiento (RF-UI-005)

*   **RF-UI-005.1 - Sección de Recomendaciones:** Para cada hallazgo en la tabla, debe haber una sección expandible o un modal que muestre las recomendaciones accionables para mitigar el riesgo. Estas recomendaciones serán proporcionadas por el backend.
*   **RF-UI-005.2 - Formato de Recomendaciones:** Las recomendaciones deben presentarse en un formato claro y conciso, utilizando listas o párrafos cortos.

### 2.6. Exportación de Informes (RF-UI-006)

*   **RF-UI-006.1 - Botón de Exportación:** La UI debe incluir un botón "Exportar Informe" visible en la sección de resultados.
*   **RF-UI-006.2 - Selección de Formato:** Al hacer clic en el botón, se debe presentar una opción para seleccionar el formato de exportación (PDF, HTML).
*   **RF-UI-006.3 - Generación y Descarga:** El sistema debe generar el informe en el formato seleccionado y ofrecerlo para descarga al usuario. La generación del informe se realizará en el backend y la UI solo gestionará la descarga.

## 3. Requisitos No Funcionales de la Interfaz Gráfica

Estos requisitos definen las cualidades y restricciones del sistema que no están directamente relacionadas con la funcionalidad, pero son cruciales para la calidad de la UI.

### 3.1. Usabilidad (RNF-UI-001)

*   **RNF-UI-001.1 - Curva de Aprendizaje:** La UI debe ser utilizable por un usuario promedio con conocimientos básicos de navegación web en menos de 5 minutos para realizar un análisis básico.
*   **RNF-UI-001.2 - Consistencia:** Todos los elementos de la UI (botones, formularios, navegación) deben mantener una apariencia y comportamiento consistentes en toda la aplicación.
*   **RNF-UI-001.3 - Retroalimentación:** El sistema debe proporcionar retroalimentación visual y textual inmediata a todas las acciones del usuario.

### 3.2. Rendimiento (RNF-UI-002)

*   **RNF-UI-002.1 - Tiempo de Carga de Página:** La página principal de la UI debe cargar completamente en menos de 3 segundos en una conexión de banda ancha estándar.
*   **RNF-UI-002.2 - Reactividad de la UI:** Las interacciones del usuario (clics, filtros) deben tener un tiempo de respuesta inferior a 500 ms.
*   **RNF-UI-002.3 - Manejo de Datos:** La UI debe ser capaz de mostrar resultados para hasta 100 dominios/IPs sin degradación significativa del rendimiento.

### 3.3. Accesibilidad (RNF-UI-003)

*   **RNF-UI-003.1 - Estándares WCAG:** La UI debe cumplir con las pautas de accesibilidad WCAG 2.1 Nivel AA.
*   **RNF-UI-003.2 - Navegación por Teclado:** Todas las funcionalidades interactivas deben ser accesibles y operables mediante el teclado.
*   **RNF-UI-003.3 - Contraste de Color:** Los elementos de texto y los componentes interactivos deben tener un contraste de color suficiente para ser legibles para usuarios con deficiencias visuales.

### 3.4. Diseño Responsivo (RNF-UI-004)

*   **RNF-UI-004.1 - Adaptabilidad:** La UI debe adaptarse automáticamente a diferentes tamaños de pantalla, desde dispositivos móviles (ancho mínimo de 320px) hasta monitores de escritorio (ancho máximo de 1920px).
*   **RNF-UI-004.2 - Puntos de Ruptura:** Se deben definir puntos de ruptura (`breakpoints`) para asegurar una visualización óptima en los tamaños de pantalla más comunes.

### 3.5. Estética (RNF-UI-005)

*   **RNF-UI-005.1 - Guía de Estilo:** Se debe seguir una guía de estilo visual consistente que defina tipografías, paleta de colores, espaciado y uso de iconos.
*   **RNF-UI-005.2 - Iconografía:** Uso de iconos claros y reconocibles para mejorar la comprensión visual de las acciones y estados.

## 4. Diseño de la Interfaz de Usuario (Componentes y Flujo)

### 4.1. Componentes de la UI

*   **Encabezado (Header):** Contendrá el logo de la aplicación y el título "Operación Defensa Web: Análisis TLS".
*   **Área de Entrada de Análisis:** Un `textarea` con un `placeholder` como "Ingrese dominios o IPs (uno por línea)" y un botón "Analizar".
*   **Panel de Progreso:** Una sección que muestre el estado actual del análisis, posiblemente con un icono de carga y texto como "Analizando Ingesta...", "Procesando TLS...".
*   **Tarjeta de Resumen de Seguridad:** Un componente visual que muestre el nivel de riesgo general (ej. un círculo con color rojo para "Alto", amarillo para "Medio", verde para "Óptimo").
*   **Tabla de Resultados:** Una tabla con paginación, filtros y ordenamiento para mostrar los hallazgos detallados. Cada fila debe ser expandible para mostrar las recomendaciones.
*   **Botón de Exportación:** Un botón flotante o fijo en la sección de resultados que active un modal para seleccionar el formato de exportación.
*   **Modales/Alertas:** Para mensajes de error, confirmaciones o selección de opciones de exportación.

### 4.2. Flujo de Navegación (Prototipo Conceptual)

1.  **Página de Inicio:** El usuario llega a la página principal con el área de entrada de dominios/IPs.
2.  **Inicio de Análisis:** El usuario ingresa los objetivos y hace clic en "Analizar".
3.  **Visualización de Progreso:** La UI muestra el panel de progreso mientras el backend procesa la solicitud.
4.  **Resultados del Análisis:** Una vez completado, la UI muestra la tarjeta de resumen y la tabla de hallazgos.
5.  **Detalle de Hallazgo:** El usuario puede expandir una fila de la tabla para ver las recomendaciones específicas.
6.  **Exportación de Informe:** El usuario hace clic en "Exportar Informe", selecciona el formato y descarga el archivo.

## 5. Tecnologías Propuestas para la UI

Considerando la necesidad de un desarrollo rápido (MVP en 8 horas) y la flexibilidad, se proponen las siguientes tecnologías:

*   **Framework Frontend:** React.js o Vue.js (para una UI reactiva y basada en componentes).
*   **Librería de Componentes UI:** Tailwind CSS (para estilos rápidos y responsivos) o un framework de componentes como Ant Design, Material-UI (para componentes pre-construidos y accesibles).
*   **Comunicación con Backend:** Fetch API o Axios para realizar llamadas HTTP a la API del backend.
*   **Gestión de Estado:** Context API (React) o Vuex (Vue) para manejar el estado de la aplicación.
*   **Empaquetador de Módulos:** Webpack o Vite (para optimización y construcción del proyecto).

## 6. Casos de Uso de la Interfaz Gráfica

### Caso de Uso 1: Realizar un Análisis TLS de un Dominio

*   **Actor Principal:** Analista de Seguridad.
*   **Precondiciones:** El usuario ha accedido a la aplicación web.
*   **Flujo Normal:**
    1.  El usuario ingresa `ejemplo.com` en el campo de entrada.
    2.  El usuario hace clic en "Iniciar Análisis".
    3.  La UI muestra un indicador de progreso.
    4.  Una vez finalizado, la UI muestra la tarjeta de resumen de seguridad para `ejemplo.com`.
    5.  La tabla de resultados muestra los hallazgos y criticidades para `ejemplo.com`.
    6.  El usuario expande una fila para ver las recomendaciones.
*   **Postcondiciones:** El usuario ha visualizado los resultados del análisis para `ejemplo.com`.

### Caso de Uso 2: Exportar Informe de Análisis

*   **Actor Principal:** Administrador de Sistemas.
*   **Precondiciones:** Se ha completado un análisis y los resultados están visibles en la UI.
*   **Flujo Normal:**
    1.  El usuario hace clic en el botón "Exportar Informe".
    2.  Aparece un modal con opciones de formato (PDF, HTML).
    3.  El usuario selecciona "PDF".
    4.  El sistema genera el informe en PDF y lo ofrece para descarga.
*   **Postcondiciones:** El informe de análisis se ha descargado en el formato seleccionado.

## 7. Referencias

*   [1] Presentación del Reto Risaralda: "2.Presentacion_reto_Risaralda.pdf" (Documento proporcionado por el usuario).
*   [2] WCAG 2.1 Guidelines: [https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/)
