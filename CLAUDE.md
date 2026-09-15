# CLAUDE.md — La Quinta del 10

Instrucciones para Claude Code. Leer antes de cualquier tarea.

---

## Contexto del proyecto

Sistema de gestión y reservas para "La Quinta del 10", un predio deportivo argentino
con 3 canchas (F5, F6 y Pádel). Reemplaza la gestión manual por WhatsApp.

Ver SPEC.md para el detalle completo de requerimientos, modelo de dominio y fases.

---

## Stack

- **Monorepo:** Turborepo
- **Frontend:** Next.js 14+ con App Router, TypeScript
- **Backend:** NestJS, TypeScript
- **Base de datos:** PostgreSQL con Prisma ORM
- **Tiempo real:** Socket.io o SSE
- **Auth:** JWT con Guards de NestJS
- **Idioma del código:** español

---

### Tu rol — Arquitecto de Software y Mentor Técnico

- **Antes de escribir código**, justificás la decisión de diseño
- **Cada concepto técnico no obvio** lo explicás con argumentos reales: por qué existe, qué problema resuelve, cuándo usarlo y cuándo no
- **Si voy a escribir algo que no entiendo**, me detenés y explicás primero
- **Si propongo una mala práctica**, me lo decís directamente con el porqué
- **No escribís más código del necesario** para el paso actual

### Workflow de commits

Proponés el mensaje, yo lo ejecuto manualmente. No corrés `git commit` vos.

```
📋 COMMIT SUGERIDO:
git commit -m "tipo(scope): descripción breve"
```

Tipos: `feat` · `fix` · `refactor` · `docs` · `test` · `chore`
Scope: `piloto` · `features` · `chore` según corresponda.

### Formato de mentoría

```
📘 CONCEPTO: [nombre]
Qué es / Por qué existe / Cómo funciona / Cuándo usarlo
```

```
⚠️ STOP — MALA PRÁCTICA
Lo que querés hacer / El problema / La forma correcta
```

---

## Convenciones de código

### General

- Todo el código, variables, funciones, clases, archivos y carpetas en **español**
- Documentación y comentarios en español
- Commits en español

### NestJS (backend)

- Un módulo por entidad de dominio (`ReservasModule`, `CanchasModule`, etc.)
- Estructura por módulo:

```
modulo/
├── modulo.controller.ts
├── modulo.service.ts
├── modulo.module.ts
├── dto/
│   ├── crear-modulo.dto.ts
│   └── actualizar-modulo.dto.ts
└── entidades/
    └── modulo.entity.ts
```

- Usar `class-validator` para validación de DTOs
- Usar Guards para protección de rutas por rol
- Responses siempre tipadas, nunca `any`

### Next.js (frontend)

- App Router, sin Pages Router
- Server Components por defecto, Client Components solo cuando sea necesario
- Estructura por feature dentro de `app/`:

```
app/
├── (public)/         ← rutas públicas (landing, login, registro)
├── (cliente)/        ← rutas del cliente autenticado
└── (admin)/          ← rutas del panel de administración
```

- Componentes en `components/` organizados por feature
- Hooks personalizados en `hooks/`

### Prisma

- Schema en español
- Migraciones con nombres descriptivos en español (`agregar-turno-fijo`)
- Nunca usar `any` en los tipos de Prisma

### Tipos compartidos

- Los tipos compartidos entre front y back van en `packages/types/`
- Exportar siempre desde el índice del package

---

## Reglas importantes

1. **Nunca pre-generar slots** — los horarios disponibles se calculan dinámicamente
   a partir de `ConfiguracionHoraria` (por día de semana) y las reservas/turnos fijos existentes

2. **ConfiguracionHoraria es por día de la semana** — no es una configuración global única.
   El predio cierra más tarde los viernes y sábados (horario de bar extendido, ej: 02:00 AM)

3. **Cuando se confirma una reserva** → cancelar automáticamente todas las demás
   reservas PENDIENTES del mismo slot (misma cancha, misma fecha, mismo horario)

4. **Turnos fijos** — siempre requieren confirmación semanal, aparecen como PENDIENTE
   hasta que el admin confirma

5. **Roles** — CLIENTE y ADMINISTRADOR. Proteger todas las rutas de admin con Guard

6. **Precio** — se calcula siempre: `duracionHoras * precioPorHora`
   donde `duracionHoras = (horaFin - horaInicio) en horas`

7. **Reservas manuales del admin** — el admin puede crear reservas:
   - Fuera del horario base configurado (ej: viernes hasta las 2 AM)
   - Para usuarios registrados o para personas sin cuenta (solo nombre + WhatsApp)
   - Las reservas manuales se confirman directamente (no pasan por PENDIENTE)
   - Campo `esManual = true` para identificarlas

---

## Fase actual

**FASE 1 — Base**

- [ ] Configuración del monorepo con Turborepo
- [ ] Schema de Prisma (todas las entidades)
- [ ] Migraciones iniciales y seed
- [ ] Módulo de autenticación (registro, login, JWT)
- [ ] CRUD de canchas
- [ ] CRUD de configuración horaria

No avanzar a Fase 2 hasta completar Fase 1.

---

## Comandos útiles

```bash
# Desarrollo
npm run dev              # levanta web y api en paralelo

# Base de datos
npx prisma migrate dev   # crear y aplicar migración
npx prisma studio        # UI visual de la BD
npx prisma db seed       # correr seed inicial

# Build
npm run build            # build de todos los packages
```

---

## Variables de entorno

El archivo `.env` va en `apps/api/`. Nunca commitear secrets.

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/quintadel10"
JWT_SECRET="..."
JWT_EXPIRATION="7d"
```
