'use client'

import { Users, CheckCircle2, BarChart3, Trophy } from 'lucide-react'
import clsx from 'clsx'

// Definimos la estructura de los datos que recibirá este componente
interface SurveyResultsProps {
  totalParticipants: number
  questions: any[]
  stats: Record<string, Record<string, number>> // { questionId: { optionId: count } }
  participants: any[] // Lista de estudiantes con su nota
}

export default function SurveyResults({ 
  totalParticipants, 
  questions, 
  stats,
  participants 
}: SurveyResultsProps) {
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. RESUMEN DE PARTICIPACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-slate-900">Participación</h3>
                <p className="text-slate-500 text-sm">Estudiantes que han respondido</p>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl text-blue-600">
                <Users className="h-6 w-6" />
                <span className="text-3xl font-black">{totalParticipants}</span>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-slate-900">Mejor Puntaje</h3>
                <p className="text-slate-500 text-sm">{participants[0]?.student?.full_name || "Nadie aún"}</p>
            </div>
            <div className="flex items-center gap-3 bg-yellow-50 px-4 py-2 rounded-xl text-yellow-600">
                <Trophy className="h-6 w-6" />
                <span className="text-3xl font-black">{participants[0]?.score || 0}</span>
            </div>
        </div>
      </div>

      {/* 2. ANÁLISIS POR PREGUNTA (BARRAS) */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[#2E9FFB]" /> Desglose por Pregunta
        </h2>

        {questions.map((q, idx) => {
            const qStats = stats[q.id] || {}
            // Sumar todos los votos de ESTA pregunta para sacar el 100%
            const totalVotes = Object.values(qStats).reduce((a: any, b: any) => a + b, 0) as number

            return (
                <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    {/* Enunciado */}
                    <div className="flex gap-4 mb-6">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">
                            {idx + 1}
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 pt-0.5">{q.question_text}</h4>
                    </div>

                    {/* Opciones y Barras */}
                    <div className="space-y-4 pl-0 md:pl-12">
                        {q.options.map((opt: any) => {
                            const count = (qStats[opt.id] as number) || 0
                            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
                            const isCorrect = opt.is_correct

                            return (
                                <div key={opt.id} className="relative group">
                                    {/* Info Texto */}
                                    <div className="flex items-center justify-between text-sm mb-1.5 relative z-10">
                                        <div className="flex items-center gap-2">
                                            {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                            <span className={clsx("font-medium", isCorrect ? "text-green-700" : "text-slate-600")}>
                                                {opt.option_text}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-700">{count} votos</span>
                                            <span className="text-slate-400 text-xs w-10 text-right">{percentage}%</span>
                                        </div>
                                    </div>
                                    
                                    {/* La Barra Visual */}
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={clsx("h-full rounded-full transition-all duration-1000 ease-out", 
                                                isCorrect ? "bg-green-500" : "bg-slate-300 group-hover:bg-[#2E9FFB]/50"
                                            )}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        })}
      </div>

      {/* 3. TABLA DE POSICIONES RÁPIDA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700">Tabla de Posiciones</h3>
        </div>
        <div className="divide-y divide-slate-100">
            {participants.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic">No hay participantes aún.</div>
            ) : (
                participants.map((p: any, i: number) => (
                    <div key={p.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-slate-400 w-6">#{i+1}</span>
                            <span className="font-medium text-slate-800">{p.student?.full_name || 'Anónimo'}</span>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <span className="font-bold text-slate-900">{p.score} pts</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs font-bold uppercase">{p.mastery_level}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

    </div>
  )
}