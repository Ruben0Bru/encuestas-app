'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createQuestion(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const surveyId = formData.get('surveyId') as string
  const questionText = formData.get('question_text') as string
  
  // Obtenemos el índice de la correcta
  const correctIndexStr = formData.get('correct_index')
  
  // Obtenemos TODAS las opciones enviadas como un array
  // El frontend debe ponerle name="options" a todos los inputs
  const optionsRaw = formData.getAll('options') as string[]

  // Validaciones
  if (!questionText) return { error: 'Escribe una pregunta.' }
  if (optionsRaw.length < 2) return { error: 'Mínimo 2 opciones.' }
  if (!correctIndexStr) return { error: 'Debes marcar una respuesta correcta.' }

  const correctIndex = parseInt(correctIndexStr as string)
  
  // Validar que el índice marcado exista (ej: si borró opciones y quedó desfasado)
  if (correctIndex >= optionsRaw.length) {
    return { error: 'La opción correcta marcada no es válida.' }
  }

  // 1. Guardar Pregunta
  const { data: question, error: qError } = await supabase
    .from('questions')
    .insert({
      survey_id: surveyId,
      question_text: questionText,
      order_index: 0 
    })
    .select()
    .single()

  if (qError) return { error: 'Error al guardar la pregunta' }

  // 2. Preparar Opciones Dinámicas
  const optionsToInsert = optionsRaw.map((optText, index) => ({
    question_id: question.id,
    option_text: optText || 'Opción vacía',
    is_correct: index === correctIndex
  }))

  // 3. Guardar Opciones
  const { error: oError } = await supabase
    .from('options')
    .insert(optionsToInsert)

  if (oError) return { error: 'Error al guardar las opciones' }

  revalidatePath(`/dashboard/teacher/surveys/${surveyId}`)
  return { success: true }
}

export async function deleteQuestion(questionId: string, surveyId: string) {
    const supabase = await createClient()
    await supabase.from('questions').delete().eq('id', questionId)
    revalidatePath(`/dashboard/teacher/surveys/${surveyId}`)
}