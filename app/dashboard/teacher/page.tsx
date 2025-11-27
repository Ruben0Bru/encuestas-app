import { createClient } from '@/utils/supabase/server'
import { Users, ArrowRight, BookDashed } from 'lucide-react'
import Link from 'next/link'
import CreateCourseForm from './CreateCourseForm'
import DeleteCourseButton from './DeleteCourseButton' // <--- IMPORTAR

export default async function TeacherDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null 

  const { data: courses } = await supabase
    .from('courses')
    .select('*, enrollments(count)')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Mis Cursos</h1>
          <p className="text-lg text-slate-600 mt-2">Administra tus cursos y encuestas desde aquí</p>
        </div>
        
        <CreateCourseForm />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!courses || courses.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center hover:bg-slate-50 transition-colors">
            <div className="h-16 w-16 rounded-full bg-yellow-400/10 flex items-center justify-center mb-6">
              <BookDashed className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No tienes cursos creados</h3>
            <p className="text-slate-500 mt-2 max-w-sm">
              Comienza creando tu primer curso usando el formulario de arriba.
            </p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20 hover:border-yellow-400/50 hover:-translate-y-1">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400 ring-1 ring-inset ring-yellow-400/20">
                    CÓDIGO: <span className="font-mono ml-1 text-sm">{course.access_code}</span>
                  </span>
                  
                  {/* BOTÓN DE BORRAR (Posicionado discretamente) */}
                  <DeleteCourseButton courseId={course.id} />

                </div>
                <h3 className="text-2xl font-bold leading-tight text-slate-900 group-hover:text-yellow-400 transition-colors">
                  <Link href={`/dashboard/teacher/courses/${course.id}`}>
                    <span className="absolute inset-0" />
                    {course.name}
                  </Link>
                </h3>
              </div>
              
              <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-t border-slate-100 group-hover:bg-[#2E9FFB]/5 transition-colors">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Users className="h-4 w-4 text-yellow-400" />
                  <span>{course.enrollments[0]?.count || 0} estudiantes</span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-slate-400 group-hover:text-[#2E9FFB] group-hover:scale-110 transition-all">
                    <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}