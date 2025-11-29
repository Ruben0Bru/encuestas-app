'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'

export default function AttemptReview({ questions, myAnswersMap }: { questions: any[], myAnswersMap: Map<string, string> }) {
  // Estado para controlar si mostramos las respuestas correctas
  const [showCorrect, setShowCorrect] = useState(false)

  return (
    <div className="space-y-6">
      
      {/* Control de Revelación */}
      <div className="flex justify-end">
        <button 
            onClick={() => setShowCorrect(!showCorrect)}
            className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                showCorrect 
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
        >
            {showCorrect ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showCorrect ? "Ocultar Correctas" : "Revelar Respuestas Correctas"}
        </button>
      </div>

      {/* Lista de Preguntas */}
      <div className="space-y-8">
        {questions.map((q: any, idx: number) => {
            const myAnswerOptionId = myAnswersMap.get(q.id)
            const isAnswered = myAnswerOptionId !== undefined
            
            // Determinar si acertó (para pintar el header)
            let isUserCorrect = false
            if (isAnswered) {
                const selectedOption = q.options.find((o: any) => o.id === myAnswerOptionId)
                isUserCorrect = selectedOption?.is_correct
            }

            return (
                <div key={q.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    {/* Encabezado */}
                    <div className={clsx("p-6 flex gap-4 border-b transition-colors duration-300", 
                        // Si revelamos correctas, el header se mantiene neutral o verde si acertó.
                        // Si NO revelamos, se muestra rojo si falló.
                        isUserCorrect ? "bg-green-50/50 border-green-100" : 
                        (isAnswered && !showCorrect) ? "bg-red-50/50 border-red-100" : // Solo rojo si no ha revelado la verdad (opcional)
                        "bg-slate-50 border-slate-100"
                    )}>
                        <div className={clsx("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold transition-colors duration-300",
                             isUserCorrect ? "bg-green-100 text-green-700" :
                             isAnswered ? "bg-slate-200 text-slate-500" : "bg-slate-200 text-slate-500"
                        )}>
                            {idx + 1}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 pt-0.5">{q.question_text}</h3>
                    </div>

                    {/* Opciones */}
                    <div className="p-6 grid gap-3">
                        {q.options.map((opt: any) => {
                            const isSelected = opt.id === myAnswerOptionId
                            const isCorrect = opt.is_correct

                            // LÓGICA DE COLORES DINÁMICA
                            let styles = "border-slate-100 bg-white text-slate-600 opacity-60"
                            let icon = null

                            // Caso A: Usuario seleccionó esta opción
                            if (isSelected) {
                                if (isCorrect) {
                                    // Eligió bien
                                    styles = "border-green-200 bg-green-50 text-green-800 font-medium ring-1 ring-green-200 opacity-100"
                                    icon = <CheckCircle2 className="h-5 w-5 text-green-600" />
                                } else {
                                    // Eligió mal
                                    styles = "border-red-200 bg-red-50 text-red-800 font-medium ring-1 ring-red-200 opacity-100"
                                    icon = <XCircle className="h-5 w-5 text-red-500" />
                                }
                            }

                            // Caso B: Es la correcta, pero el usuario NO la eligió (Y activó "Revelar")
                            if (showCorrect && isCorrect && !isSelected) {
                                styles = "border-green-200 bg-white text-green-700 font-medium ring-1 ring-green-200 border-dashed opacity-100"
                                icon = <CheckCircle2 className="h-5 w-5 text-green-600 opacity-50" />
                            }

                            return (
                                <div key={opt.id} className={clsx("p-4 rounded-xl border flex items-center justify-between transition-all duration-300", styles)}>
                                    <span className="flex items-center gap-3">
                                        {opt.option_text}
                                        {isSelected && (
                                            <span className="text-[10px] uppercase font-bold bg-white/50 px-2 py-0.5 rounded border border-black/5 shadow-sm">
                                                Tu respuesta
                                            </span>
                                        )}
                                        {showCorrect && isCorrect && !isSelected && (
                                            <span className="text-[10px] uppercase font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                Correcta
                                            </span>
                                        )}
                                    </span>
                                    {icon}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  )
}