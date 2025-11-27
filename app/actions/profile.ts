'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'No autorizado' }

  const fullName = formData.get('full_name') as string

  if (!fullName || fullName.trim().length < 3) {
    return { error: 'El nombre es muy corto.' }
  }

  // Actualizar en la tabla profiles
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) return { error: 'Error al actualizar el perfil.' }

  // Actualizar metadata de auth (opcional, pero buena práctica para sincronizar)
  await supabase.auth.updateUser({
    data: { full_name: fullName }
  })

  revalidatePath('/dashboard/student/profile')
  revalidatePath('/dashboard/student') // Para que se actualice el saludo en el inicio
  
  return { success: true, message: 'Perfil actualizado correctamente.' }
}