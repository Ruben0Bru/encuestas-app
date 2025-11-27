'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function joinSurvey(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const pin = formData.get('pin') as string

  // 1. Obtener usuario actual (el estudiante)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión' }

  // Validación básica del PIN
  if (!pin || pin.length !== 6) {
    return { error: 'El PIN debe tener 6 dígitos.' }
  }

  // 2. Buscar la encuesta por PIN y verificar que esté ACTIVA
  const { data: survey, error: surveyError } = await supabase
    .from('surveys')
    .select('id, title')
    .eq('access_pin', pin)
    .eq('is_active', true)
    .single()

  if (surveyError || !survey) {
    return { error: 'PIN incorrecto o la encuesta no está en vivo.' }
  }

  // 3. AQUÍ ESTÁ LA CLAVE: Crear el "Intento" (Attempt)
  // Esto registra que ESTE estudiante está jugando ESTA encuesta.
  const { data: attempt, error: attemptError } = await supabase
    .from('survey_attempts')
    .insert({
      survey_id: survey.id,
      student_id: user.id,
      score: 0,
      total_questions: 0,
      mastery_level: 'Nulo'
    })
    .select('id')
    .single()

  if (attemptError) {
    console.error(attemptError)
    // Si ya existe un intento, podríamos recuperarlo, pero por ahora damos error
    return { error: 'Error al unirse. Tal vez ya estás dentro.' }
  }

  // 4. Redirigir a la sala de juego con el ID del intento recién creado
  redirect(`/dashboard/student/game/${attempt.id}`)
}