'use client'

import { enrollInCourse } from '@/app/actions/enrollment'
import { useActionState, useEffect, useRef } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function EnrollCourseForm() {
  const [state, dispatch, isPending] = useActionState(enrollInCourse, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      formRef.current?.reset()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={dispatch} className="flex gap-2">
      <input
        name="access_code"
        placeholder="Código del curso (ej: X7K9P2)"
        required
        className="flex-1 min-w-0 rounded-xl border-slate-200 text-sm focus:border-[#2E9FFB] focus:ring-[#2E9FFB]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Unirse
      </button>
    </form>
  )
}