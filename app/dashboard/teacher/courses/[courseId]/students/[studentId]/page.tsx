import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Trophy, Zap, Clock, BookOpen, History, User } from 'lucide-react'

interface PageProps {
  params: Promise<{ courseId: string; studentId: string }>
}

export default async function StudentDetailPage({ params }: PageProps) {
  const { courseId, studentId } = await params
  const supabase = await createClient()

  // 1. Obtener datos del Estudiante
  const { data: student } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', studentId)
    .single()

  if (!student) notFound()

  // 2. Obtener los intentos de este estudiante en este curso
  // Hacemos el cruce manual para evitar errores de relación
  const { data: attemptsData } = await supabase
    .from('survey_attempts')
    .select(`
      *,
      surveys (
        title,
        topic_id
      )
    `)
    .eq('student_id', studentId)
    .order('finished_at', { ascending: false })

  // Filtramos: Solo encuestas que pertenezcan a temas de ESTE curso
  // (Primero traemos los temas del curso para filtrar)
  const { data: courseTopics } = await supabase
    .from('topics')
    .select('id')
    .eq('course_id', courseId)
  
  const courseTopicIds = courseTopics?.map(t => t.id) || []

  // Filtramos los intentos que corresponden a este curso
  const attempts = (attemptsData || []).filter((a: any) => 
    courseTopicIds.includes(a.surveys?.topic_id)
  )

  // --- CÁLCULO DEL "PROMEDIO DE APRENDIZAJE" ---
  const validAttempts = attempts.filter((a: any) => a.total_questions > 0)
  const totalAttempts = validAttempts.length
  
  const learningAverage = totalAttempts > 0 
    ? Math.round(validAttempts.reduce((acc: number, curr: any) => {
        const score = (curr.score / curr.total_questions) * 100
        return acc + score
      }, 0) / totalAttempts)
    : 0

  // Calcular Tema Más Fuerte (Bonus)
  // ... (Lógica similar a la que ya usamos)

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <Link 
          href={`/dashboard/teacher/courses/${courseId}`} 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#2E9FFB] mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Volver a la lista
        </Link>
        
        <div className="flex items-center gap-4 border-b border-slate-200 pb-8">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500 uppercase">
                {student.full_name?.substring(0,2)}
            </div>
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{student.full_name}</h1>
                <p className="text-slate-500">{student.email}</p>
            </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TARJETA: PROMEDIO DE APRENDIZAJE */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                <TrendingUp className="h-24 w-24 text-[#2E9FFB]" />
            </div>
            <div className="p-4 bg-[#2E9FFB]/10 text-[#2E9FFB] rounded-2xl relative z-10">
                <TrendingUp className="h-8 w-8" />
            </div>
            <div className="relative z-10">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Promedio de Aprendizaje</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-slate-900">{learningAverage}%</p>
                    <span className="text-xs font-medium text-slate-400">Global</span>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4">
            <div className="p-4 bg-[#FBE02E]/10 text-[#FBE02E] rounded-2xl"><Trophy className="h-8 w-8" /></div>
            <div><p className="text-sm text-slate-500 font-bold uppercase">Rendimiento</p><p className="text-2xl font-black text-slate-900">{learningAverage >= 80 ? 'Dominado' : learningAverage >= 60 ? 'Bueno' : 'Básico'}</p></div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4">
            <div className="p-4 bg-slate-100 text-slate-500 rounded-2xl"><Clock className="h-8 w-8" /></div>
            <div><p className="text-sm text-slate-500 font-bold uppercase">Actividades</p><p className="text-4xl font-black text-slate-900">{totalAttempts}</p></div>
        </div>
      </div>

      {/* HISTORIAL INDIVIDUAL */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <History className="h-6 w-6 text-slate-400" /> Historial de Actividades
        </h3>
        
        {validAttempts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 italic">No ha realizado actividades en este curso.</div>
        ) : (
            <div className="divide-y divide-slate-100">
                {validAttempts.map((attempt: any) => {
                    const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                    return (
                        <div key={attempt.id} className="py-4 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><BookOpen className="h-4 w-4" /></div>
                                <div>
                                    <p className="font-bold text-slate-900">{attempt.surveys?.title || "Encuesta"}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(attempt.finished_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-slate-800 text-lg">{percentage}%</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{attempt.mastery_level}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}
      </div>
    </div>
  )
}