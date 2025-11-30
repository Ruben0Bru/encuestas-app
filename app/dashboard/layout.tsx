import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, BookOpen, LayoutDashboard, History, User, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Verificar sesión
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  // 2. Obtener Rol
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isStudent = profile?.role === 'student'

  // Acción de Logout
  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#2E9FFB]/20 selection:text-[#2E9FFB]">
      {/* Navbar con Glassmorphism */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 shadow-sm transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-3 group">
              <div className="bg-gradient-to-tr from-[#FBE02E] to-yellow-500 p-2.5 rounded-xl text-slate-900 shadow-lg shadow-yellow-400/30 group-hover:shadow-yellow-400/40 group-hover:scale-105 transition-all duration-300">
                 <BookOpen className="h-5 w-5" />
              </div>
              <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-800 hidden sm:block group-hover:text-[#FBE02E] transition-colors">
                PEAI
              </Link>
            </div>

            {/* MENÚ CENTRAL */}
            <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
              {isStudent ? (
                // --- MENÚ ESTUDIANTE ---
                <>
                  <Link href="/dashboard/student" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#2E9FFB] hover:bg-white hover:shadow-sm rounded-full transition-all duration-200 flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> 
                    <span className="hidden md:inline">Inicio</span>
                  </Link>
                  <Link href="/dashboard/student/history" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#2E9FFB] hover:bg-white hover:shadow-sm rounded-full transition-all duration-200 flex items-center gap-2">
                    <History className="h-4 w-4" /> 
                    <span className="hidden md:inline">Historial</span>
                  </Link>
                  <Link href="/dashboard/student/courses" className="px-3 py-2 text-sm font-bold text-slate-600 hover:text-[#2E9FFB] hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> 
                    <span className="hidden md:inline">Cursos</span>
                  </Link>
                  <Link href="/dashboard/student/profile" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#2E9FFB] hover:bg-white hover:shadow-sm rounded-full transition-all duration-200 flex items-center gap-2">
                    <User className="h-4 w-4" /> 
                    <span className="hidden md:inline">Perfil</span>
                  </Link>
                </>
              ) : (
                // --- MENÚ DOCENTE ---
                <>
                  <Link href="/dashboard/teacher" className="px-3 py-2 text-sm font-bold text-slate-600 hover:text-[#2E9FFB] hover:bg-white hover:shadow-sm rounded-full transition-all duration-200 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> 
                    <span className="hidden md:inline">Mis Cursos</span>
                  </Link>
                  
                  {/* AGREGADO: Enlace Perfil */}
                  <Link href="/dashboard/teacher/profile" className="px-3 py-2 text-sm font-bold text-slate-600 hover:text-[#2E9FFB] hover:bg-white hover:shadow-sm rounded-full transition-all duration-200 flex items-center gap-2">
                    <User className="h-4 w-4" /> 
                    <span className="hidden md:inline">Perfil</span>
                  </Link>
                </>
              )}
            </div>

            {/* Usuario y Logout */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 hidden lg:block uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                {isStudent ? 'Estudiante' : 'Docente'}
              </span>
              <form action={signOut}>
                <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-all px-3 py-2 rounded-xl hover:bg-red-50 group" title="Cerrar Sesión">
                  <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </nav>
      
      {/* Contenido principal */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}