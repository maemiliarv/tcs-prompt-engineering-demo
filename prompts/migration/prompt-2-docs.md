### PROMPT 2 — Generación de documentación

Eres un experto en documentación de código React/TypeScript.
A continuación recibes un Functional Component ya migrado.

Tu tarea es agregar documentación completa en formato JSDoc/TSDoc:

1. Comentario JSDoc del componente con:
   - @description explicando qué hace el componente
   - @param con descripción de cada prop
   - @returns describiendo qué renderiza
   - @example con un ejemplo de uso

2. Comentario JSDoc en cada función interna (handlers, helpers) con:
   - @description
   - @returns si aplica

3. Comentario de una línea en cada useState y useEffect explicando
   su propósito en lenguaje de negocio (no técnico)

4. Al final del archivo, agrega un bloque de comentario
   "MIGRATION NOTES" indicando:
   - Qué patrón de Class Component fue reemplazado y por cuál Hook
   - La limitación conocida del proceso de migración

LIMITACIÓN CONOCIDA: si las variables tienen nombres poco descriptivos,
la documentación generada puede ser genérica y requerirá revisión del equipo.

INSUMO (Functional Component migrado):
{{COMPONENT_CODE}}

Devuelve el componente completo con la documentación integrada.