'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTopic(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const name = formData.get('name') as string
  const courseId = formData.get('courseId') as string

  if (!name || name.trim().length < 2) {
    return { error: 'El nombre del tema es muy corto.' }
  }

  // Verificar que el curso pertenece al profesor (Seguridad básica)
  const { data: course } = await supabase
    .from('courses')
    .select('teacher_id')
    .eq('id', courseId)
    .single()

  if (!course || course.teacher_id !== user.id) {
    return { error: 'No tienes permiso para editar este curso.' }
  }

  // Crear el tema
  const { error } = await supabase.from('topics').insert({
    course_id: courseId,
    name
  })

  if (error) {
    return { error: 'Error al crear el tema.' }
  }

  revalidatePath(`/dashboard/teacher/courses/${courseId}`)
  return { success: true }
}