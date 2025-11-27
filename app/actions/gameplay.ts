'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitAnswer(attemptId: string, questionId: string, optionId: string) {
  const supabase = await createClient()

  // 1. Verificar si la opción elegida es la correcta
  const { data: option } = await supabase
    .from('options')
    .select('is_correct')
    .eq('id', optionId)
    .single()

  const isCorrect = option?.is_correct || false

  // 2. Guardar la respuesta
  const { error } = await supabase
    .from('answers')
    .insert({
      attempt_id: attemptId,
      question_id: questionId,
      option_id: optionId,
      is_correct: isCorrect
    })

  if (error) {
    console.error('Error guardando respuesta:', error)
    return { error: 'Error al enviar respuesta' }
  }

  // 3. Recargar la página. 
  // Al recargar, el servidor verá que esta pregunta ya fue respondida y mandará la siguiente.
  revalidatePath(`/dashboard/student/game/${attemptId}`)
  return { success: true }
}