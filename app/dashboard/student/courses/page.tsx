import { createClient } from '@/utils/supabase/server'
import { GraduationCap, User, BookOpen } from 'lucide-react'
import EnrollCourseForm from '../EnrollCourseForm' // Importamos el form que ya existe

export default async function StudentCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      joined_at,
      course:courses (
        id, 
        name, 
        description,
        access_code,
        teacher:profiles(full_name)
      )
    `)
    .eq('student_id', user?.id)
    .order('joined_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <GraduationCap className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Mis Cursos</h1>
                <p className="text-slate-500">Clases a las que estás inscrito</p>
            </div>
        </div>
        
        {/* Formulario de inscripción */}
        <div className="w-full md:w-auto">
            <EnrollCourseForm />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!enrollments || enrollments.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium">No estás inscrito en ningún curso.</p>
                <p className="text-sm text-slate-300 mt-1">Usa el código que te dio tu profesor arriba.</p>
            </div>
        ) : (
            enrollments.map((item: any) => (
                <div key={item.course.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                            {item.course.access_code}
                        </span>
                        <span className="text-xs text-slate-400">
                            {new Date(item.joined_at).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {item.course.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                        {item.course.description || "Sin descripción"}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 border-t border-slate-50 pt-4">
                        <User className="h-3 w-3" /> 
                        Prof. {item.course.teacher?.full_name || "Docente"}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  )
}