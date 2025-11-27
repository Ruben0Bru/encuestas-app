import { createClient } from '@/utils/supabase/server'
import { TrendingUp, Trophy, Zap, Clock, History, BookOpen, AlertCircle } from 'lucide-react'
import StudentJoinForm from './StudentJoinForm'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Obtener historial COMPLETO
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

  // --- FILTRO MAESTRO ---
  // Solo consideramos intentos que tengan fecha de finalización O que tengan preguntas respondidas.
  // Esto elimina los "Jugando" fantasmas.
  const validAttempts = allAttempts.filter((a: any) => a.finished_at !== null && a.total_questions > 0)

  // --- CÁLCULOS ESTADÍSTICOS (Usando solo validAttempts) ---
  
  // Promedio General
  const averageScore = validAttempts.length > 0 
    ? Math.round(validAttempts.reduce((acc: number, curr: any) => {
        const percentage = (curr.score / curr.total_questions) * 100
        return acc + percentage
      }, 0) / validAttempts.length)
    : 0

  // Calcular Tema Más Fuerte
  const topicScores: Record<string, number[]> = {}
  validAttempts.forEach((a: any) => {
    const topicName = a.surveys?.topics?.name || 'General'
    const score = (a.score / a.total_questions) * 100
    if (!topicScores[topicName]) topicScores[topicName] = []
    topicScores[topicName].push(score)
  })

  let bestTopic = "N/A"
  let bestTopicAvg = 0

  Object.entries(topicScores).forEach(([topic, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    if (avg > bestTopicAvg) {
      bestTopicAvg = avg
      bestTopic = topic
    }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
      
      {/* SECCIÓN 1: BIENVENIDA Y PIN */}
      <div className="text-center space-y-6 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          ¡Hola, {user?.user_metadata.full_name?.split(' ')[0] || 'Estudiante'}! 👋
        </h1>
        <p className="text-lg text-slate-500">
          ¿Listo para aprender? Ingresa el PIN para comenzar.
        </p>
        <StudentJoinForm />
      </div>

      {/* SECCIÓN 2: MIS ESTADÍSTICAS */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#2E9FFB]" />
            Tu Progreso
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Promedio */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="p-4 bg-[#FBE02E]/10 text-[#FBE02E] rounded-2xl">
                    <Trophy className="h-8 w-8" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Promedio Global</p>
                    <p className="text-4xl font-black text-slate-900">{averageScore}%</p>
                </div>
            </div>

            {/* Mejor Tema */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="p-4 bg-[#FB2E80]/10 text-[#FB2E80] rounded-2xl">
                    <Zap className="h-8 w-8" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Tu fuerte es</p>
                    <p className="text-2xl font-black text-slate-900 truncate max-w-[150px]" title={bestTopic}>
                        {bestTopic}
                    </p>
                </div>
            </div>

            {/* Actividad */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="p-4 bg-[#2E9FFB]/10 text-[#2E9FFB] rounded-2xl">
                    <Clock className="h-8 w-8" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Encuestas</p>
                    <p className="text-4xl font-black text-slate-900">{validAttempts.length}</p>
                </div>
            </div>
        </div>
      </div>

      {/* SECCIÓN 3: HISTORIAL RECIENTE */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <History className="h-6 w-6 text-slate-400" />
            Historial Reciente
        </h2>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {validAttempts.length === 0 ? (
                <div className="text-center py-12 px-6 flex flex-col items-center">
                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                        <AlertCircle className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No tienes historial de encuestas completadas.</p>
                    <p className="text-sm text-slate-400 mt-1">Cuando termines tu primera actividad, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {/* AQUI ESTÁ EL CAMBIO: Usamos validAttempts en lugar de attempts */}
                    {validAttempts.slice(0, 5).map((attempt: any) => {
                        const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                        
                        return (
                            <div key={attempt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${
                                        attempt.mastery_level === 'Dominado' ? 'bg-green-100 text-green-600' :
                                        attempt.mastery_level === 'Excelente' ? 'bg-blue-100 text-blue-600' :
                                        'bg-slate-100 text-slate-500'
                                    }`}>
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{attempt.surveys?.title || "Encuesta"}</h4>
                                        <p className="text-sm text-slate-500">
                                            {attempt.surveys?.topics?.name || "General"} • {new Date(attempt.finished_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-black text-slate-800">
                                        {percentage}%
                                    </span>
                                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500">
                                        {attempt.mastery_level}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
      </div>

    </div>
  )
}