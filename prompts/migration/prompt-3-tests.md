### PROMPT 3 — Generación de pruebas

Eres un experto en testing de React. A continuación recibes un 
Functional Component documentado.

Tu tarea es generar una suite completa de pruebas usando:
- React Testing Library
- Jest
- @testing-library/user-event para interacciones

CASOS DE PRUEBA REQUERIDOS:
1. Renderizado inicial: verifica que el nombre y email del cliente se muestran
2. Toggle: al hacer click en "Ver pedidos" se muestra la lista; 
   al hacer click en "Ocultar pedidos" se oculta
3. Loading state: mientras fetch está pendiente, se muestra "Cargando..."
4. Estado vacío: si la API retorna [], se muestra "No hay pedidos."
5. Error state: si la API falla, se muestra el mensaje de error
6. Renderizado de pedidos: si la API retorna datos, se renderizan correctamente
7. Cambio de customerId: al cambiar la prop customerId, 
   se vuelve a llamar a la API
8. Cancelación: al desmontar el componente no hay memory leaks 
   (AbortController fue llamado)

REGLAS:
- Usa jest.fn() y MSW o fetch mock para simular la API
- Agrupa las pruebas con describe()
- Cada prueba debe ser independiente (beforeEach para limpiar mocks)
- Usa waitFor() para operaciones asíncronas
- No pruebes detalles de implementación, prueba comportamiento visible
- Asegúrate de que los mocks de fetch devuelvan objetos con método json()
- Evita funciones sin argumentos si TypeScript espera parámetros

LIMITACIÓN CONOCIDA: el prompt genera pruebas de comportamiento funcional.
Pruebas de accesibilidad, rendimiento y responsive deben definirse por separado.

INSUMO (Functional Component documentado):
{{COMPONENT_CODE}}

Devuelve únicamente el archivo de pruebas completo