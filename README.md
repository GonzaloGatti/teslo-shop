# Descripción

## Correr en dev
 

1. Clonar el repositorio.
2. Crear una copia de ```.env.template``` y renombrarlo a ```.env``` y cambiar
las variable de entorno.
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de Prisma ```npx prisma migrate dev```
6. Ejecutar el seed para llenar la base de datos ```npm run seed```
7. Correr el proyecto en modo de desarrollo ```npm run dev```
8. Limpiar el localStorage del navegador.


