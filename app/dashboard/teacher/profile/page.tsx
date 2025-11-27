
import { createClient } from '@/utils/supabase/server'
import { User, Mail, Shield, Sparkles, GraduationCap } from 'lucide-react'
import ProfileForm from '../../student/profile/ProfileForm'

export default async function TeacherProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header con Gradiente */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2E9FFB] to-blue-600 p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
        
        <div className="relative flex items-center gap-6">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 shadow-inner">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Perfil Docente</h1>
            <p className="text-blue-100 mt-1 text-lg font-medium">Gestiona tus datos personales y tu cuenta de profesor</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Información de la Cuenta */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#2E9FFB]" />
                    Detalles de Cuenta
                </h3>
                
                <div className="space-y-6">
                    <div className="group p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-[#2E9FFB] transition-colors">
                                <Mail className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 break-all pl-11">{user?.email}</p>
                    </div>

                    <div className="group p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-[#2E9FFB] transition-colors">
                                <GraduationCap className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rol</span>
                        </div>
                        <div className="pl-11">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                Docente
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400 text-center">
                        ID: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">{user?.id?.slice(0, 8)}...</span>
                    </p>
                </div>
            </div>
        </div>

        {/* Columna Derecha: Formulario de Edición */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 p-8 h-full">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-yellow-400/10 rounded-xl text-yellow-500">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Editar Información</h3>
                        <p className="text-sm text-slate-500">Actualiza cómo te ven tus estudiantes</p>
                    </div>
                </div>
                
                <ProfileForm initialName={profile?.full_name || ''} role="teacher" />
            </div>
        </div>

      </div>
    </div>
  )
}
