'use client'

import { createQuestion } from '@/app/actions/questions'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Check, Plus, Loader2, Trash2, X } from 'lucide-react'
import clsx from 'clsx'

export default function QuestionCreator({ surveyId }: { surveyId: string }) {
  const [state, dispatch, isPending] = useActionState(createQuestion, undefined)
  const formRef = useRef<HTMLFormElement>(null)
  
  // Estado dinámico de opciones. Empezamos con 2 vacías por defecto.
  const [options, setOptions] = useState<number[]>([0, 1]) 
  // Usamos un contador simple para generar IDs únicos de frontend
  const nextId = useRef(2)

  const [correctIndex, setCorrectIndex] = useState<number | null>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      setCorrectIndex(null)
      setOptions([0, 1]) // Resetear a 2 opciones
      nextId.current = 2
    }
  }, [state?.success])

  // Funciones para manipular la lista
  const addOption = () => {
    setOptions([...options, nextId.current])
    nextId.current += 1
  }

  const removeOption = (indexToRemove: number) => {
    if (options.length <= 2) return // Mínimo 2 opciones
    
    // Si borramos la que estaba marcada como correcta, reseteamos la selección
    if (correctIndex === indexToRemove) setCorrectIndex(null)
    // Si borramos una anterior a la correcta, ajustamos el índice
    else if (correctIndex !== null && indexToRemove < correctIndex) {
        setCorrectIndex(correctIndex - 1)
    }

    const newOptions = [...options]
    newOptions.splice(indexToRemove, 1)
    setOptions(newOptions)
  }

  // Colores cíclicos (si hay más de 4, repite colores)
  const getColors = (index: number) => {
    const palette = [
        'border-red-400 bg-red-50 focus-within:bg-white focus-within:ring-red-200',
        'border-blue-400 bg-blue-50 focus-within:bg-white focus-within:ring-blue-200',
        'border-yellow-400 bg-yellow-50 focus-within:bg-white focus-within:ring-yellow-200',
        'border-green-400 bg-green-50 focus-within:bg-white focus-within:ring-green-200',
        'border-purple-400 bg-purple-50 focus-within:bg-white focus-within:ring-purple-200',
        'border-orange-400 bg-orange-50 focus-within:bg-white focus-within:ring-orange-200'
    ]
    return palette[index % palette.length]
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 relative">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Plus className="h-5 w-5 text-[#2E9FFB]" />
        Agregar nueva pregunta
      </h3>

      <form ref={formRef} action={dispatch} className="space-y-6">
        <input type="hidden" name="surveyId" value={surveyId} />
        <input type="hidden" name="correct_index" value={correctIndex ?? ''} />

        {/* ENUNCIADO */}
        <div>
            <textarea
                name="question_text"
                required
                placeholder="Escribe tu pregunta aquí..."
                className="w-full p-4 text-lg font-medium rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2E9FFB] focus:ring-0 transition-all outline-none resize-none h-24 placeholder:text-slate-400"
            />
        </div>

        {/* LISTA DINÁMICA DE OPCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((optId, index) => (
                <div 
                    key={optId} // Usamos key única, no el índice, para evitar bugs de React al borrar
                    className={clsx(
                        "relative flex items-center p-2 rounded-xl border-2 transition-all duration-200 group",
                        getColors(index),
                        correctIndex === index ? "ring-4 ring-offset-2 ring-[#2E9FFB] border-[#2E9FFB] bg-white scale-[1.02] z-10" : "hover:scale-[1.01]"
                    )}
                >
                    {/* Botón Correcta */}
                    <button
                        type="button"
                        onClick={() => setCorrectIndex(index)}
                        className={clsx(
                            "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-3 transition-colors",
                            correctIndex === index 
                                ? "bg-[#2E9FFB] text-white shadow-md transform scale-110" 
                                : "bg-white/50 hover:bg-white text-slate-400 border-2 border-transparent hover:border-slate-200"
                        )}
                        title="Marcar como correcta"
                    >
                        <Check className="h-5 w-5" />
                    </button>

                    {/* Input - IMPORTANTE name="options" para el getAll del backend */}
                    <input
                        name="options"
                        required
                        placeholder={`Opción ${index + 1}`}
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-800 font-medium placeholder:text-slate-400/60"
                        autoComplete="off"
                    />

                    {/* Botón Eliminar (Solo si hay más de 2) */}
                    {options.length > 2 && (
                        <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="absolute -top-2 -right-2 bg-white text-slate-400 p-1 rounded-full shadow-sm border border-slate-200 hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all"
                            title="Eliminar opción"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
            ))}

            {/* BOTÓN PARA AGREGAR MÁS */}
            <button
                type="button"
                onClick={addOption}
                className="flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:text-[#2E9FFB] hover:border-[#2E9FFB] hover:bg-[#2E9FFB]/5 transition-all gap-2 font-bold min-h-[60px]"
            >
                <Plus className="h-5 w-5" />
                Agregar Opción
            </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {state?.error && (
                <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-bold border border-red-100">
                    ⚠️ {state.error}
                </div>
            )}
            
            <button
                type="submit"
                disabled={isPending}
                className="ml-auto bg-[#2E9FFB] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a8cd8] hover:shadow-lg hover:shadow-[#2E9FFB]/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Guardar Pregunta'}
            </button>
        </div>
      </form>
    </div>
  )
}