# Producto: análisis y operación asistida de inversiones

Esta carpeta contiene el contrato inicial del producto. Describe qué problema queremos resolver, qué puede esperar el usuario y cómo debe comportarse la aplicación antes de elegir todos los proveedores o construir automatizaciones avanzadas.

La plataforma busca ayudar a una persona a recopilar información financiera, aplicar análisis verificables, crear planes y, en fases posteriores, ejecutar acciones autorizadas mediante APIs externas. No se concibe como un chat que improvisa operaciones ni como un conjunto de bots independientes. Es una aplicación con herramientas internas, datos estructurados, permisos y capacidades de IA especializadas.

## Ruta de lectura

1. [Visión y pilares](./01-vision-y-pilares.md): propósito, vocabulario y principios del producto.
2. [Usuarios y propuesta de valor](./02-usuarios-y-propuesta-de-valor.md): a quién ayuda inicialmente y qué hipótesis deben validarse.
3. [Dominio y capacidades](./03-dominio-y-capacidades.md): objetos principales y acciones que la aplicación debe representar.
4. [Requisitos y recorridos](./04-requisitos-y-recorridos.md): comportamientos observables y flujos de usuario.
5. [IA, herramientas y evidencia](./05-ia-herramientas-y-evidencia.md): separación de responsabilidades entre capacidades de IA y reglas para ejecutar herramientas.
6. [Arquitectura y datos](./06-arquitectura-y-datos.md): límites de los componentes, persistencia prevista e integraciones.
7. [Fases, límites y decisiones](./07-fases-limites-y-decisiones.md): orden de construcción, funciones aplazadas y preguntas pendientes.

## Cómo mantener estos documentos

- Cada requisito tiene un identificador para citarlo en tareas, diseños y pruebas.
- `Primera entrega` representa el menor recorrido que aporta valor real; no intenta demostrar toda la visión.
- Las operaciones simuladas y las operaciones con dinero real se documentan como capacidades distintas.
- Una salida de IA no se trata como evidencia financiera hasta que indique sus fuentes, datos, cálculo y límites.
- Una decisión pendiente permanece como pregunta. No se convierte accidentalmente en dependencia permanente.
- Si una nueva función cambia lo que el usuario puede autorizar o lo que el sistema puede ejecutar, primero se actualizan estos documentos.

