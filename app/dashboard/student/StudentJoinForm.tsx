'use client'

import { joinSurvey } from '@/app/actions/student'
import { useActionState } from 'react'
import { Hash, Loader2 } from 'lucide-react'

export default function StudentJoinForm() {
  const [state, dispatch, isPending] = useActionState(joinSurvey, undefined)

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl shadow-[#2E9FFB]/10 border border-slate-100">
      <form action={dispatch} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Hash className="h-6 w-6 text-slate-300" />
          </div>
          <input
            name="pin"
            type="text"
            maxLength={6}
            placeholder="000000"
            required
            className="block w-full pl-12 pr-4 py-4 text-center text-3xl font-mono font-bold tracking-[0.2em] text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-[#2E9FFB] focus:ring-[#2E9FFB] transition-all outline-none placeholder:text-slate-300"
            autoComplete="off"
          />
        </div>

        {state?.error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 animate-in slide-in-from-top-2">
            ⚠️ {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#2E9FFB] text-white text-xl font-bold py-4 rounded-2xl hover:bg-[#1a8cd8] hover:shadow-lg hover:shadow-[#2E9FFB]/25 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" /> Conectando...
            </span>
          ) : (
            'ENTRAR'
          )}
        </button>
      </form>
    </div>
  )
}