# Documentación

Esta carpeta define el producto antes de convertir sus ideas en módulos, endpoints, agentes o integraciones. Su objetivo es evitar que la API crezca como una colección de funciones desconectadas y conservar una dirección común mientras construimos por incrementos.

## Producto

[Plataforma de análisis y operación asistida de inversiones](./product/README.md)

La documentación describe la visión, los usuarios, el dominio, los recorridos principales, el papel de las distintas capacidades de IA, los límites de acción y una secuencia realista de construcción.

## Estructura actual

```text
docs/
├── README.md
└── product/
    ├── README.md
    ├── 01-vision-y-pilares.md
    ├── 02-usuarios-y-propuesta-de-valor.md
    ├── 03-dominio-y-capacidades.md
    ├── 04-requisitos-y-recorridos.md
    ├── 05-ia-herramientas-y-evidencia.md
    ├── 06-arquitectura-y-datos.md
    └── 07-fases-limites-y-decisiones.md
```

Los documentos expresan decisiones de producto y contratos conceptuales. No sustituyen el diseño técnico detallado de cada incremento. Una integración futura no debe implementarse solo porque aparezca aquí: primero debe existir una necesidad observable, un alcance pequeño y una forma de verificarla.

**Sí, tu idea tiene sentido como herramienta personal y podría convertirse en un servicio. Pero la versión que describes necesita un enfoque más concreto para competir.** Construirla es viable; conseguir una estrategia rentable y conseguir clientes son dos problemas adicionales que la IA, por sí sola, no resuelve.

Leí tu documento y revisé productos, integraciones y fuentes regulatorias de EE. UU. disponibles en septiembre de 2026. Para este análisis tomo acciones y ETF como punto de partida; si prefieres criptomonedas, habría que ajustar varias decisiones.

Tu documento mezcla cuatro proyectos:

- Una herramienta para investigar inversiones con IA.
- Un sistema para crear y probar estrategias.
- Un bot que opera automáticamente.
- Una plataforma que presta esos servicios a otras personas.

**Mi recomendación sería empezar por investigación, simulación y supervisión de tus propias reglas**, e incorporar ejecución real después de comprobar que el sistema funciona.

El panorama competitivo ya está bastante desarrollado:

| Producto | Qué ofrece actualmente | Qué implica para tu idea |
|---|---|---|
| **[Composer](https://help.composer.trade/article/254-what-is-trade-with-ai)** | Creación de estrategias con IA, pruebas históricas y ejecución de reglas aprobadas por el usuario. | Es uno de tus competidores más directos. |
| **[Capitalise.ai](https://support.capitalise.ai/en/articles/2164262-about-capitalise-ai)** | Convierte instrucciones en lenguaje natural en estrategias; permite probarlas, simularlas y ejecutarlas. | “Explica tu estrategia y el bot la ejecuta” ya existe. |
| **[TrendSpider](https://trendspider.com/pricing/)** | Análisis, asistente de IA, pruebas de estrategias, alertas y automatización. | Competir por cantidad de funciones sería difícil. |
| **[QuantConnect](https://www.quantconnect.com/docs/v2/cloud-platform/welcome)** | Infraestructura para investigación, pruebas y operación algorítmica. | Los usuarios técnicos ya disponen de herramientas potentes. |
| **[TradeZella](https://www.tradezella.com/)** | Registro de operaciones, análisis del comportamiento y revisión con IA. | También existe competencia en seguimiento y aprendizaje. |

Además, Composer anuncia un plan gratuito que automatiza una estrategia y otro de **10 dólares mensuales** que permite hasta cinco. Eso pone presión sobre una aplicación genérica que simplemente añada un chat a un bot. [Precios oficiales](https://www.composer.trade/pricing).

Mi lectura de estos productos es que **hay una categoría comercial establecida, pero “trading con IA” ya no basta como diferenciación**. La existencia de competidores tampoco demuestra que tu público concreto vaya a pagar: eso hay que validarlo.

La oportunidad que veo en tu documento está especialmente en el **supervisor de estrategias**. Lo convertiría en una herramienta que permita responder con claridad:

> “¿Mi sistema está haciendo lo que yo autoricé, qué riesgo estoy asumiendo y qué cambió desde que probé la estrategia?”

Por ejemplo:

- Detectar que una estrategia está operando más de lo previsto.
- Mostrar que varias estrategias están concentradas en los mismos activos.
- Comparar los resultados simulados con las operaciones reales.
- Avisar de datos atrasados, órdenes rechazadas o posiciones inesperadas.
- Explicar cada operación con la regla y los datos que la provocaron.
- Pausar la automatización cuando se incumplen límites definidos.

Aquí hay dos públicos distintos que podrías explorar:

| Público | Problema que podrías resolver | Dificultad comercial |
|---|---|---|
| Personas que quieren invertir siguiendo reglas sencillas | Entender, probar y supervisar esas reglas sin programar. | Mucha competencia y sensibilidad al precio. |
| Desarrolladores que ya tienen bots | Supervisión, conciliación, historial y controles de riesgo. | Público más reducido, pero con necesidades técnicas concretas. |

**Por tu planteamiento técnico, investigaría primero el segundo.** Es una hipótesis comercial, no un hueco confirmado. Una interfaz bilingüe podría ayudarte a llegar a determinados usuarios, pero traducir la aplicación al español sería fácil de imitar.

También corregiría varias cosas de tus notas antes de construir.

**Massive está mal clasificado en el documento.** El servicio de `massive.com` proporciona datos de mercado; no corresponde agruparlo con Moonfare como acceso a fondos de private equity. Puede alimentar tu aplicación con precios y otros datos, pero necesitarías otra integración para ejecutar operaciones. [Documentación de Massive](https://massive.com/docs).

La parte de private equity, PitchBook, Preqin y empresas privadas la dejaría fuera de esta primera versión. Añade otro público, otros datos y otro tipo de producto a un proyecto que ya es amplio.

Tampoco empezaría entrenando modelos. **Tu primera dificultad será la calidad de los datos, la validez de las pruebas y la fiabilidad de la ejecución.** Mi propuesta técnica sería:

- Una base de datos normal para operaciones, posiciones, precios y resultados.
- Cálculos financieros hechos mediante código comprobable.
- Un modelo de lenguaje para consultar, explicar y redactar informes.
- Búsqueda documental —RAG— cuando necesites recuperar noticias, informes o documentación.
- Un motor de reglas independiente que aplique los límites y autorice las órdenes.

LoRA no sería necesario para el prototipo. Tampoco trataría los pesos de un modelo como una fuente exacta de conocimiento financiero. Y un segundo agente de IA no sustituye los controles programados: los límites de exposición, permisos y parada deben seguir funcionando aunque el modelo se equivoque.

**Estar en EE. UU. cambia especialmente el paso de uso personal a servicio comercial.** Automatizar tu propia cuenta y ofrecer decisiones de inversión a clientes requieren análisis diferentes.

| Qué haría tu servicio | Qué habría que revisar |
|---|---|
| Mostrar datos, registrar operaciones y aplicar reglas de visualización del usuario | Licencias de datos, privacidad, seguridad y condiciones del proveedor. |
| Recomendar compras o ventas según la situación del cliente | Posible actividad de asesor de inversiones. |
| Decidir y operar discrecionalmente por el cliente | Requisitos de asesoramiento y gestión automatizada. |
| Intermediar operaciones o cobrar según transacciones | Posibles requisitos de broker-dealer, según las actividades concretas. |

La definición de asesor de inversiones puede incluir prestar asesoramiento sobre valores como negocio y a cambio de compensación. Los asesores automatizados pueden estar sujetos a registro ante la SEC o autoridades estatales. **No custodiar el dinero, cobrar una suscripción o añadir “esto no es asesoramiento financiero” no determina por sí solo que estés fuera de esas obligaciones.** [Investor.gov](https://www.investor.gov/introduction-investing/investing-basics/glossary/investment-adviser), [SEC sobre robo-advisers](https://www.sec.gov/newsroom/press-releases/2017-52), [SEC sobre intermediación](https://www.sec.gov/about/divisions-offices/division-trading-markets/division-trading-markets-compliance-guides/guide-broker-dealer-registration).

Por eso, antes de ofrecer recomendaciones personalizadas o ejecución a terceros, encargaría una revisión jurídica del flujo concreto del producto. No necesitas resolver ahora todas las posibilidades futuras; sí definir qué hará exactamente la primera versión comercial.

Para el prototipo personal, **Alpaca es una opción razonable para evaluar**: dispone de simulación y APIs, y ofrece conexiones OAuth para aplicaciones de terceros. Eso no implica que cualquier servicio comercial quede aprobado automáticamente. [Simulación de Alpaca](https://docs.alpaca.markets/us/docs/paper-trading), [Connect API](https://docs.alpaca.markets/us/docs/about-connect-api).

Interactive Brokers también merece consideración, pero su integración comercial con terceros contempla aprobación de cumplimiento y acuerdos específicos. [Documentación de IBKR](https://www.interactivebrokers.com/campus/ibkr-api-page/webapi-doc/).

Tu código de Binance necesitaría revisarse para el contexto estadounidense. No asumiría que puedes trasladarlo directamente: Binance.US tiene disponibilidad por estado y actualmente enumera Nueva York y Texas entre los no admitidos. [Disponibilidad oficial](https://support.binance.us/en/articles/9842798-list-of-supported-and-unsupported-states-and-regions).

**Los datos pueden pesar más que la IA en los costes comerciales.** Massive anuncia su plan Stocks Business a **2.499 dólares al mes**, con ampliaciones de datos que pueden costar aparte. No significa que tu aplicación necesite ese plan: significa que debes comprobar los derechos y costes del uso comercial antes de elegir proveedor. Una suscripción personal no debe darse por válida para mostrar datos a clientes. [Precios](https://massive.com/business), [condiciones comerciales](https://massive.com/legal/businesses-terms-of-service).

Como ejemplo puramente económico: con una suscripción de 25 dólares y 100 clientes ingresarías 2.500 dólares mensuales. Un proveedor de datos de ese coste consumiría prácticamente todo, antes de infraestructura, soporte, pagos y adquisición de clientes.

Yo probaría una cuota fija por software como hipótesis inicial. La disposición a pagar debería medirse con un producto pequeño que resuelva una tarea frecuente; no la deduciría de lo que otras aplicaciones cobran.

Para avanzar, haría una validación de unas **8–12 semanas como estimación de trabajo**, con este alcance:

1. **Comparar alternativas.** Probar dos competidores y documentar qué necesidad tuya sigue sin resolverse.
2. **Construir una versión personal.** Un broker, acciones/ETF, una o dos estrategias, registro de decisiones y simulación.
3. **Comprobar la fiabilidad.** Datos atrasados, desconexiones, órdenes parciales, duplicados y diferencias de balances.
4. **Evaluar las estrategias.** Separar los datos usados para diseñarlas de los usados para evaluarlas; incluir costes y comparar con una referencia adecuada.
5. **Entrevistar a 10–15 usuarios del mismo perfil.** Enseñarles el producto y averiguar qué usan hoy, qué les falla y si pagarían por resolverlo.
6. **Probar una beta comercial acotada.** Después de aclarar licencias de datos y el encaje jurídico de sus funciones.

La simulación sirve para comprobar comportamiento, pero **unas semanas de beneficios simulados no demuestran una ventaja rentable**. Alpaca señala que su simulador omite factores como impacto de mercado y deslizamiento por latencia. [Limitaciones del entorno de pruebas](https://docs.alpaca.markets/us/docs/paper-trading).

**Yo sí construiría una primera versión para ti**, siempre que te aporte utilidad aunque nunca se venda. Concentraría el esfuerzo en supervisar y explicar estrategias con reglas verificables. El paso a negocio lo condicionaría a tres pruebas: que resuelva una necesidad que las alternativas no cubren bien, que varios usuarios quieran pagar por ella y que el coste de prestar ese servicio deje margen.