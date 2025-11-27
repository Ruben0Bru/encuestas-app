'use client'

import { joinSurvey } from '@/app/actions/student'
import { useActionState } from 'react'
import { Play, Loader2 } from 'lucide-react'

export default function QuickPlayButton({ pin }: { pin: string }) {
  const [state, dispatch, isPending] = useActionState(joinSurvey, undefined)

  return (
    <form action={dispatch}>
      <input type="hidden" name="pin" value={pin} />
      <button 
        type="submit"
        disabled={isPending}
        className="bg-[#2E9FFB] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-[#1a8cd8] hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
        Jugar
      </button>
    </form>
  )
}