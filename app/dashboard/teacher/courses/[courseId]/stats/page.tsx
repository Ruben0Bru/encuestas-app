import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, Award, BarChart3, Users } from 'lucide-react'
import clsx from 'clsx'

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseStatsPage({ params }: PageProps) {
  const { courseId } = await params
  const supabase = await createClient()

  // 1. Obtener el Curso
  const { data: course } = await supabase
    .from('courses')
    .select('name')
    .eq('id', courseId)
    .single()

  if (!course) notFound()

  // 2. OBTENCIÓN DE DATOS BLINDADA (Manual Joins)
  
  // A. Obtener IDs de los temas del curso
  const { data: topics } = await supabase
    .from('topics')
    .select('id, name')
    .eq('course_id', courseId)
  
  const topicIds = topics?.map(t => t.id) || []
  
  // Mapa rápido de Temas: ID -> Nombre
  const topicMap = new Map()
  topics?.forEach(t => topicMap.set(t.id, t.name))

  // B. Obtener IDs de las encuestas de esos temas
  let surveyIds: string[] = []
  if (topicIds.length > 0) {
    const { data: surveys } = await supabase
        .from('surveys')
        .select('id, topic_id, title')
        .in('topic_id', topicIds)
    
    surveyIds = surveys?.map(s => s.id) || []
  }

  // C. Obtener todos los INTENTOS de esas encuestas
  let attempts: any[] = []
  if (surveyIds.length > 0) {
    const { data: rawAttempts } = await supabase
        .from('survey_attempts')
        .select('student_id, score, total_questions, survey_id')
        .in('survey_id', surveyIds)
        .gt('total_questions', 0) // Solo intentos válidos
    
    attempts = rawAttempts || []
  }

  // D. Obtener Nombres de Estudiantes (Solo los que participaron)
  if (attempts.length > 0) {
    const studentIds = Array.from(new Set(attempts.map(a => a.student_id)))
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', studentIds)
    
    // Unir nombres a los intentos
    attempts = attempts.map(att => {
        const student = profiles?.find(p => p.id === att.student_id)
        return {
            ...att,
            studentName: student?.full_name || 'Anónimo'
        }
    })
  }

  // --- RE-ENRIQUECIMIENTO DE DATOS (Relación Survey -> Topic) ---
  const { data: allSurveys } = await supabase
    .from('surveys')
    .select('id, topic_id')
    .in('id', surveyIds)
  
  const surveyTopicMap = new Map() // SurveyID -> TopicID
  allSurveys?.forEach(s => surveyTopicMap.set(s.id, s.topic_id))


  // --- CÁLCULOS MATEMÁTICOS ---

  // A. Promedio Global
  let totalScoreSum = 0
  attempts.forEach((a: any) => {
    totalScoreSum += (a.score / a.total_questions) * 100
  })
  const courseAverage = attempts.length > 0 ? Math.round(totalScoreSum / attempts.length) : 0

  // B. Fortalezas y Debilidades (Agrupar por Tema)
  const topicStats: Record<string, { name: string; total: number; count: number }> = {}
  
  attempts.forEach((a: any) => {
    const topicID = surveyTopicMap.get(a.survey_id)
    const topicName = topicMap.get(topicID) || 'General'
    const percentage = (a.score / a.total_questions) * 100

    if (!topicStats[topicID]) {
        topicStats[topicID] = { name: topicName, total: 0, count: 0 }
    }
    topicStats[topicID].total += percentage
    topicStats[topicID].count += 1
  })

  const sortedTopics = Object.values(topicStats).map(t => ({
    name: t.name,
    average: Math.round(t.total / t.count)
  })).sort((a, b) => b.average - a.average)

  const bestTopic = sortedTopics[0]
  const worstTopic = sortedTopics[sortedTopics.length - 1]

  // C. Ranking
  const studentStats: Record<string, { name: string; total: number; count: number }> = {}

  attempts.forEach((a: any) => {
    const name = a.studentName
    const percentage = (a.score / a.total_questions) * 100
    
    if (!studentStats[name]) studentStats[name] = { name, total: 0, count: 0 }
    studentStats[name].total += percentage
    studentStats[name].count += 1
  })

  const ranking = Object.values(studentStats).map(s => ({
    name: s.name,
    average: Math.round(s.total / s.count)
  })).sort((a, b) => b.average - a.average).slice(0, 5)

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <Link 
          href={`/dashboard/teacher/courses/${courseId}`} 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#2E9FFB] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Volver al curso
        </Link>
        <div className="flex items-center gap-3">
            <div className="p-3 bg-[#2E9FFB]/10 text-[#2E9FFB] rounded-2xl">
                <BarChart3 className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Analítica del Curso</h1>
                <p className="text-slate-500 font-medium">{course.name}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Promedio de Clase</p>
            <div className="flex items-end gap-3">
                <span className={clsx("text-5xl font-black", 
                    courseAverage >= 80 ? "text-[#2EFB87]" : 
                    courseAverage >= 60 ? "text-[#2E9FFB]" : "text-[#FB2E80]"
                )}>
                    {courseAverage}%
                </span>
                <span className="text-sm text-slate-400 mb-2 font-medium">Global</span>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-10 p-4"><TrendingUp className="h-16 w-16 text-[#2EFB87]" /></div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#2EFB87]" /> Fortaleza</p>
            <h3 className="text-xl font-bold text-slate-800 truncate" title={bestTopic?.name}>{bestTopic?.name || "N/A"}</h3>
            <p className="text-sm text-[#2EFB87] font-bold mt-1">{bestTopic ? `${bestTopic.average}% de aciertos` : "-"}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 p-4"><TrendingDown className="h-16 w-16 text-[#FB2E80]" /></div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-[#FB2E80]" /> Debilidad</p>
            <h3 className="text-xl font-bold text-slate-800 truncate" title={worstTopic?.name}>{worstTopic?.name || "N/A"}</h3>
            <p className="text-sm text-[#FB2E80] font-bold mt-1">{worstTopic ? `${worstTopic.average}% de aciertos` : "-"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Award className="text-[#FBE02E]" /> Top Estudiantes</h3>
            <div className="space-y-4">
                {ranking.length === 0 ? <p className="text-slate-400 italic text-center">Sin datos.</p> : ranking.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={clsx("h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm", i === 0 ? "bg-[#FBE02E] text-white shadow-md" : "bg-slate-100 text-slate-500")}>{i+1}</div>
                            <span className="font-bold text-slate-700">{s.name}</span>
                        </div>
                        <span className="font-mono font-bold text-[#2E9FFB]">{s.average}%</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Users className="text-slate-400" /> Rendimiento por Tema</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                 {sortedTopics.length === 0 ? <p className="text-slate-400 italic text-center">Sin datos.</p> : sortedTopics.map((t, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-sm font-medium"><span className="text-slate-700">{t.name}</span><span className="text-slate-500">{t.average}%</span></div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className={clsx("h-full rounded-full", t.average >= 80 ? "bg-[#2EFB87]" : t.average >= 60 ? "bg-[#2E9FFB]" : "bg-[#FB2E80]")} style={{ width: `${t.average}%` }}></div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
      </div>
    </div>
  )
}