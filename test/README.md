# Integration Tests

Esta carpeta contiene las pruebas de integración (e2e) para todos los endpoints de la aplicación.

## Estructura

```
test/
├── auth/                        # Tests de autenticación
│   ├── login.e2e-spec.ts       # POST /auth/login
│   └── register.e2e-spec.ts    # POST /auth/register
├── notifications/               # Tests de notificaciones
│   ├── get-notifications.e2e-spec.ts      # GET /notifications
│   ├── create-notification.e2e-spec.ts    # POST /notifications
│   ├── update-notification.e2e-spec.ts    # PUT /notifications/:id
│   └── delete-notification.e2e-spec.ts    # DELETE /notifications/:id
├── test-helpers.ts             # Utilidades compartidas para tests
├── test-db.config.ts           # Configuración de base de datos de test
├── setup-e2e.ts                # Setup global de Jest
└── jest-e2e.json               # Configuración de Jest para e2e
```

## Configuración Previa

### 1. Crear Base de Datos de Test

```bash
# PostgreSQL
createdb take_home_challenge_test

# O con psql
psql -U postgres -c "CREATE DATABASE take_home_challenge_test;"
```

### 2. Variables de Entorno

El archivo `.env.test` contiene la configuración para tests:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/take_home_challenge_test?schema=public"
JWT_SECRET="test-secret-key-for-integration-tests"
```

Puedes sobrescribir estas variables si es necesario.

### 3. Ejecutar Migraciones

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/take_home_challenge_test?schema=public" npx prisma migrate deploy
```

## Ejecutar Tests

### Todos los tests

```bash
npm run test:e2e
```

### Tests específicos por módulo

```bash
# Solo tests de autenticación
npm run test:e2e -- auth

# Solo tests de notificaciones
npm run test:e2e -- notifications
```

### Test de un endpoint específico

```bash
# Login endpoint
npm run test:e2e -- auth/login.e2e-spec

# Create notification endpoint
npm run test:e2e -- notifications/create-notification.e2e-spec
```

### Con coverage

```bash
npm run test:e2e -- --coverage
```

## Características de los Tests

### ✅ Aislamiento
- Cada test limpia la base de datos antes de ejecutarse
- Los tests son independientes y pueden ejecutarse en cualquier orden

### ✅ Base de Datos Real
- Usan PostgreSQL de test (no mocks)
- Verifican que los datos se guardan correctamente
- Prueban restricciones de base de datos

### ✅ Servicios Externos Mockeados
- Las estrategias de notificación (email, SMS, push) están mockeadas
- No se envían notificaciones reales durante los tests

### ✅ Autenticación
- Tests de endpoints protegidos usan JWT real
- Verifican comportamiento con y sin autenticación
- Prueban autorización (usuarios solo pueden acceder a sus propios recursos)

## Cobertura de Tests

### Auth Module (2 endpoints)
- **POST /auth/login**: 5 test cases
  - Login exitoso
  - Contraseña inválida
  - Usuario no existe
  - Validación de email
  - Campos requeridos

- **POST /auth/register**: 5 test cases
  - Registro exitoso
  - Email duplicado
  - Password hasheado
  - Validación de email
  - Campos requeridos

### Notifications Module (4 endpoints)
- **GET /notifications**: 4 test cases
- **POST /notifications**: 7 test cases
- **PUT /notifications/:id**: 4 test cases
- **DELETE /notifications/:id**: 4 test cases

**Total: 29 test cases** cubriendo todos los endpoints de la aplicación.

## Helpers Disponibles

### `TestHelpers`
- `createTestApp(module)`: Crea aplicación NestJS para testing
- `generateJwtToken(payload)`: Genera JWT token para autenticación
- `createTestUser(data?)`: Crea usuario de prueba en BD
- `createTestNotification(data)`: Crea notificación de prueba en BD
- `cleanDatabase()`: Limpia todas las tablas

### `TestDatabase`
- `getPrismaClient()`: Obtiene instancia de Prisma para tests
- `cleanDatabase()`: Limpia base de datos
- `disconnect()`: Cierra conexión a BD

## Notas Importantes

⚠️ **Nunca ejecutes los tests contra la base de datos de producción**

⚠️ La base de datos de test se limpia completamente antes de cada test

✅ Los tests usan `beforeEach` para garantizar estado limpio

✅ Todos los servicios externos están mockeados para evitar side effects
