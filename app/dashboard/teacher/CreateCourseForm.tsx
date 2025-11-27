'use client'

import { createCourse } from '@/app/actions/teacher'
import { Plus } from 'lucide-react'
import { useActionState, useEffect, useRef } from 'react'

export default function CreateCourseForm() {
  const [state, dispatch, isPending] = useActionState(createCourse, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  // Efecto para limpiar el formulario si se crea con éxito
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state?.success])

  return (
    <div className="w-full sm:w-auto">
      <form ref={formRef} action={dispatch} className="flex flex-col sm:flex-row gap-2">
        <div className="relative">
            <input 
            name="name" 
            placeholder="Nombre del nuevo curso..." 
            required
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
            {state?.error && (
                <p className="absolute -bottom-6 left-0 text-xs text-red-600 w-max">
                    {state.error}
                </p>
            )}
        </div>
        <button 
            type="submit" 
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-300 disabled:bg-yellow-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isPending ? 'Creando...' : 'Crear'}
        </button>
      </form>
    </div>
  )
}