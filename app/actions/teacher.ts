'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

function generateCourseCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// AGREGADO: prevState: any
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