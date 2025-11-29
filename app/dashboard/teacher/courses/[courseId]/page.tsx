import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Users, Layers, ArrowLeft, BarChart3, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import CreateTopicForm from './CreateTopicForm'
import TopicCard from './TopicCard'

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { courseId } = await params
  const supabase = await createClient()

  // 1. Datos del Curso
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()

  if (!course) notFound()

  // 2. Temas
  const { data: topics } = await supabase
    .from('topics')
    .select(`*, surveys (id, title, is_active)`)
    .eq('course_id', courseId)
    .order('created_at', { ascending: true })

  // 3. ESTUDIANTES (CORRECCIÓN: Consultas separadas para asegurar datos)
  
  // A. Traemos solo las inscripciones (Ids)
  const { data: rawEnrollments } = await supabase
    .from('enrollments')
    .select('*')
    .eq('course_id', courseId)
    .order('joined_at', { ascending: false })

  const enrollmentsList = rawEnrollments || []
  let studentsList: any[] = []

  // B. Si hay inscritos, buscamos sus perfiles manualmente
  if (enrollmentsList.length > 0) {
    const studentIds = enrollmentsList.map(e => e.student_id)
    
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', studentIds)

    // C. Unimos los datos nosotros mismos (Merge)
    studentsList = enrollmentsList.map(enrollment => {
      const profile = profiles?.find(p => p.id === enrollment.student_id)
      return {
        ...enrollment,
        profileData: profile // Guardamos el perfil aquí
      }
    })
  }

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
          
          <Link 
            href={`/dashboard/teacher/courses/${courseId}/stats`}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20"
          >
            <BarChart3 className="h-5 w-5" />
            Analítica del Curso
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: TEMAS */}
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

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Crear nuevo tema</label>
              <CreateTopicForm courseId={courseId} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!topics || topics.length === 0 ? (
                <div className="col-span-full text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 italic">No hay temas creados aún.</p>
                </div>
              ) : (
                topics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: LISTA DE ESTUDIANTES */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FB2E80]/10 text-[#FB2E80]">
                    <Users className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Estudiantes</h2>
              </div>
              <span className="text-sm font-bold bg-[#FB2E80]/10 text-[#FB2E80] px-3 py-1 rounded-full ring-1 ring-inset ring-[#FB2E80]/20">
                {enrollmentsList.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-2">
                {studentsList.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-sm text-slate-400">Nadie se ha unido aún.</p>
                        <p className="text-xs text-slate-300 mt-2">Comparte el código {course.access_code}</p>
                    </div>
                ) : (
                    studentsList.map((item: any) => {
                        // Extraemos datos seguros
                        const name = item.profileData?.full_name || 'Usuario sin nombre'
                        const email = item.profileData?.email || '...'
                        const initial = name.charAt(0).toUpperCase()
                        const studentId = item.student_id

                        return (
                            <Link 
                                key={item.id}
                                href={`/dashboard/teacher/courses/${courseId}/students/${studentId}`}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 uppercase flex-shrink-0">
                                        {initial}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-700 truncate group-hover:text-[#2E9FFB] transition-colors">
                                            {name}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {email}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#2E9FFB]" />
                            </Link>
                        )
                    })
                )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}