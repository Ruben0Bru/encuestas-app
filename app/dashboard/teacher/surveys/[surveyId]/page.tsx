import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, BarChart2, Edit3, Trash2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import QuestionCreator from './QuestionCreator'
import SurveyControls from './SurveyControls'
import SurveyResults from './SurveyResults'
import { deleteQuestion } from '@/app/actions/questions'
import clsx from 'clsx'

interface PageProps {
  params: Promise<{ surveyId: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function SurveyPage({ params, searchParams }: PageProps) {
  const { surveyId } = await params
  const { tab } = await searchParams 
  const isResultsMode = tab === 'results'

  const supabase = await createClient()

  // 1. OBTENER ENCUESTA
  const { data: survey } = await supabase
    .from('surveys')
    .select(`*, questions(*, options(*)), topics(course_id)`)
    .eq('id', surveyId)
    .single()

  if (!survey) notFound()

  const courseId = (survey.topics as any)?.course_id
  const questions = survey.questions?.sort((a: any, b: any) => a.order_index - b.order_index) || []

  // 2. LÓGICA DE RESULTADOS (MODO MANUAL V2)
  let statsMap: Record<string, Record<string, number>> = {}
  let participants: any[] = []
  let totalParticipants = 0

  if (isResultsMode) {
    console.log("--- DEBUG RESULTADOS ---")
    
    // A. Traer los intentos (Attempts)
    const { data: attempts } = await supabase
        .from('survey_attempts')
        .select('*')
        .eq('survey_id', surveyId)
        .order('score', { ascending: false })
    
    const attemptsList = attempts || []
    console.log(`Intentos encontrados: ${attemptsList.length}`)

    if (attemptsList.length > 0) {
        // B. Traer Respuestas (Answers)
        const attemptIds = attemptsList.map(a => a.id)
        const { data: allAnswers } = await supabase
            .from('answers')
            .select('attempt_id, question_id, option_id')
            .in('attempt_id', attemptIds)

        // C. Traer Perfiles (Profiles) - MANUALMENTE
        const studentIds = attemptsList.map(a => a.student_id)
        // Eliminamos duplicados para la query
        const uniqueStudentIds = Array.from(new Set(studentIds))
        
        console.log(`IDs de estudiantes a buscar:`, uniqueStudentIds)

        const { data: profiles } = await supabase
            .from('profiles')
            .select('*') // Traemos todo para estar seguros
            .in('id', uniqueStudentIds)

        console.log(`Perfiles encontrados: ${profiles?.length || 0}`)

        // D. UNIR DATOS (El punto crítico)
        participants = attemptsList.map(attempt => {
            // Buscamos el perfil que coincida con el ID
            const studentProfile = profiles?.find(p => p.id === attempt.student_id)
            
            // Si no encuentra, logueamos para saber
            if (!studentProfile) console.log(`ALERTA: Perfil no encontrado para ID ${attempt.student_id}`)

            const myAnswers = allAnswers?.filter((ans: any) => ans.attempt_id === attempt.id) || []
            
            return {
                ...attempt,
                student: studentProfile, // Aquí inyectamos el perfil
                answers: myAnswers
            }
        })

        // E. Calcular Estadísticas Visuales
        totalParticipants = participants.length
        participants.forEach((p) => {
            p.answers.forEach((ans: any) => {
                if (!statsMap[ans.question_id]) statsMap[ans.question_id] = {}
                const current = statsMap[ans.question_id][ans.option_id] || 0
                statsMap[ans.question_id][ans.option_id] = current + 1
            })
        })
    }
  }

  // --- RENDER ---
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* HEADER */}
      <header>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <Link 
                href={`/dashboard/teacher/courses/${courseId}`} 
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#2E9FFB] transition-colors group"
            >
                <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Volver al curso
            </Link>
            
            <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-1 rounded-xl flex text-sm font-bold shadow-inner">
                    <Link 
                        href={`?tab=editor`}
                        className={clsx("px-4 py-2 rounded-lg transition-all flex items-center gap-2", 
                            !isResultsMode ? "bg-white text-[#2E9FFB] shadow-sm scale-105" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        <Edit3 className="h-4 w-4" /> Editor
                    </Link>
                    <Link 
                        href={`?tab=results`}
                        className={clsx("px-4 py-2 rounded-lg transition-all flex items-center gap-2", 
                            isResultsMode ? "bg-white text-[#2E9FFB] shadow-sm scale-105" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        <BarChart2 className="h-4 w-4" /> Resultados
                    </Link>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-2"></div>

                <SurveyControls 
                    surveyId={survey.id} 
                    isActive={survey.is_active} 
                    pin={survey.access_pin} 
                />
            </div>
        </div>

        <div className="bg-[#2E9FFB] rounded-3xl p-8 text-white shadow-lg shadow-[#2E9FFB]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <h1 className="text-3xl font-extrabold relative z-10">{survey.title}</h1>
            <p className="opacity-90 mt-2 relative z-10 font-medium flex items-center gap-2">
                {questions.length} preguntas 
                <span className="w-1 h-1 rounded-full bg-white/50"></span>
                {isResultsMode ? 'Analizando Respuestas' : 'Modo Edición'}
            </p>
        </div>
      </header>

      {/* CONTENIDO */}
      {isResultsMode ? (
        <SurveyResults 
            stats={statsMap} 
            totalParticipants={totalParticipants} 
            questions={questions}
            participants={participants}
        />
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            {questions.map((q: any, idx: number) => (
                <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 h-8 w-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                            </span>
                            <h4 className="text-lg font-bold text-slate-800">{q.question_text}</h4>
                        </div>
                        <form action={deleteQuestion.bind(null, q.id, surveyId)}>
                            <button className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-12">
                        {q.options.map((opt: any) => (
                            <div key={opt.id} className={clsx(
                                "px-3 py-2 rounded-lg text-sm font-medium border flex items-center gap-2",
                                opt.is_correct ? "bg-green-50 border-green-200 text-green-700" : "bg-slate-50 border-slate-100 text-slate-500"
                            )}>
                                {opt.is_correct && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                {opt.option_text}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <QuestionCreator surveyId={surveyId} />
        </div>
      )}

    </div>
  )
}