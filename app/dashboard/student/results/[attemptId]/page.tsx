import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Home, Target, Zap } from 'lucide-react'
import clsx from 'clsx'

interface PageProps {
  params: Promise<{ attemptId: string }>
}

export default async function ResultsPage({ params }: PageProps) {
  const { attemptId } = await params
  const supabase = await createClient()

  // 1. Obtener el intento y las respuestas
  const { data: attempt } = await supabase
    .from('survey_attempts')
    .select(`
      *,
      surveys (title),
      answers (is_correct)
    `)
    .eq('id', attemptId)
    .single()

  // Si no existe el intento, mostramos 404 real
  if (!attempt) notFound()

  // 2. CALCULAR RESULTADOS
  const totalQuestions = attempt.answers.length
  const correctAnswers = attempt.answers.filter((a: any) => a.is_correct).length
  const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

  // 3. DETERMINAR DOMINIO
  let masteryLevel = 'Nulo'
  let masteryColor = 'bg-slate-500'
  let message = 'Sigue practicando'

  if (scorePercentage <= 20) {
    masteryLevel = 'Nulo'; masteryColor = 'bg-red-500'; message = '¡No te rindas! Repasa el tema.';
  } else if (scorePercentage > 20 && scorePercentage < 40) {
    masteryLevel = 'Básico'; masteryColor = 'bg-orange-500'; message = 'Buen intento, pero falta estudiar.';
  } else if (scorePercentage >= 40 && scorePercentage < 60) {
    masteryLevel = 'Elemental'; masteryColor = 'bg-yellow-500'; message = 'Vas por buen camino.';
  } else if (scorePercentage >= 60 && scorePercentage < 80) {
    masteryLevel = 'Excelente'; masteryColor = 'bg-blue-500'; message = '¡Muy buen trabajo!';
  } else if (scorePercentage >= 80) {
    masteryLevel = 'Dominado'; masteryColor = 'bg-green-500'; message = '¡Eres un maestro en esto!';
  }

  // 4. ACTUALIZAR BASE DE DATOS
  // Guardamos los resultados finales en el historial
  await supabase
    .from('survey_attempts')
    .update({
      score: correctAnswers,
      total_questions: totalQuestions,
      mastery_level: masteryLevel,
      finished_at: new Date().toISOString()
    })
    .eq('id', attemptId)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-in zoom-in-95 duration-500 pb-20">
      
      {/* Tarjeta de Resultados */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 w-full max-w-md text-center relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className={clsx("absolute top-0 left-0 w-full h-2", masteryColor)}></div>

        {/* Ícono de Trofeo Animado */}
        <div className="mb-6 inline-flex p-4 rounded-full bg-yellow-50 text-yellow-500 mb-6 shadow-sm ring-4 ring-yellow-100 animate-bounce">
            <Trophy className="h-12 w-12 fill-current" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2">
            {masteryLevel === 'Dominado' ? '¡Increíble!' : 'Resultados'}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
            {attempt.surveys.title}
        </p>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Target className="h-3 w-3" /> Aciertos
                </div>
                <div className="text-3xl font-black text-slate-800">
                    {correctAnswers}<span className="text-lg text-slate-400">/{totalQuestions}</span>
                </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Zap className="h-3 w-3" /> Dominio
                </div>
                <div className={clsx("text-lg font-black truncate px-2 py-1 rounded-lg text-white shadow-sm mt-1", masteryColor)}>
                    {masteryLevel}
                </div>
            </div>
        </div>

        {/* Mensaje de Motivación */}
        <div className="bg-[#2E9FFB]/5 p-4 rounded-xl border border-[#2E9FFB]/10 mb-8">
            <p className="text-[#2E9FFB] font-bold text-sm">
                "{message}"
            </p>
        </div>

        {/* Botón de Salir */}
        <Link 
            href="/dashboard/student"
            className="w-full bg-slate-900 text-white text-lg font-bold py-4 rounded-2xl hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
            <Home className="h-5 w-5" />
            Volver al Inicio
        </Link>

      </div>

        {/* Decoración de confeti simple (CSS) */}
        {scorePercentage >= 80 && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-10 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 left-10 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
        )}
    </div>
  )
}