import { createClient } from '@/utils/supabase/server'
import { TrendingUp, Trophy, Zap, Clock, Bell, Radio } from 'lucide-react'
import StudentJoinForm from './StudentJoinForm'
import QuickPlayButton from './QuickPlayButton' // <--- NUEVO

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Obtener estadísticas (Igual que antes)
  const { data: attemptsData } = await supabase
    .from('survey_attempts')
    .select(`*, surveys(title, topics(name))`)
    .eq('student_id', user?.id)
    .order('finished_at', { ascending: false })

  const attempts = attemptsData || []
  
  // --- LÓGICA DE LA BANDEJA DE ENTRADA (INBOX) ---
  
  // A. Obtener IDs de cursos inscritos
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', user?.id)
  
  const courseIds = enrollments?.map(e => e.course_id) || []

  // B. Obtener Encuestas ACTIVAS de esos cursos
  // (Hacemos un join inverso: traeme surveys donde el topic esté en mis cursos)
  let activeSurveys: any[] = []
  
  if (courseIds.length > 0) {
    const { data } = await supabase
        .from('surveys')
        .select(`
            id, title, access_pin, is_active,
            topics!inner (
                id, name, course_id,
                courses (name)
            )
        `)
        .eq('is_active', true) // Solo las activas
        .in('topics.course_id', courseIds) // Solo de mis cursos
    
    activeSurveys = data || []
  }

  // C. Filtrar las que YA respondí (Para no mostrar las que ya jugué)
  // Obtenemos los IDs de encuestas que ya tienen un intento
  const myAttemptedSurveyIds = new Set(attempts.map((a: any) => a.survey_id))
  
  // La "Bandeja" son las activas MENOS las intentadas
  const pendingSurveys = activeSurveys.filter(s => !myAttemptedSurveyIds.has(s.id))


  // --- CÁLCULOS ESTADÍSTICOS (Tu código original) ---
  const validAttempts = attempts.filter((a: any) => a.finished_at !== null && a.total_questions > 0)
  const totalAttempts = validAttempts.length // Usamos validAttempts para ser consistentes
  
  const averageScore = validAttempts.length > 0 
    ? Math.round(validAttempts.reduce((acc: number, curr: any) => acc + (curr.score / curr.total_questions) * 100, 0) / validAttempts.length)
    : 0

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
    if (avg > bestTopicAvg) { bestTopicAvg = avg; bestTopic = topic; }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      
      {/* SECCIÓN 1: BIENVENIDA Y PIN */}
      <div className="text-center space-y-6 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          ¡Hola, {user?.user_metadata.full_name?.split(' ')[0] || 'Estudiante'}! 👋
        </h1>
        <p className="text-lg text-slate-500">
          ¿Listo para aprender?
        </p>
        
        <StudentJoinForm />
      </div>

      {/* SECCIÓN 2: BANDEJA DE ACTIVIDADES (LA NUEVA VENTJA) */}
      {/* Solo se muestra si hay cosas pendientes */}
      {pendingSurveys.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bell className="h-32 w-32" />
            </div>
            
            <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Radio className="h-6 w-6 animate-pulse" />
                    En Vivo Ahora
                </h2>
                <p className="text-indigo-100 mb-6">
                    Tus profesores han activado estas encuestas. ¡Únete antes de que cierren!
                </p>

                <div className="grid gap-3">
                    {pendingSurveys.map((survey) => (
                        <div key={survey.id} className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:bg-white transition-colors shadow-sm">
                            <div>
                                <h3 className="font-bold text-lg">{survey.title}</h3>
                                <p className="text-sm text-slate-600">
                                    {survey.topics.courses.name} • {survey.topics.name}
                                </p>
                            </div>
                            {/* Botón Mágico que usa el PIN interno */}
                            <QuickPlayButton pin={survey.access_pin} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* SECCIÓN 3: ESTADÍSTICAS */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#2E9FFB]" />
            Tu Progreso
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4">
                <div className="p-4 bg-[#FBE02E]/10 text-[#FBE02E] rounded-2xl"><Trophy className="h-8 w-8" /></div>
                <div><p className="text-sm text-slate-500 font-bold uppercase">Promedio</p><p className="text-4xl font-black text-slate-900">{averageScore}%</p></div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4">
                <div className="p-4 bg-[#FB2E80]/10 text-[#FB2E80] rounded-2xl"><Zap className="h-8 w-8" /></div>
                <div><p className="text-sm text-slate-500 font-bold uppercase">Fuerte</p><p className="text-2xl font-black text-slate-900 truncate max-w-[150px]">{bestTopic}</p></div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-4">
                <div className="p-4 bg-[#2E9FFB]/10 text-[#2E9FFB] rounded-2xl"><Clock className="h-8 w-8" /></div>
                <div><p className="text-sm text-slate-500 font-bold uppercase">Encuestas</p><p className="text-4xl font-black text-slate-900">{totalAttempts}</p></div>
            </div>
        </div>
      </div>

    </div>
  )
}