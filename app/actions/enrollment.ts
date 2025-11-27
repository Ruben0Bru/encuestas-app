'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function enrollInCourse(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const code = formData.get('access_code') as string

  // 1. Verificar usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión.' }

  if (!code || code.length < 6) return { error: 'Código inválido.' }

  // 2. Buscar el curso por código
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, name')
    .eq('access_code', code) // Ojo: en la DB debe ser access_code
    .single()

  if (courseError || !course) {
    return { error: 'No se encontró ningún curso con ese código.' }
  }

  // 3. Verificar si ya está inscrito
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_id', course.id)
    .eq('student_id', user.id)
    .single()

  if (existing) {
    return { error: 'Ya estás inscrito en este curso.' }
  }

  // 4. Inscribir (Estado 'active' directo para agilizar)
  const { error: enrollError } = await supabase
    .from('enrollments')
    .insert({
      course_id: course.id,
      student_id: user.id,
      status: 'active'
    })

  if (enrollError) {
    return { error: 'Error al inscribirse.' }
  }

  revalidatePath('/dashboard/student')
  return { success: true, message: `Te has unido a ${course.name}` }
}