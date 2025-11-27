import { createClient } from '@/utils/supabase/server'
import { BookOpen, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

export default async function StudentHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: attemptsData } = await supabase
    .from('survey_attempts')
    .select(`
      *,
      surveys (
        title,
        topics (name)
      )
    `)
    .eq('student_id', user?.id)
    .order('finished_at', { ascending: false })

  const allAttempts = attemptsData || []
  // Filtramos solo los intentos terminados
  const history = allAttempts.filter((a: any) => a.finished_at !== null && a.total_questions > 0)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="h-8 w-8" />
        </div>
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Tu Historial</h1>
            <p className="text-slate-500">Todas las encuestas que has completado</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {history.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-400 italic">No tienes historial aún.</p>
            </div>
        ) : (
            <div className="divide-y divide-slate-100">
                {history.map((attempt: any) => {
                    const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                    const isPassed = percentage >= 60; 

                    return (
                        <div key={attempt.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                            
                            <div className="flex items-start gap-4">
                                <div className={clsx(
                                    "mt-1 p-2 rounded-full", 
                                    isPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                )}>
                                    {isPassed ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900">{attempt.surveys?.title}</h4>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" /> {attempt.surveys?.topics?.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {new Date(attempt.finished_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pl-12 md:pl-0">
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase">Puntaje</p>
                                    <p className="text-2xl font-black text-slate-800">{percentage}%</p>
                                </div>
                                <div className="text-right w-24">
                                    <p className="text-xs font-bold text-slate-400 uppercase">Nivel</p>
                                    <span className={clsx(
                                        "inline-block px-3 py-1 rounded-full text-xs font-bold mt-1",
                                        attempt.mastery_level === 'Dominado' ? 'bg-green-100 text-green-700' :
                                        attempt.mastery_level === 'Excelente' ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-600'
                                    )}>
                                        {attempt.mastery_level}
                                    </span>
                                </div>
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