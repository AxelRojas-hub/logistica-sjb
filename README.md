# Logistica SJB - Grupo 8

## Como ejecutar el proyecto
1. Clonar el repositorio
2. Ejecutar `pnpm install` para instalar las dependencias
3. Crear el archivo .env.local en la raiz del proyecto con las variables de entorno necesarias
4. Ejecutar `pnpm dev` para iniciar el servidor de desarrollo

## Estructura del proyecto

- `app/`: Contiene las rutas y componentes principales de la aplicación.
- `lib/`: Contiene utilidades y funciones compartidas.
- `lib/models/`: Contiene las entidades utilizadas en el sistema.
- `lib/types/`: Contiene los tipos utilizados en el sistema.
- `db-schema.md`: Contiene el esquema de la base de datos.
- `TODO.md`: Lista de tareas pendientes y en progreso.

### IMPORTANTE
- Este proyecto utiliza `pnpm` como gestor de paquetes. Si usas npm, instala pnpm globalmente con `npm install -g pnpm`.
- Asegurate de tener configuradas las variables de entorno necesarias en el archivo `.env.local`.
- Evitar modificar el archivo de tipos ya que cada tipo mapea una entidad de la base de datos.
- Antes de empezar a trabajar en una nueva funcionalidad, revisa el archivo `TODO.md` para ver si alguien ya esta trabajando en eso.
- Antes de commitear, ejecuta `pnpm build` para comprobar que no haya errores de compilación.
- Revisa que estés trabajando en tu rama antes de hacer commits, no trabajar directamente en main.