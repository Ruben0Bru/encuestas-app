'use client'

import { createSurvey } from '@/app/actions/surveys'
import { useActionState, useState } from 'react'
import { Plus, FileQuestion, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

type Survey = {
  id: string
  title: string
  is_active: boolean
}

type Topic = {
  id: string
  name: string
  surveys: Survey[]
}

export default function TopicCard({ topic }: { topic: Topic }) {
  const [isCreating, setIsCreating] = useState(false)
  const [state, dispatch, isPending] = useActionState(createSurvey, undefined)

  return (
    <div className="group flex flex-col p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#2E9FFB]/30 hover:shadow-md hover:shadow-[#2E9FFB]/5 transition-all duration-300">
      
      {/* Encabezado del Tema */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#2E9FFB] transition-colors">
            {topic.name}
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {topic.surveys.length} encuestas
          </p>
        </div>
      </div>

      {/* Lista de Encuestas */}
      <div className="space-y-2 mb-4">
        {topic.surveys.length > 0 && (
          <div className="pl-4 border-l-2 border-slate-100 space-y-2">
            {topic.surveys.map((survey) => (
              <Link
                key={survey.id}
                href={`/dashboard/teacher/surveys/${survey.id}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-[#2E9FFB] transition-colors text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <FileQuestion className="h-4 w-4 opacity-50" />
                  {survey.title}
                </div>
                <ChevronRight className="h-3 w-3 opacity-50" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Botón / Formulario de Crear */}
      <div className="mt-auto pt-2 border-t border-slate-50">
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="text-xs flex items-center gap-2 bg-[#2E9FFB]/10 text-[#2E9FFB] px-4 py-2 rounded-lg font-bold hover:bg-[#2E9FFB] hover:text-white transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            Nueva Encuesta
          </button>
        ) : (
          <form action={dispatch} className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
            <input type="hidden" name="topicId" value={topic.id} />
            <input
              name="title"
              placeholder="Título del quiz..."
              autoFocus
              className="flex-1 text-sm py-1.5 px-3 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2E9FFB] focus:ring-[#2E9FFB] transition-all outline-none border"
            />
            <button
              type="submit"
              disabled={isPending}
              className="p-2 bg-[#2E9FFB] text-white rounded-lg hover:bg-[#1a8cd8] disabled:opacity-50 transition-colors"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-red-500 px-2 font-medium"
            >
              Cancelar
            </button>
          </form>
        )}
        {state?.error && <p className="text-xs text-red-500 mt-2 font-medium">{state.error}</p>}
      </div>
    </div>
  )
}