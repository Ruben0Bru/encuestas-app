'use client'

import { deleteCourse } from '@/app/actions/teacher'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTransition } from 'react'

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault() // Evitar que se abra el curso
    e.stopPropagation()

    // Usamos toast.promise para feedback visual elegante
    toast.promise(
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          const result = await deleteCourse(courseId)
          if (result.success) resolve(result)
          else reject(result.error)
        })
      }),
      {
        loading: 'Eliminando curso...',
        success: 'Curso eliminado correctamente',
        error: (err) => `Error: ${err}`,
      }
    )
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-slate-200 hover:border-red-200 z-20 relative group/btn"
      title="Eliminar curso"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 transform group-hover/btn:scale-110 transition-transform" />
      )}
    </button>
  )
}