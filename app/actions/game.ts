'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Genera un PIN numérico de 6 dígitos (ej: 849201)
function generatePIN() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function toggleSurveyStatus(surveyId: string, isActive: boolean) {
  const supabase = await createClient()

  // Si vamos a activar, generamos PIN. Si apagamos, borramos el PIN.
  const updates = {
    is_active: isActive,
    access_pin: isActive ? generatePIN() : null
  }

  const { error } = await supabase
    .from('surveys')
    .update(updates)
    .eq('id', surveyId)

  if (error) return { error: 'Error al cambiar estado' }

  revalidatePath(`/dashboard/teacher/surveys/${surveyId}`)
  return { success: true }
}