'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Función auxiliar para generar códigos
function generateCourseCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Acción para CREAR curso
export async function createCourse(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const name = formData.get('name') as string
  const code = generateCourseCode()

  // Validación básica
  if (!name || name.trim().length < 3) {
    return { error: 'El nombre debe tener al menos 3 caracteres.' }
  }

  const { error } = await supabase.from('courses').insert({
    teacher_id: user.id,
    name,
    access_code: code,
    description: ''
  })

  if (error) {
    console.error(error)
    return { error: 'Error al crear el curso' }
  }

  revalidatePath('/dashboard/teacher')
  return { success: true }
}

// Acción para BORRAR curso (NUEVA)
export async function deleteCourse(courseId: string) {
  const supabase = await createClient()
  
  // 1. Verificar usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // 2. Borrar curso (Solo si pertenece al usuario actual)
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId)
    .eq('teacher_id', user.id) // Candado de seguridad

  if (error) {
    console.error("Error al borrar curso:", error)
    return { error: 'No se pudo borrar el curso. Inténtalo de nuevo.' }
  }

  // 3. Actualizar la vista del dashboard
  revalidatePath('/dashboard/teacher')
  return { success: true, message: 'Curso eliminado correctamente.' }
}