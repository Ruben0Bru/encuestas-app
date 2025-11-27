import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Users, Layers, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CreateTopicForm from './CreateTopicForm'
import TopicCard from './TopicCard' // <--- IMPORTAMOS

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { courseId } = await params
  const supabase = await createClient()

  // 1. Obtener datos del curso
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()

  if (!course) notFound()

  // 2. Obtener TEMAS con ENCUESTAS (Actualizado)
  const { data: topics } = await supabase
    .from('topics')
    .select(`
      *,
      surveys (
        id,
        title,
        is_active
      )
    `)
    .eq('course_id', courseId)
    .order('created_at', { ascending: true })

  // 3. Obtener conteo de estudiantes
  const { count: studentsCount } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado */}
      <div>
        <Link 
          href="/dashboard/teacher" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#2E9FFB] mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Volver a mis cursos
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{course.name}</h1>
            <p className="text-slate-500 mt-3 flex items-center gap-3 text-lg">
              Código de acceso: 
              <span className="font-mono font-bold text-[#2E9FFB] bg-[#2E9FFB]/10 px-3 py-1 rounded-lg select-all ring-1 ring-inset ring-[#2E9FFB]/20">
                {course.access_code}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: TEMAS (Ocupa 2 espacios) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FBE02E]/10 text-[#FBE02E]">
                    <Layers className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Temas del Curso</h2>
              </div>
            </div>

            {/* Formulario para agregar tema */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Crear nuevo tema</label>
              <CreateTopicForm courseId={courseId} />
            </div>
            
            {/* Lista de Temas con TopicCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!topics || topics.length === 0 ? (
                <div className="col-span-full text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 italic">
                    No hay temas creados aún. ¡Agrega uno arriba para comenzar!
                    </p>
                </div>
              ) : (
                topics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: ESTUDIANTES (Ocupa 1 espacio) */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FB2E80]/10 text-[#FB2E80]">
                    <Users className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Estudiantes</h2>
              </div>
              <span className="text-sm font-bold bg-[#FB2E80]/10 text-[#FB2E80] px-3 py-1 rounded-full ring-1 ring-inset ring-[#FB2E80]/20">
                {studentsCount}
              </span>
            </div>

            <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-500 font-medium mb-4">
                Comparte este código con tus estudiantes
              </p>
              <div className="inline-block relative group cursor-pointer">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#FBE02E] to-[#FB2E80] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                  <span className="relative block font-mono font-bold text-slate-900 text-4xl tracking-widest bg-white px-6 py-3 rounded-lg ring-1 ring-slate-200">
                    {course.access_code}
                  </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}