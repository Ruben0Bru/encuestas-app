'use client'

import { toggleSurveyStatus } from '@/app/actions/game'
import { Play, Square, Loader2, Copy, Eye, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import clsx from 'clsx'

interface SurveyControlsProps {
  surveyId: string
  isActive: boolean
  pin: string | null
  questions?: any[]
}

export default function SurveyControls({ surveyId, isActive, pin, questions = [] }: SurveyControlsProps) {
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    // Invertimos el estado actual
    await toggleSurveyStatus(surveyId, !isActive)
    setLoading(false)
  }

  const handleCopy = () => {
    if (pin) {
        navigator.clipboard.writeText(pin)
        toast.success('PIN copiado al portapapeles')
    }
  }

  return (
    <>
        {isActive && pin ? (
            // ESTADO ACTIVO
            <div className="flex flex-col md:flex-row items-center gap-6 animate-in zoom-in-50 duration-300">
                
                {/* TARJETA DEL PIN (Para proyectar) */}
                <div className="bg-white border-4 border-[#2E9FFB] rounded-2xl p-4 shadow-xl flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    PIN DE ACCESO
                </span>
                <div className="flex items-center gap-3">
                    <span className="text-5xl font-mono font-black text-slate-900 tracking-widest">
                        {pin}
                    </span>
                    <button 
                        onClick={handleCopy}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-[#2E9FFB] transition-colors"
                        title="Copiar PIN"
                    >
                        <Copy className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-green-600">EN VIVO</span>
                </div>
                </div>

                {/* BOTÓN TERMINAR */}
                <button 
                onClick={handleToggle}
                disabled={loading}
                className="bg-red-50 text-red-600 border-2 border-red-100 px-6 py-4 rounded-xl font-bold hover:bg-red-100 hover:border-red-200 transition-all flex items-center gap-2"
                >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Square className="h-5 w-5 fill-current" />}
                Terminar Actividad
                </button>
            </div>
        ) : (
            // ESTADO INACTIVO
            <div className="flex gap-3">
                <button 
                    onClick={() => setShowPreview(true)}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm flex items-center gap-2"
                >
                    <Eye className="h-4 w-4" />
                    Vista Previa
                </button>
                <button 
                    onClick={handleToggle}
                    disabled={loading}
                    className="bg-[#2E9FFB] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#1a8cd8] shadow-lg shadow-[#2E9FFB]/20 transition-all text-sm flex items-center gap-2"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                    Iniciar Juego
                </button>
            </div>
        )}

        {/* MODAL DE VISTA PREVIA */}
        {showPreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                    <div className="p-5 border-b flex justify-between items-center bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Eye className="h-5 w-5 text-[#2E9FFB]" /> Vista Previa del Cuestionario
                        </h3>
                        <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-900">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50 flex-1">
                        {questions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-400 font-medium">No hay preguntas creadas aún.</p>
                            </div>
                        ) : (
                            questions.map((q, idx) => (
                                <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex gap-4 mb-4">
                                        <span className="h-8 w-8 bg-[#2E9FFB]/10 text-[#2E9FFB] rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {idx + 1}
                                        </span>
                                        <h4 className="text-lg font-bold text-slate-800">{q.question_text}</h4>
                                    </div>
                                    <div className="grid gap-2 ml-12">
                                        {q.options.map((opt: any) => (
                                            <div key={opt.id} className={clsx(
                                                "px-4 py-3 rounded-xl border text-sm font-medium transition-colors",
                                                opt.is_correct 
                                                    ? "bg-green-50 border-green-200 text-green-700 ring-1 ring-green-200" 
                                                    : "bg-white border-slate-200 text-slate-600"
                                            )}>
                                                {opt.option_text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="p-4 border-t bg-white flex justify-end">
                        <button 
                            onClick={() => setShowPreview(false)} 
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                        >
                            Cerrar Vista Previa
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  )
}