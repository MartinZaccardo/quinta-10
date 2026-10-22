# La Quinta del 10 — Sistema de Reservas

![CI](https://github.com/MartinZaccardo/quinta-10/actions/workflows/ci.yml/badge.svg)

Sistema de gestión y reservas para un predio deportivo con canchas de Fútbol 5, Fútbol 6 y Pádel. Reemplaza la coordinación manual por WhatsApp con un sistema web completo.

## Stack

| Capa          | Tecnología                           |
| ------------- | ------------------------------------ |
| Monorepo      | Turborepo                            |
| Frontend      | Next.js 15 · App Router · TypeScript |
| Backend       | NestJS · TypeScript                  |
| Base de datos | PostgreSQL · Prisma ORM              |
| Autenticación | JWT · cookies httpOnly               |
| Estilos       | Tailwind CSS · shadcn/ui             |

## Funcionalidades

### Panel del cliente

- Registro y login con validaciones por campo
- Visualización del calendario de disponibilidad en tiempo real
- Solicitud de reservas con selección de cancha, fecha y horario
- Historial de reservas propias (pendientes, confirmadas, canceladas)

### Panel del administrador

- Dashboard de reservas pendientes con acción rápida de confirmar/rechazar
- Creación de reservas manuales (para usuarios registrados o con solo nombre y WhatsApp)
- Gestión de turnos fijos semanales con excepciones puntuales
- Configuración horaria por día de semana
- Gestión de canchas (activar/desactivar, precios)
- Gestión de usuarios con buscador y paginación

### Lógica de negocio

- Los slots disponibles se calculan **dinámicamente** — nunca se pre-generan
- Al confirmar una reserva, se cancelan automáticamente todas las solicitudes pendientes para el mismo slot
- Los turnos fijos requieren confirmación semanal y soportan excepciones puntuales
- El horario de cierre puede superar la medianoche (ej: viernes hasta las 02:00 AM)

## Estructura del proyecto

```
quinta-10/
├── apps/
│   ├── api/                # NestJS — REST API
│   │   ├── src/
│   │   │   ├── autenticacion/
│   │   │   ├── canchas/
│   │   │   ├── horarios/
│   │   │   ├── reservas/
│   │   │   ├── turnos-fijos/
│   │   │   └── usuarios/
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   └── web/                # Next.js — Frontend
│       └── app/
│           ├── (public)/   # Landing, login, registro
│           ├── (cliente)/  # Panel del cliente autenticado
│           └── admin/      # Panel de administración
└── packages/
    └── types/              # Tipos compartidos entre apps
```

## Levantar el proyecto localmente

### Requisitos

- Node.js 20+
- Docker (para la base de datos)

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/MartinZaccardo/quinta-10.git
cd quinta-10
npm install
```

### 2. Configurar variables de entorno

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Completar DATABASE_URL, JWT_SECRET, etc.

# Frontend
cp apps/web/.env.local.example apps/web/.env.local
# Completar NEXT_PUBLIC_WHATSAPP_NUMBER con el número del negocio
```

### 3. Levantar la base de datos

```bash
docker-compose up -d
```

### 4. Inicializar la base de datos

```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

El seed crea las canchas, la configuración horaria y un usuario administrador.

### 5. Iniciar el servidor de desarrollo

```bash
# Desde la raíz — levanta frontend y backend en paralelo
npm run dev
```

| Servicio | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:3000     |
| API      | http://localhost:3001/api |

## Tests

Los tests unitarios cubren la lógica de dominio del backend (sin necesidad de base de datos):

```bash
cd apps/api
npm test           # correr una vez
npm run test:watch # modo watch durante desarrollo
npm run test:cov   # con reporte de cobertura
```

Cobertura actual: utilidades de tiempo (`parsearFechaUTC`, `fechaADiaSemana`, `superposicion`), cálculo dinámico de slots (`generarBloques`), confirmación con cancelación automática de pendientes, validaciones de solicitud y permisos de cancelación.

## Variables de entorno

### `apps/api/.env`

| Variable         | Descripción                        |
| ---------------- | ---------------------------------- |
| `DATABASE_URL`   | Cadena de conexión a PostgreSQL    |
| `JWT_SECRET`     | Secret para firmar los tokens JWT  |
| `JWT_EXPIRATION` | Duración del token (ej: `7d`)      |
| `PORT`           | Puerto de la API (default: `3001`) |
| `FRONTEND_URL`   | URL del frontend para CORS         |

### `apps/web/.env.local`

| Variable                      | Descripción                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`         | URL base de la API                                                 |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp del negocio (solo dígitos, ej: `549XXXXXXXXXX`) |
