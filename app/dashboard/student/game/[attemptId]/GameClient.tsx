'use client'

import { submitAnswer } from '@/app/actions/gameplay'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

// Definimos los tipos para las props
type Option = {
  id: string
  option_text: string
}

type Question = {
  id: string
  question_text: string
  options: Option[]
}

export default function GameClient({ 
  question, 
  attemptId, 
  questionNumber, 
  totalQuestions 
}: { 
  question: Question
  attemptId: string
  questionNumber: number
  totalQuestions: number
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = async (optionId: string) => {
    if (isSubmitting) return // Evitar doble clic
    setIsSubmitting(true)
    
    // Enviamos la respuesta. La página se recargará automáticamente al terminar.
    await submitAnswer(attemptId, question.id, optionId)
  }

  // Colores dinámicos para las opciones
  const getColors = (index: number) => {
    const palette = [
      'bg-[#FB2E80] hover:bg-[#d91e6b] border-b-4 border-[#ad1856]', // Rojo Kahoot
      'bg-[#2E9FFB] hover:bg-[#1a8cd8] border-b-4 border-[#126ba6]', // Azul Kahoot
      'bg-[#FBE02E] hover:bg-[#dfc518] border-b-4 border-[#bda612] text-slate-900', // Amarillo Kahoot
      'bg-[#2EFB72] hover:bg-[#1ed65f] border-b-4 border-[#16a348] text-slate-900', // Verde Kahoot
      'bg-purple-500 hover:bg-purple-600 border-b-4 border-purple-800',
      'bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-800'
    ]
    return palette[index % palette.length]
  }

  // Formas geométricas decorativas
  const shapes = ['▲', '◆', '●', '■', '★', 'aaa']

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col min-h-screen justify-center animate-fade-in pb-20">
      
      {/* Barra de Progreso */}
      <div className="mb-8 flex justify-between items-end text-slate-500 font-bold uppercase tracking-wider text-sm">
        <span>Pregunta {questionNumber} de {totalQuestions}</span>
        <div className="flex gap-1">
            {/* Indicadores de progreso simples */}
            {Array.from({ length: totalQuestions }).map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i < questionNumber - 1 ? 'bg-[#2E9FFB]' : i === questionNumber - 1 ? 'bg-slate-800 animate-pulse' : 'bg-slate-200'}`} />
            ))}
        </div>
      </div>

      {/* Tarjeta de la Pregunta */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 text-center mb-8 min-h-[220px] flex items-center justify-center border border-slate-100 relative overflow-hidden">
        {/* Decoración sutil */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FB2E80] via-[#FBE02E] to-[#2E9FFB]"></div>
        
        <h2 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">
          {question.question_text}
        </h2>
      </div>

      {/* Grid de Respuestas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {question.options.map((opt, idx) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt.id)}
            disabled={isSubmitting}
            className={clsx(
              "relative rounded-2xl p-6 flex items-center shadow-lg transition-all active:scale-95 active:border-b-0 min-h-[100px]",
              getColors(idx),
              isSubmitting && "opacity-50 cursor-wait transform-none"
            )}
          >
            {/* Icono de forma */}
            <div className="absolute left-6 text-white/40 text-3xl font-black hidden sm:block">
                {shapes[idx % shapes.length]}
            </div>
            
            <span className={clsx(
                "w-full text-center text-xl md:text-2xl font-bold drop-shadow-sm",
                // Ajuste de color de texto para amarillo/verde claro
                [2, 3].includes(idx % 6) ? "text-slate-900/80" : "text-white"
            )}>
              {opt.option_text}
            </span>
          </button>
        ))}
      </div>

      {/* Overlay de Carga */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center border border-slate-100">
                <Loader2 className="h-10 w-10 text-[#2E9FFB] animate-spin mb-2" />
                <p className="font-bold text-slate-600">Enviando respuesta...</p>
            </div>
        </div>
      )}
    </div>
  )
}