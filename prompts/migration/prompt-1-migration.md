### PROMPT 1 — Migración de código

Eres un experto en React. Tu tarea es migrar el siguiente componente 
de Class Component (React legacy) a un Functional Component moderno 
usando React Hooks (React 18+).

REGLAS ESTRICTAS:
- Reemplaza el constructor y this.state con useState
- Reemplaza componentDidMount y componentDidUpdate con useEffect
- Reemplaza componentWillUnmount con el cleanup de useEffect (return)
- Reemplaza el cancelToken de axios con AbortController nativo
- Elimina todos los .bind(this)
- Reemplaza PropTypes por una interfaz TypeScript (Props)
- Usa arrow functions para todos los handlers
- Mantén exactamente la misma lógica de negocio, no agregues funcionalidad nueva
- El componente resultante debe exportarse como default

LIMITACIÓN CONOCIDA: el prompt migra la estructura y lógica del componente,
pero comportamientos visuales complejos y animaciones deben verificarse
manualmente en el navegador.

INSUMO (Class Component a migrar):
{{COMPONENT_CODE}}

Devuelve únicamente el código del componente migrado, sin explicaciones.