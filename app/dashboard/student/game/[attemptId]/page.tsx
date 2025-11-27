import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import GameClient from './GameClient'

interface PageProps {
  params: Promise<{ attemptId: string }>
}

export default async function GamePage({ params }: PageProps) {
  const { attemptId } = await params
  const supabase = await createClient()

  // 1. Obtener información del intento (para saber cual es la encuesta)
  const { data: attempt } = await supabase
    .from('survey_attempts')
    .select('survey_id')
    .eq('id', attemptId)
    .single()

  if (!attempt) notFound()

  // 2. Traer TODAS las preguntas de la encuesta con sus opciones
  const { data: questions } = await supabase
    .from('questions')
    .select(`
      id,
      question_text,
      order_index,
      options (id, option_text)
    `)
    .eq('survey_id', attempt.survey_id)
    .order('created_at', { ascending: true })

  if (!questions || questions.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center text-slate-500">
            Esta encuesta no tiene preguntas activas.
        </div>
    )
  }

  // 3. Traer las RESPUESTAS que ya ha dado este estudiante en este intento
  const { data: answers } = await supabase
    .from('answers')
    .select('question_id')
    .eq('attempt_id', attemptId)

  // Creamos un Set con los IDs de preguntas respondidas para filtrar rápido
  const answeredQuestionIds = new Set(answers?.map(a => a.question_id))

  // 4. Encontrar la primera pregunta que NO esté en la lista de respondidas
  const currentQuestion = questions.find(q => !answeredQuestionIds.has(q.id))

  // SI NO HAY PREGUNTA ACTUAL, SIGNIFICA QUE YA RESPONDIÓ TODAS
  if (!currentQuestion) {
    // Redirigir a resultados
    redirect(`/dashboard/student/results/${attemptId}`)
  }

  // 5. Calcular número de pregunta actual (para la barra de progreso)
  const currentIndex = questions.findIndex(q => q.id === currentQuestion.id)
  
  return (
    <GameClient 
    key={currentQuestion.id}
      question={currentQuestion} 
      attemptId={attemptId}
      questionNumber={currentIndex + 1}
      totalQuestions={questions.length}
    />
  )
}