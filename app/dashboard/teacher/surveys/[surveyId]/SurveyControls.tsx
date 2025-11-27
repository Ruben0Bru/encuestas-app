'use client'

import { toggleSurveyStatus } from '@/app/actions/game'
import { Play, Square, Loader2, Copy } from 'lucide-react'
import { useState } from 'react'

interface SurveyControlsProps {
  surveyId: string
  isActive: boolean
  pin: string | null
}

export default function SurveyControls({ surveyId, isActive, pin }: SurveyControlsProps) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    // Invertimos el estado actual
    await toggleSurveyStatus(surveyId, !isActive)
    setLoading(false)
  }

  // ESTADO ACTIVO: Mostramos el PIN y botón de terminar
  if (isActive && pin) {
    return (
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
                onClick={() => navigator.clipboard.writeText(pin)}
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
    )
  }

  // ESTADO INACTIVO: Botón de Iniciar
  return (
    <div className="flex gap-3">
      <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm">
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
  )
}