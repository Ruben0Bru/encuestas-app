import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, Users, Award, BarChart3 } from 'lucide-react'
import clsx from 'clsx'

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseStatsPage({ params }: PageProps) {
  const { courseId } = await params
  const supabase = await createClient()

  // Consulta PROFUNDA para analíticas
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      topics (
        id, name,
        surveys (
          id, title,
          survey_attempts (
            score, total_questions,
            student:profiles(full_name) 
          )
        )
      )
    `)
    .eq('id', courseId)
    .single()

  if (!course) notFound()

  // --- CÁLCULOS ---
  let totalStudentsScore = 0
  let totalAttemptsCount = 0
  const topicStats: Record<string, { total: number, count: number, name: string }> = {}
  const studentStats: Record<string, { total: number, count: number, name: string }> = {}

  course.topics?.forEach((topic: any) => {
    if (!topicStats[topic.id]) topicStats[topic.id] = { total: 0, count: 0, name: topic.name }
    
    topic.surveys?.forEach((survey: any) => {
      survey.survey_attempts?.forEach((attempt: any) => {
        if (attempt.total_questions === 0) return
        const percentage = (attempt.score / attempt.total_questions) * 100
        
        totalStudentsScore += percentage
        totalAttemptsCount++
        
        topicStats[topic.id].total += percentage
        topicStats[topic.id].count++

        const sName = attempt.student?.full_name || 'Anónimo'
        if (!studentStats[sName]) studentStats[sName] = { total: 0, count: 0, name: sName }
        studentStats[sName].total += percentage
        studentStats[sName].count++
      })
    })
  })

  const courseAverage = totalAttemptsCount > 0 ? Math.round(totalStudentsScore / totalAttemptsCount) : 0
  
  const sortedTopics = Object.values(topicStats)
    .map(t => ({ ...t, average: t.count > 0 ? Math.round(t.total / t.count) : 0 }))
    .sort((a, b) => b.average - a.average)

  const ranking = Object.values(studentStats)
    .map(s => ({ ...s, average: s.count > 0 ? Math.round(s.total / s.count) : 0 }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 5)

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <Link 
          href={`/dashboard/teacher/courses/${courseId}`} 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#2E9FFB] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Volver al curso
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-[#2E9FFB]" /> Analítica: {course.name}
        </h1>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Promedio Global</p>
            <div className="text-5xl font-black text-[#2E9FFB]">{courseAverage}%</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex gap-2"><TrendingUp className="text-green-500 h-4 w-4"/> Fortaleza</p>
            <div className="text-xl font-bold text-slate-800">{sortedTopics[0]?.name || "N/A"}</div>
            <div className="text-green-600 font-bold text-sm">{sortedTopics[0]?.average || 0}% aciertos</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex gap-2"><TrendingDown className="text-red-500 h-4 w-4"/> Debilidad</p>
            <div className="text-xl font-bold text-slate-800">{sortedTopics[sortedTopics.length - 1]?.name || "N/A"}</div>
            <div className="text-red-500 font-bold text-sm">{sortedTopics[sortedTopics.length - 1]?.average || 0}% aciertos</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex gap-2"><Award className="text-[#FBE02E]" /> Top Estudiantes</h3>
            <div className="space-y-4">
                {ranking.length === 0 ? <p className="text-slate-400 italic">Sin datos.</p> : ranking.map((s, i) => (
                    <div key={i} className="flex justify-between p-3 hover:bg-slate-50 rounded-xl">
                        <div className="flex gap-4 font-bold text-slate-700">
                            <span className="text-slate-400">#{i+1}</span> {s.name}
                        </div>
                        <div className="font-mono font-bold text-[#2E9FFB]">{s.average}%</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}