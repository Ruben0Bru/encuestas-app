'use client'

import { updateProfile } from '@/app/actions/profile'
import { useActionState, useEffect } from 'react'
import { Loader2, Save, Check, User } from 'lucide-react'
import { toast } from 'sonner'

// Agregamos la prop opcional 'role'
export default function ProfileForm({ initialName, role = 'student' }: { initialName: string, role?: 'student' | 'teacher' }) {
  const [state, dispatch, isPending] = useActionState(updateProfile, undefined)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form action={dispatch} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <label htmlFor="full_name" className="block text-sm font-bold text-slate-700 ml-1">
          Nombre Completo
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-slate-400 group-focus-within:text-[#2E9FFB] transition-colors" />
          </div>
          <input
            name="full_name"
            defaultValue={initialName}
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#2E9FFB] focus:ring-2 focus:ring-[#2E9FFB]/20 transition-all duration-200 font-medium"
            placeholder="Escribe tu nombre completo"
          />
        </div>
        
        {/* TEXTO CONDICIONAL SEGÚN EL ROL */}
        <p className="text-xs text-slate-500 ml-1">
          {role === 'student' 
            ? "Este nombre será visible para tus profesores y en tus certificados."
            : "Este es el nombre que verán tus estudiantes en los cursos."
          }
        </p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#2E9FFB] to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Guardar Cambios
        </button>
      </div>
    </form>
  )
}