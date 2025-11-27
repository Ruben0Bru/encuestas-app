# PPEAI - Plataforma de Encuestas Académicas Interactivas 🎓

Una plataforma open-source construida con **Next.js 15** y **Supabase** que permite a docentes realizar evaluaciones gamificadas en tiempo real, similar a Kahoot!, pero con herramientas de analítica avanzada gratuitas.

## 🚀 Características Principales

### 👨‍🏫 Para Docentes
* **Gestión de Cursos:** Crea cursos, genera códigos de acceso únicos y gestiona inscripciones.
* **Organización por Temas:** Estructura tus encuestas en módulos o unidades.
* **Editor de Encuestas:** Constructor dinámico de preguntas (opciones múltiples, verdadero/falso).
* **Modo "En Vivo":** Generación de PIN aleatorio para acceso rápido en clase.
* **Analítica Avanzada:** Dashboards con promedios del curso, detección de "Puntos Débiles" y Ranking de estudiantes.

### 👨‍🎓 Para Estudiantes
* **Acceso Dual:** Entra vía PIN (invitado) o inscríbete en cursos (recurrente).
* **Bandeja de Entrada:** Notificación visual inmediata cuando hay una encuesta activa en tus cursos.
* **Gamificación:** Feedback inmediato, confeti al aprobar y niveles de dominio (Nulo -> Dominado).
* **Historial:** Registro detallado de todos los intentos y notas.

## 🛠️ Stack Tecnológico

* **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Lucide Icons.
* **Backend & DB:** Supabase (PostgreSQL, Auth, RLS).
* **UX/UI:** Sonner (Toasts), Glassmorphism UI, clsx.

## 📦 Instalación

1.  Clonar el repositorio.
2.  Instalar dependencias: `npm install`
3.  Configurar variables de entorno en `.env.local`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
    ```
4.  Correr en desarrollo: `npm run dev`

---
v1.0.0