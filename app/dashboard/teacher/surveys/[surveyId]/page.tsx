import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import QuestionCreator from './QuestionCreator'
import { deleteQuestion } from '@/app/actions/questions'
import clsx from 'clsx'
import SurveyControls from './SurveyControls'

interface PageProps {
  params: Promise<{ surveyId: string }>
}

export default async function SurveyBuilderPage({ params }: PageProps) {
  const { surveyId } = await params
  const supabase = await createClient()

  // 1. Obtener la encuesta Y EL CURSO RELACIONADO (JOIN)
  const { data: survey } = await supabase
    .from('surveys')
    .select(`
      *,
      topics (
        course_id
      )
    `)
    .eq('id', surveyId)
    .single()

  if (!survey) notFound()

  // Extraemos el ID del curso de la relación para que el botón "Volver" funcione
  // (Usamos 'as any' para evitar pelear con TypeScript si no generamos tipos estrictos)
  const courseId = (survey.topics as any)?.course_id

  // 2. Obtener preguntas y opciones
  const { data: questions } = await supabase
    .from('questions')
    .select(`
      *,
      options (*)
    `)
    .eq('survey_id', surveyId)
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Navbar de Navegación del Builder */}
      <header>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <Link 
            href={`/dashboard/teacher/courses/${courseId}`} // <--- ¡AQUÍ ESTÁ EL ARREGLO!
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#2E9FFB] transition-colors group"
            >
            <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Volver al curso
            </Link>
            
            <SurveyControls 
                surveyId={survey.id} 
                isActive={survey.is_active} 
                pin={survey.access_pin} 
            />
        </div>

        <div className="bg-[#2E9FFB] rounded-3xl p-8 text-white shadow-lg shadow-[#2E9FFB]/30 relative overflow-hidden">
             {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <h1 className="text-3xl font-extrabold relative z-10">{survey.title}</h1>
            <p className="opacity-90 mt-2 relative z-10 font-medium">
                {questions?.length || 0} preguntas creadas
            </p>
        </div>
      </header>

      {/* LISTA DE PREGUNTAS EXISTENTES */}
      <div className="space-y-6">
        {questions?.map((q, idx) => (
            <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                        <span className="flex-shrink-0 h-8 w-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                        </span>
                        <h4 className="text-lg font-bold text-slate-800">{q.question_text}</h4>
                    </div>
                    
                    {/* Botón Borrar */}
                    <form action={deleteQuestion.bind(null, q.id, surveyId)}>
                        <button className="text-slate-300 hover:text-red-500 transition-colors" title="Eliminar pregunta">
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </form>
                </div>

                {/* Grid visual de las opciones guardadas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-12">
                    {q.options.map((opt: any) => (
                        <div key={opt.id} className={clsx(
                            "px-3 py-2 rounded-lg text-sm font-medium border flex items-center gap-2",
                            opt.is_correct 
                                ? "bg-green-50 border-green-200 text-green-700" 
                                : "bg-slate-50 border-slate-100 text-slate-500"
                        )}>
                            {opt.is_correct && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                            {opt.option_text}
                        </div>
                    ))}
                </div>
            </div>
        ))}
        
        {questions?.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-400 font-medium">No hay preguntas todavía. ¡Crea la primera abajo!</p>
            </div>
        )}
      </div>

      {/* COMPONENTE PARA CREAR NUEVA */}
      <QuestionCreator surveyId={surveyId} />

    </div>
  )
}