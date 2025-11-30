'use client'

import { createTopic } from '@/app/actions/topics'
import { Plus } from 'lucide-react'
import { useActionState, useEffect, useRef } from 'react'

export default function CreateTopicForm({ courseId }: { courseId: string }) {
  const [state, dispatch, isPending] = useActionState(createTopic, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state?.success])

  return (
    <form ref={formRef} action={dispatch} className="mt-4 flex gap-3">
      {/* Input oculto para enviar el ID del curso */}
      <input type="hidden" name="courseId" value={courseId} />
      
      <div className="flex-1">
        <input 
          name="name" 
          placeholder="Nuevo tema (ej: Unidad 1)..." 
          required
          className="block w-full rounded-xl border-slate-200 py-3 px-4 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#FBE02E] focus:ring-2 focus:ring-[#FBE02E] sm:text-sm transition-all"
        />
        {state?.error && <p className="text-xs text-[#FB2E80] mt-2 font-medium">{state.error}</p>}
      </div>
      
      <button 
        type="submit" 
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-xl bg-[#FBE02E] px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#FBE02E]/30 hover:bg-[#FBE02E]/90 hover:shadow-[#FBE02E]/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 transition-all"
      >
        <Plus className="h-5 w-5" />
        {isPending ? '...' : 'Agregar'}
      </button>
    </form>
  )
}