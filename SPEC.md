# SPEC.md — La Quinta del 10

Sistema de gestión y reservas para predios deportivos. Automatiza la reserva de canchas,
gestión de turnos fijos y elimina la dependencia del contacto manual por WhatsApp.

---

## Stack tecnológico

| Capa          | Tecnología                           |
| ------------- | ------------------------------------ |
| Monorepo      | Turborepo                            |
| Frontend      | Next.js 15 (App Router) + TypeScript |
| Backend       | NestJS + TypeScript                  |
| Base de datos | PostgreSQL                           |
| ORM           | Prisma                               |
| Tiempo real   | WebSockets (Socket.io) o SSE         |
| Auth          | JWT con NestJS Guards                |
| Mensajería    | WhatsApp Business API (Fase 3)       |
| Pagos         | MercadoPago (Fase 4)                 |
| Contenedores  | Docker (desarrollo local)            |

---

## Estructura del monorepo

```
quinta-del-10/
├── apps/
│   ├── web/              ← Next.js (frontend)
│   └── api/              ← NestJS (backend)
├── packages/
│   └── types/            ← tipos compartidos entre front y back
├── turbo.json
└── package.json
```

---

## Modelo de dominio

### Entidades

#### `Cancha`

```
- id
- nombre          ("Cancha 1", "Cancha 2", "Pádel")
- tipo            (F5, F6, PADEL)
- precioPorHora   (decimal)
- activa          (boolean)
```

#### `ConfiguracionHoraria`

Una configuración por día de la semana. El predio puede cerrar más tarde los
viernes y sábados (horario de bar/buffet extendido).

```
- id
- diaSemana         (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO)
- horaApertura      (ej: "08:00")
- horaCierre        (ej: "23:00", puede ser "02:00" del día siguiente)
- intervaloMinutos  (30, global para todos los días)
```

Los slots disponibles se calculan dinámicamente a partir de esta configuración
y las reservas/turnos fijos existentes. No se pre-generan en la BD.

**Ejemplo de configuración real del predio:**

```
Lunes a Jueves → 08:00 a 23:00
Viernes        → 08:00 a 02:00 (día siguiente)
Sábado         → 08:00 a 02:00 (día siguiente)
Domingo        → 08:00 a 23:00
```

#### `Usuario`

```
- id
- nombre
- apellido
- email             (único, requerido)
- contraseña        (hasheada)
- numeroWhatsApp    (requerido)
- rol               (CLIENTE, ADMINISTRADOR)
- fotoPerfil        (opcional)
- creadoPorAdmin    (boolean) ← indica si fue creado manualmente por el admin
- activo            (boolean)
- creadoEn
```

#### `Reserva`

```
- id
- canchaId
- usuarioId         (opcional si es reserva manual sin usuario registrado)
- nombreContacto    (string, opcional) ← para reservas manuales sin usuario
- telefonoContacto  (string, opcional) ← para reservas manuales sin usuario
- fechaReserva      (date)
- horaInicio        (time)
- horaFin           (time)   ← mínimo 1 hora, escala en bloques de 30 min
- estado            (PENDIENTE, CONFIRMADA, CANCELADA)
- esManual          (boolean) ← true si fue creada por el admin
- mensajeOpcional   (string, opcional)
- requiereSeña      (boolean)
- montoSeña         (decimal, opcional)
- creadoEn
- actualizadoEn
```

#### `TurnoFijo`

```
- id
- canchaId
- usuarioId         ← responsable del equipo
- diaSemana         (LUNES, MARTES, ..., DOMINGO)
- horaInicio        (time)
- horaFin           (time)
- activo            (boolean)
- fechaInicio       (date)   ← desde cuándo es fijo
- creadoEn
```

---

## Reglas de negocio

### Slots y disponibilidad

- Los slots se calculan dinámicamente: no existen en la BD, se derivan de
  `ConfiguracionHoraria` y las reservas/turnos fijos existentes
- Un slot puede tener **N reservas en estado PENDIENTE** simultáneamente
- El admin decide entre las solicitudes pendientes
- Cuando el admin **confirma una reserva** → las demás del mismo slot se cancelan automáticamente
- Un slot aparece como **OCUPADO** solo cuando hay una reserva CONFIRMADA
- Un slot con reservas PENDIENTES aparece como **PENDIENTE** (el usuario puede solicitar igual)
- Los turnos fijos ocupan el slot como **PENDIENTE** hasta confirmación semanal

### Reservas

- Duración mínima: 1 hora
- La duración escala en bloques de 30 minutos (1h, 1:30h, 2h, etc.)
- El precio se calcula automáticamente: `(horaFin - horaInicio) * precioPorHora`
- El admin puede aceptar sin seña, aceptar con seña (50% por defecto, modificable) o rechazar
- Si se acepta con seña, la reserva queda en PENDIENTE hasta que se acredite el pago
- Un usuario puede cancelar su propia reserva

### Turnos fijos

- Todos los turnos fijos requieren confirmación semanal
- El admin puede desactivar un turno fijo permanentemente
- El admin puede cancelar la instancia de un turno fijo para un día específico sin desactivarlo
- Si un fijo cancela, el slot se libera automáticamente

### Usuarios

- Registro público: nombre, apellido, email, contraseña, número de WhatsApp
- Foto de perfil y datos adicionales son opcionales
- El admin puede crear usuarios manualmente para clientes que no se registran solos
- Los usuarios creados por admin pueden no tener email/contraseña si se gestionan por WhatsApp

### Reservas manuales del admin

- El admin puede crear reservas fuera del horario base configurado (ej: viernes hasta las 2 AM)
- El admin puede crear reservas para:
  - Un usuario registrado en el sistema
  - Una persona sin usuario (solo nombre y WhatsApp como contacto)
- Las reservas manuales quedan marcadas con `esManual = true`
- Las reservas manuales del admin se confirman directamente, sin pasar por estado PENDIENTE

---

## Casos de uso

### Cliente

| Prioridad | Caso de uso                                  |
| --------- | -------------------------------------------- |
| Alta      | Ver landing page del predio                  |
| Alta      | Ver disponibilidad de canchas en tiempo real |
| Alta      | Registrarse                                  |
| Alta      | Iniciar sesión                               |
| Alta      | Solicitar reserva                            |
| Alta      | Ver estado de su reserva                     |
| Alta      | Cancelar su reserva                          |
| Media     | Ver historial de reservas                    |
| Media     | Editar perfil                                |
| Media     | Recibir notificación de cambio de estado     |

### Administrador

| Prioridad | Caso de uso                                         |
| --------- | --------------------------------------------------- |
| Alta      | Ver panel del día (reservas por cancha)             |
| Alta      | Ver reservas nuevas/pendientes                      |
| Alta      | Aceptar reserva (con o sin seña)                    |
| Alta      | Rechazar reserva                                    |
| Alta      | Crear reserva manual (con o sin usuario registrado) |
| Alta      | Crear usuario manualmente                           |
| Alta      | Gestionar turnos fijos (crear, desactivar)          |
| Alta      | Configurar horarios por día de la semana            |
| Media     | Enviar mensaje de confirmación a fijos              |
| Media     | Cancelar instancia puntual de un fijo               |
| Media     | Contacto rápido por WhatsApp con cliente            |

---

## Roadmap

### ✅ Base (completa)

- Monorepo Turborepo + Docker/PostgreSQL
- Schema Prisma completo (6 entidades + enums)
- Migraciones y seed inicial (3 canchas, 7 configuraciones horarias, usuario admin)
- Autenticación: registro, login, JWT, guards de rol
- CRUD Canchas
- CRUD Configuración horaria (por día de semana)

### ✅ MVP — Backend (completo)

#### `UsuariosModule`

- Listar usuarios (admin)
- Obtener usuario por id (admin)
- Crear usuario desde admin (con o sin email/contraseña, para clientes que no se registran solos)
- Activar / desactivar usuario

#### `ReservasModule`

- Calcular slots disponibles dinámicamente (por cancha y fecha)
- Solicitar reserva (cliente)
- Crear reserva manual (admin — confirma directamente, puede ir fuera del horario base)
- Confirmar reserva (admin) → cancela automáticamente las demás PENDIENTES del mismo slot
- Rechazar / cancelar reserva (admin o cliente sobre la propia)
- Listar reservas (admin: todas; cliente: las propias)

#### `TurnosFijosModule`

- Crear turno fijo (admin)
- Desactivar turno fijo permanentemente
- Registrar excepción puntual (cancelar un día específico sin desactivar el fijo)
- Listar turnos fijos activos (admin)

### ✅ MVP — Frontend (completo)

- Next.js 15 con App Router, estructura de rutas `(public)`, `(cliente)`, `(admin)`
- Landing page pública del predio
- Auth: login y registro con validaciones por campo
- Panel admin: disponibilidad por día/cancha, lista de pendientes, reserva manual, turnos fijos, configuración horaria, gestión de usuarios
- Vista cliente: ver disponibilidad, solicitar reserva, mis reservas

### ✅ Calidad (completo)

- Tests unitarios (Jest) para lógica de dominio: cálculo de slots, gestión de reservas, utilidades de tiempo
- CI con GitHub Actions: typecheck + tests en cada push a `main`

### Post-MVP

- Notificaciones push / email al cambiar estado de una reserva
- Pago de seña con MercadoPago
- WhatsApp Business API (mensajes automáticos de confirmación a fijos)
- Exportación a Google Sheets

---

## Integraciones futuras

| Integración           | Descripción                                           |
| --------------------- | ----------------------------------------------------- |
| WhatsApp Business API | Mensajes automáticos a clientes fijos, confirmaciones |
| MercadoPago           | Pago de seña desde la app                             |
| Google Sheets         | Exportar vista diaria al Excel que ya usa el predio   |

---

## Notas de diseño

- La app es **mobile-first**: se gestiona mayormente desde el celular
- Al inicio se puede mostrar el número de WhatsApp del encargado como contacto alternativo
- El sistema debe ser simple para usuarios mayores o con poca experiencia tecnológica
- Los clientes fijos pueden ser creados y gestionados íntegramente por el admin
  sin que el cliente necesite registrarse
