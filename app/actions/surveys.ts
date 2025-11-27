'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createSurvey(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const title = formData.get('title') as string
  const topicId = formData.get('topicId') as string

  if (!title || title.trim().length < 3) {
    return { error: 'El título es muy corto.' }
  }

  const { data, error } = await supabase
    .from('surveys')
    .insert({
      creator_id: user.id,
      topic_id: topicId,
      title: title,
      access_pin: null,
    })
    .select('id')
    .single()

  if (error) {
    return { error: 'Error al crear la encuesta.' }
  }

  redirect(`/dashboard/teacher/surveys/${data.id}`)
}