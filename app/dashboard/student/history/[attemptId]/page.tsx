import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import clsx from 'clsx'
import AttemptReview from '../../../../../components/AttemptReview' // <--- IMPORTAMOS

interface PageProps {
  params: Promise<{ attemptId: string }>
}

export default async function AttemptReviewPage({ params }: PageProps) {
  const { attemptId } = await params
  const supabase = await createClient()

  // 1. Obtener Intento
  const { data: attempt } = await supabase
    .from('survey_attempts')
    .select(`*, answers(question_id, option_id, is_correct)`)
    .eq('id', attemptId)
    .single()

  if (!attempt) notFound()

  // 2. Obtener Encuesta
  const { data: survey } = await supabase
    .from('surveys')
    .select(`
      title,
      questions (
        id, question_text, order_index,
        options (id, option_text, is_correct)
      )
    `)
    .eq('id', attempt.survey_id)
    .single()

  if (!survey) return <div>Error cargando encuesta.</div>

  const questions = survey.questions.sort((a: any, b: any) => a.order_index - b.order_index)

  // Crear mapa de respuestas
  // OJO: Map no se puede pasar directamente de Server a Client Component. 
  // Convertimos a objeto plano o pasamos el Map si usamos 'use client' abajo, 
  // pero mejor pasar el Map serializado o reconstruirlo.
  // Para simplicidad: Pasamos el Map directamente (Next.js lo serializa si son datos simples)
  const myAnswersMap = new Map()
  attempt.answers.forEach((ans: any) => {
    myAnswersMap.set(ans.question_id, ans.option_id)
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Header Estático */}
      <div>
        <Link 
          href="/dashboard/student/history" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#2E9FFB] mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Volver al historial
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{survey.title}</h1>
                <p className="text-slate-500">Revisión de resultados</p>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase">Nota Final</p>
                    <p className={clsx("text-2xl font-black", 
                        attempt.mastery_level === 'Dominado' ? "text-green-600" : 
                        attempt.mastery_level === 'Nulo' ? "text-red-500" : "text-slate-800"
                    )}>
                        {attempt.score}/{attempt.total_questions}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Componente Interactivo */}
      <AttemptReview questions={questions} myAnswersMap={myAnswersMap} />

    </div>
  )
}